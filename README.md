# ActuarialAxis - Full-Stack Job Board

ActuarialAxis is a complete full-stack web application designed to list, manage, and filter actuarial job postings. It features a modern, responsive frontend built with React, a robust RESTful API powered by Flask, and a dynamic web scraper using Selenium to populate the job board with real-time data from Actuary List.

**Video UrL(Google Drive):**https://drive.google.com/file/d/1K3I9xkwS4ufSMIERcgiZNpICAuHGnetT/view?usp=sharing
---

## Features

-   **Full CRUD Functionality:** Create, Read, Update, and Delete job listings seamlessly.
-   **Dynamic "Live" Filtering:** Filter jobs by keyword, location, job type, and multiple tags with results that update in real-time as you type or select options.
-   **Advanced Sorting:** Sort job listings by date (newest or oldest first).
-   **Automated Web Scraping:** A Selenium-based scraper navigates the first 2 pages of the target site to populate the database with fresh job data.
-   **Modern UI/UX:** A professional, responsive interface with a sticky shrinking header, collapsible sidebar, and interactive modals for a premium user experience.
-   **Robust Feedback:** The application provides clear success messages, loading states, and detailed client-side and server-side error validation.

---

## Technology Stack

-   **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS
-   **Frontend:** JavaScript, React, Vite, Tailwind CSS, Axios
-   **Database:** MySQL
-   **Web Scraping:** Python, Selenium, Requests

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have the following software installed on your machine:
-   **Python:** Version 3.10 or newer
-   **Node.js:** Version 18.x or newer
-   **NPM:** (Comes bundled with Node.js)
-   **MySQL:** A running instance of a MySQL server (e.g., via MySQL Workbench, Docker, or a local installation).

### Setup & Installation

The project is divided into three main parts: **Backend**, **Frontend**, and **Scraper**. Each needs to be set up in its own terminal.

#### 1. Backend Setup

First, create the database in your MySQL instance that the application will use.

```sql
CREATE DATABASE job_board_db;
```

Now, set up the Python environment and dependencies for the Flask server.

##### 1. Navigate to the backend directory

```sql
cd backend
```

##### 2. Create and activate a Python virtual environment

```sql
python -m venv venv
```

##### On Windows:

```sql
venv\Scripts\activate
```

##### On macOS/Linux:

```sql
source venv/bin/activate
```

#####  3. Install the required packages

```sql
pip install -r requirements.txt
```

#####  4. Configure your database connection
Create a file named '.env' in the 'backend' directory.
Copy the contents below into it and fill in your MySQL credentials.

```sql
DB_USER = your_mysql_username
DB_PASSWORD = your_mysql_password
DB_HOST = localhost
DB_NAME = job_board_db
```

#####  5. Create the database tables
In the same terminal (with venv active):
On Windows:
```sql
set FLASK_APP = app.py
```

On macOS/Linux:
```sql
export FLASK_APP = app.py
flask shell
```

Inside the Flask shell, run these Python commands:

```sql
>>> from db import db
>>> db.create_all()
>>> exit()
```

#### 2. Frontend Setup
Navigate to the frontend directory
```sql
cd frontend
```

Install all npm dependencies
```sql
npm install
```

#### 3. Scraper Setup

Navigate to the Scraper directory
```sql
cd Scraper
```

#### 2. Create and activate a new Python virtual environment for the scraper
```sql
python -m venv venv
```

On Windows:
```sql
venv\Scripts\activate
```

On macOS/Linux:
```sql
source venv/bin/activate
```

#### 3. Install the required scraping packages
```sql
pip install -r requirements.txt
```

#### 4. Install the correct ChromeDriver
-   Check your Google Chrome version (e.g., 120.0.6099.129).
-   Go to the Chrome for Testing dashboard: https://googlechromelabs.github.io/chrome-for-testing/
-   Find the 'Stable' version that matches your browser version.
-   In that section, find the row for 'chromedriver' and 'win64'. Copy the URL to download the zip file.
-   Unzip the downloaded file and move the 'chromedriver.exe' file into this 'Scraper' folder.


### Running the Application
You will need **three separate terminals** open to run the full application.

#### Terminal 1: Start the Backend Server
```sql
cd backend
venv\Scripts\activate
python app.py
```

Your Flask API should now be running on http://127.0.0.1:5000


#### Terminal 2: Start the Frontend Development Server

```sql
cd frontend
npm run dev
```

Your React application should now be accessible at http://localhost:5173

#### Terminal 3: Run the Web Scraper
**Note:** Ensure the backend server is running before you run the scraper.

```sql
cd Scraper
venv\Scripts\activate (for windows)
python scrape.py
```

The scraper will launch a Chrome window, scrape 3 pages of jobs from Actuary List, clear your database, and load the newly scraped jobs. You can then see the data on your running React application.




### Project Structure & Technology Decisions
The project is organized into three distinct parts to maintain a clear separation of concerns, which is standard practice in modern web development.

-   **/backend:** Contains the Flask application, including API routes (/routes), the database model (/models), and database configuration (config.py, db.py). This structure, using Blueprints, keeps the API logic modular and scalable.
-   **/frontend:** Contains the React (Vite) application. All reusable UI elements (Header.jsx, JobCard.jsx, etc.) are kept in the /src directory for simplicity, with App.jsx acting as the central state manager and orchestrator. Tailwind CSS was chosen for its rapid and utility-first styling capabilities.
-   **/Scraper:** A self-contained Python script with its own virtual environment. It uses Selenium to control a browser and interact with dynamic web pages, and the requests library to communicate with our backend API.




### Assumptions & Shortcuts

To meet the project's goals within the given timeframe, the following decisions were made:

-   **No User Authentication:** The application is public, without any login or user-specific functionality.

-   **Flat Component Structure:** For simplicity and to avoid complex module resolution issues during development, all React components are stored directly in the src/ directory rather than nested subfolders.

-   **Limited Scraper Scope:** The scraper is configured by default to fetch the first 3 pages (~90 jobs) to demonstrate pagination functionality without scraping the entire site, which could be time-consuming and strain the target website's servers. This can be easily changed by modifying the MAX_PAGES_TO_SCRAPE variable.

-   **String-Based Tags:** Job tags are stored as a single comma-separated string in the database for simplicity, rather than implementing a more complex many-to-many relationship.


