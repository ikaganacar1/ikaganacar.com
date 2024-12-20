from flask import Flask
from sqlalchemy import create_engine, MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

import os

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.app_context().push()
application = app
app.config["SECRET_KEY"] = open("board/secret_key.txt", "r").readline()
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "site.db")

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

from board import routes

from flask_migrate import Migrate
migrate = Migrate(app, db)