from board import db, login_manager
from flask import request
from datetime import datetime
from flask_login import UserMixin

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    page_name = db.Column(db.String(200),  nullable=False)
    visits = db.relationship("Visit", backref="page", lazy=True)

    @property
    def visit_count(self):
        return len(self.visits)
    
    def __repr__(self):
        return f"History('{self.page_name}', '{self.visit_count}')"
    

class Visit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    date = db.Column(db.DateTime,  nullable=False, default=datetime.now())
    ip_address = db.Column(db.String(100),  nullable=False, default=lambda: request.environ["REMOTE_ADDR"])
    history_id = db.Column(db.Integer, db.ForeignKey('history.id'), nullable=False)
    
    def __repr__(self):
        return f"Visit('{self.date}', '{self.ip_address}')"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    
    username = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(60) , unique=True, nullable=False)
    
    def __repr__(self):
        return f"User('{self.username}')"

