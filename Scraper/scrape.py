import json
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

# --- Configuration ---
CHROME_DRIVER_PATH = "./chromedriver.exe"
TARGET_URL = "https://www.actuarylist.com/"
API_ENDPOINT = "http://127.0.0.1:5000/api/jobs"
MAX_PAGES_TO_SCRAPE = 2
SCRAPER_SOURCE_ID = "actuarylist.com"


def scrape_latest_jobs():
    print("--- Starting Selenium Scraper ---")

    service = Service(executable_path=CHROME_DRIVER_PATH)
    driver = webdriver.Chrome(service=service)
    wait = WebDriverWait(driver, 10)

    latest_unique_jobs = []
    processed_identifiers = set()

    try:
        driver.get(TARGET_URL)
        for page_num in range(1, MAX_PAGES_TO_SCRAPE + 1):
            print(f"Scraping Page {page_num}...")
            wait.until(EC.presence_of_element_located((By.ID, "__NEXT_DATA__")))
            time.sleep(2)
            script_element = driver.find_element(By.ID, "__NEXT_DATA__")
            json_text = script_element.get_attribute("textContent")
            data = json.loads(json_text)
            job_listings_raw = data["props"]["pageProps"]["filteredJobs"]
            print(f"  > Found {len(job_listings_raw)} raw job entries on this page.")

            for job_data_raw in job_listings_raw:
                title = job_data_raw.get("position", "N/A")
                company_data = job_data_raw.get("company")
                company = (
                    company_data.get("name")
                    if isinstance(company_data, dict)
                    else company_data
                    if isinstance(company_data, str)
                    else "N/A"
                )
                identifier = (title.lower(), company.lower())

                if identifier in processed_identifiers:
                    continue
                processed_identifiers.add(identifier)
                if title == "N/A" or company == "N/A":
                    continue

                posted_date = job_data_raw.get("created_at", "").split("T")[0]
                cities = job_data_raw.get("cities", [])
                location_string = ", ".join(cities)
                sectors = job_data_raw.get("sectors", [])
                experience_levels = job_data_raw.get("experience_levels", [])
                other_tags = job_data_raw.get("tags", [])
                all_tags_list = list(set(sectors + experience_levels + other_tags))
                tags_string = ", ".join(all_tags_list)
                job_type = experience_levels[0] if experience_levels else "Full-time"

                # We MUST add the source field to the dictionary here
                latest_unique_jobs.append(
                    {
                        "title": title,
                        "company": company,
                        "location": location_string,
                        "posting_date": posted_date,
                        "job_type": job_type,
                        "tags": tags_string,
                        "source": SCRAPER_SOURCE_ID,
                    }
                )

            if page_num < MAX_PAGES_TO_SCRAPE:
                try:
                    next_button = wait.until(
                        EC.presence_of_element_located(
                            (By.XPATH, "//button[text()='Next']")
                        )
                    )
                    driver.execute_script("arguments[0].click();", next_button)
                    time.sleep(5)
                except TimeoutException:
                    print("No more pages found.")
                    break
    finally:
        if driver:
            driver.quit()
        print("Browser closed.")

    print(f"\nScraping complete. Processed into {len(latest_unique_jobs)} unique jobs.")
    return latest_unique_jobs


def synchronize_database(latest_jobs):
    print("\n--- Starting Database Synchronization ---")
    try:
        response = requests.get(API_ENDPOINT, timeout=10)
        response.raise_for_status()
        db_jobs_all = response.json()

        db_jobs_scraped = [
            j for j in db_jobs_all if j.get("source") == SCRAPER_SOURCE_ID
        ]

        latest_jobs_set = {
            (j["title"].lower(), j["company"].lower()) for j in latest_jobs
        }
        db_jobs_scraped_set = {
            (j["title"].lower(), j["company"].lower()): j["id"] for j in db_jobs_scraped
        }

        # DELETE jobs that are in our DB (as scraped) but NOT in the new list
        jobs_to_delete_ids = [
            db_id
            for identifier, db_id in db_jobs_scraped_set.items()
            if identifier not in latest_jobs_set
        ]
        print(f"Found {len(jobs_to_delete_ids)} old scraped jobs to delete.")
        if jobs_to_delete_ids:
            for job_id in jobs_to_delete_ids:
                requests.delete(f"{API_ENDPOINT}/{job_id}")

        # ADD jobs that are in the new list but NOT in our DB at all
        db_jobs_all_set = {
            (j["title"].lower(), j["company"].lower()) for j in db_jobs_all
        }
        jobs_to_add = [
            j
            for j in latest_jobs
            if (j["title"].lower(), j["company"].lower()) not in db_jobs_all_set
        ]
        print(f"Found {len(jobs_to_add)} new jobs to add.")
        if jobs_to_add:
            for job_data in jobs_to_add:
                requests.post(API_ENDPOINT, json=job_data)

        print("Synchronization complete.")

    except requests.exceptions.RequestException as e:
        print(f"CRITICAL ERROR during synchronization: {e}")


if __name__ == "__main__":
    latest_jobs_list = scrape_latest_jobs()
    if latest_jobs_list:
        synchronize_database(latest_jobs_list)
    else:
        print("No jobs were scraped, skipping database synchronization.")
