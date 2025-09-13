from db import db

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    posting_date = db.Column(db.String(50)) # Using String for flexibility with scraped dates
    job_type = db.Column(db.String(50))
    tags = db.Column(db.String(200))
    source = db.Column(db.String(50), default='manual', nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'posting_date': self.posting_date,
            'job_type': self.job_type,
            'tags': self.tags,
            'source': self.source
        }