from flask import Blueprint, request, jsonify
from models.job import Job
from db import db
from sqlalchemy import or_, and_

# Create a Blueprint to organize a group of related views and other code.
job_routes = Blueprint("job_routes", __name__)

# --- All routes should start with '/api' for consistency ---

# Endpoint to GET all jobs AND CREATE a new job
@job_routes.route("/api/jobs", methods=["GET", "POST"])
def handle_jobs():
    if request.method == "GET":
        query = Job.query
        
        job_type = request.args.get("job_type")
        if job_type: query = query.filter(Job.job_type.ilike(f"%{job_type}%"))

        location = request.args.get("location")
        if location: query = query.filter(Job.location.ilike(f"%{location}%"))
        
        keyword = request.args.get("keyword")
        if keyword:
            search_term = f"%{keyword}%"
            query = query.filter(or_(Job.title.ilike(search_term), Job.company.ilike(search_term), Job.tags.ilike(search_term)))

        tags = request.args.get("tags")
        if tags:
            tags_to_filter = [tag.strip() for tag in tags.split(",")]
            tag_conditions = [Job.tags.ilike(f"%{tag}%") for tag in tags_to_filter]
            if tag_conditions: query = query.filter(and_(*tag_conditions))
        
        sort_by = request.args.get('sort')
        if sort_by == 'oldest':
            # Sort by the 'posting_date' column in ascending order
            query = query.order_by(Job.posting_date.asc())
        else: 
            # Sort by the 'posting_date' column in descending order(default)
            query = query.order_by(Job.posting_date.desc())

        jobs = query.all()
        return jsonify([job.to_dict() for job in jobs]), 200

    elif request.method == "POST":
        data = request.get_json()
        if not all(key in data for key in ["title", "company", "location"]):
            return jsonify({"error": "Missing required fields: title, company, location"}), 400
        
        new_job = Job(
            title=data["title"],
            company=data["company"],
            location=data["location"],
            posting_date=data.get("posting_date", ""),
            job_type=data.get("job_type", ""),
            tags=data.get("tags", ""),
            # source is set to 'manual' by default in the model
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify(new_job.to_dict()), 201


# Endpoints for a specific job ID
@job_routes.route("/api/jobs/<int:id>", methods=["GET", "PUT", "PATCH", "DELETE"])
def handle_job(id):
    job = Job.query.get(id)
    if job is None:
        return jsonify({"error": "Job not found"}), 404

    if request.method == "GET":
        return jsonify(job.to_dict()), 200

    elif request.method in ["PUT", "PATCH"]:
        data = request.get_json()
        job.title = data.get("title", job.title)
        job.company = data.get("company", job.company)
        job.location = data.get("location", job.location)
        job.posting_date = data.get("posting_date", job.posting_date)
        job.job_type = data.get("job_type", job.job_type)
        job.tags = data.get("tags", job.tags)
        db.session.commit()
        return jsonify(job.to_dict()), 200

    elif request.method == "DELETE":
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": "Job deleted successfully"}), 200