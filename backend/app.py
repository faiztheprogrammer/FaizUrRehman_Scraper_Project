from flask import Flask
from flask_cors import CORS
from config import DATABASE_URI
from db import db
from models.job import Job

# Import the blueprint
from routes.job_routes import job_routes

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(job_routes)



if __name__ == "__main__":
    app.run(debug=True, port=5000)
