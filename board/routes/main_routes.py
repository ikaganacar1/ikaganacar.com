from flask import (
    render_template,
    send_from_directory,
    url_for,
    request,
    flash,
    redirect,
    abort,
    current_app,
    send_file,
)
from board import app, db, bcrypt, login_manager, bcrypt
from board.models import (
    History,
    Visit,
    User,
    Apartment,
    Apartment_admin,

)

from flask_login import login_user, current_user, logout_user
import os

#? Functions -----------------------------------------------
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


from functools import wraps
def login_required(role="ANY"):
    def wrapper(fn):
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            if not current_user.is_authenticated:
                return login_manager.unauthorized()
            if (current_user.role != role) and (role != "ANY"):
                abort(403)
                return login_manager.unauthorized()
            return fn(*args, **kwargs)

        return decorated_view

    return wrapper


def track_visit(page_name):
    history = History.query.filter_by(page_name=page_name).first()

    if not history:
        history = History(page_name=page_name)
        db.session.add(history)
        db.session.commit()

    visit = Visit(history_id=history.id)
    db.session.add(visit)
    db.session.commit()



#? Routes -----------------------------------------------
@app.route("/home")
@app.route("/")
def home():
    track_visit("home")
    return render_template("pages/home.html")


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static/image"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )


@app.route("/donation")
def donation():
    track_visit("useless_projects/ika")
    return render_template("pages/donation.html")


@app.route("/test_page")
def test_page():
    return render_template("test_page/test_page.html")
