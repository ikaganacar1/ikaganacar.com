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
from board.routes.main_routes import track_visit


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



@app.route("/admin", methods=["GET", "POST"])
def admin():
    track_visit("admin")

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first()
        if user.role == "ika":
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for("panel"))
            else:
                flash("Wrong user name or password!")  #! not working 06/10/2024

    return render_template("pages/admin.html")


@app.route("/admin/panel", methods=["GET", "POST"])
@login_required(role="ika")
def panel():
    histories = History.query.all()

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        apartment_name = request.form.get("apartment_name")

        try:
            apartment_id = (
                Apartment.query.filter_by(name=apartment_name).first_or_404().id
            )
        except Exception as _:
            new_apartment = Apartment(name=apartment_name)
            db.session.add(new_apartment)
            db.session.commit()

            apartment_id = (
                Apartment.query.filter_by(name=apartment_name).first_or_404().id
            )

        apartment_admin = Apartment_admin(
            username=username,
            role="apartment_admin",
            apartment_id=apartment_id,
            password=bcrypt.generate_password_hash(password).decode("utf-8"),
        )

        db.session.add(apartment_admin)
        db.session.commit()

    return render_template("pages/panel.html", histories=histories)


