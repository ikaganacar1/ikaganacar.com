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
app.config["SECRET_KEY"] = open("board/secret_key.txt", "r").readlines()[0]
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "site.db")

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(app, metadata=metadata)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

from board.routes import (
    main_routes,
    admin_routes,
    useless_projects_routes,
    error_routes,
    apartment_routes,
    movie_collection_routes
)

from flask_migrate import Migrate
migrate = Migrate(app, db,render_as_batch=True)