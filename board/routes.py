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
    Payment,
    Resident,
    Apartment,
    Apartment_user,
    Apartment_admin,
    ika,
)
from flask_login import login_user, current_user, logout_user
import os, datetime
from dateutil import parser


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def track_visit(page_name):
    history = History.query.filter_by(page_name=page_name).first()

    if not history:
        history = History(page_name=page_name)
        db.session.add(history)
        db.session.commit()

    visit = Visit(history_id=history.id)
    db.session.add(visit)
    db.session.commit()


@app.route("/home")
@app.route("/")
def home():
    track_visit("home")
    return render_template("pages/home.html")


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


@app.errorhandler(404)
def error_404(e):
    return render_template("errors/404.html"), 404


@app.errorhandler(500)
def error_500(e):
    return render_template("errors/500.html"), 500


@app.errorhandler(401)
def error_401(e):
    return render_template("errors/401.html"), 401


@app.route("/invalid_user")
def error_invalid_user():
    return render_template("errors/invalid_user.html")


# ?______________________________________________________________________
@app.route("/hearts8")
def hearts8():
    track_visit("hearts8")
    return render_template("pages/hearts8.html")


@app.route("/1025438697")
def _1025438697():
    track_visit("1025438697")
    return render_template("pages/1025438697.html")


@app.route("/_")
def _():
    track_visit("_")
    return render_template("pages/_.html")


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static/image"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )


# ?______________________________________________________________________
@app.route("/useless_projects")
def useless_projects():
    track_visit("useless_projects")
    return render_template("useless_projects/useless_home_page.html")


@app.route("/useless_projects/balloons")
def balloons():
    track_visit("useless_projects/balloons")
    return render_template("useless_projects/balloons.html")


@app.route("/useless_projects/howmuchmoneyleft")
def howmuchmoneyleft():
    track_visit("useless_projects/howmuchmoneyleft")
    return render_template("useless_projects/howmuchmoneyleft.html")


@app.route("/useless_projects/ika")
def ika():
    track_visit("useless_projects/ika")
    return render_template("useless_projects/ika.html")


# ?______________________________________________________________________


@app.route("/apartmanim", methods=["GET", "POST"])
def apartmanim_login():
    track_visit("apartmanim/login")

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first()
        try:
            if user.role == "apartment_admin":
                if user and bcrypt.check_password_hash(user.password, password):
                    login_user(user)
                    return redirect("/apartmanim/admin_panel")
                else:
                    flash("Hatalı Şifre!")

            if (
                user.role == "apartment_user"
            ):  # ? i will come here later. i am building admin panel first.
                if user and bcrypt.check_password_hash(user.password, password):
                    login_user(user)
                    return redirect("/apartmanim/user_panel")
        except AttributeError:
            return redirect(url_for("error_invalid_user"))

    return render_template("apartmanim/login_page.html")


login_manager.login_view = "apartmanim_login"


@app.route("/apartmanim/logout")
def logout():
    logout_user()
    return redirect("/apartmanim")


# * apartment administrator control panel
@app.route("/apartmanim/admin_panel")
@login_required(role="apartment_admin")
def admin_panel():
    apartment_id = current_user.apartment_id
    residents = Apartment.query.get(apartment_id).residents

    tmp = 0
    try:
        for i in residents:
            tmp += i.debt
    except:
        pass

    return render_template(
        "apartmanim/admin_panel.html", residents=residents, total_debt=tmp
    )


@app.route("/apartmanim/admin_panel/add_user", methods=["GET", "POST"])
@login_required(role="apartment_admin")
def add_user():
    apartment_id = current_user.apartment_id
    residents = Apartment.query.get(apartment_id).residents

    if request.method == "POST":
        name = request.form.get("name")
        surname = request.form.get("surname")
        door_number = request.form.get("door_number")
        phone_number = request.form.get("phone_number")

        resident = Resident(
            name=name,
            surname=surname,
            door_number=door_number,
            phone_number=phone_number,
            apartment_id=apartment_id,
        )
        db.session.add(resident)
        db.session.commit()
        return redirect(url_for("add_user"))

    return render_template("apartmanim/add_user.html", residents=residents)


@app.route("/apartmanim/admin_panel/delete_user/<int:resident_id>", methods=["POST"])
@login_required(role="apartment_admin")
def delete_user(resident_id):

    resident = Resident.query.get(resident_id)
    if resident.total_payment == 0:
        db.session.delete(resident)
        db.session.commit()
    else:
        for p in resident.payments:  # ? p's are payment objects
            #! first delete payments then delete resident otherwise gives error
            db.session.delete(p)
        db.session.delete(resident)
        db.session.commit()

    return redirect(url_for("add_user"))


@app.route("/apartmanim/admin_panel/resident_page/<int:resident_id>")
@login_required(role="apartment_admin")
def resident_page(resident_id):
    resident = Resident.query.get(resident_id)
    print(resident.payments)
    return render_template("apartmanim/resident_page.html", resident=resident)


@app.route("/apartmanim/admin_panel/payment_record", methods=["GET", "POST"])
@login_required(role="apartment_admin")
def payment_record():
    apartment_id = current_user.apartment_id
    residents = Apartment.query.get(apartment_id).residents

    if (
        request.method == "POST"
    ):  #! it doesn't make payment accuracy check! Look here later.

        door_number = request.form.get("door_number")
        amount = request.form.get("amount")
        date = request.form.get("date")

        dt = parser.parse(date)
        date = datetime.date(dt.year, dt.month, dt.day)

        resident = Resident.query.filter_by(door_number=int(door_number)).first_or_404()

        def makbuz(makbuz_no):
            from board.receipt import create_aidat_makbuzu
            from board.int2str import int2str

            if request.form.get("makbuz"):
                print("Makbuz Oluşturuluyor..")
                now = datetime.datetime.today().strftime("%d/%m/%Y")

                create_aidat_makbuzu(
                    daire_no=str(door_number),
                    ay_yil=f"{dt.month}/{dt.year}",
                    tarih=str(now),
                    makbuz_no=makbuz_no,
                    tutar=amount,
                    yazi_ile=int2str(f"{amount}"),
                    alan_ad=f"{resident.name} {resident.surname}",
                    veren_ad=" ",
                    masraflar_list=[(" ", " ")],
                )
            # send_file()

        try:
            if resident.last_payment_date.month == dt.month:
                flash(f"Daire {door_number} bu ay zaten aidat verdi!")
            else:
                payment = Payment(resident_id=resident.id, amount=amount, date=date)
                db.session.add(payment)
                db.session.commit()
                
                payment_id = Payment.query.filter_by(resident_id=resident.id).order_by(Payment.id.desc()).first().id
                makbuz(payment_id)
                
                return redirect(url_for("payment_record"))

        except Exception as e:
            # ? first payment gives error because last_payment_date is null

            payment = Payment(resident_id=resident.id, amount=amount, date=date)
            db.session.add(payment)
            db.session.commit()
            
            
            return redirect(url_for("payment_record"))

    return render_template("apartmanim/payment_record.html", residents=residents)


@app.route("/apartmanim/admin_panel/delete_payment/<int:payment_id>", methods=["POST"])
@login_required(role="apartment_admin")
def delete_payment(payment_id):

    payment = Payment.query.get(payment_id)
    db.session.delete(payment)
    db.session.commit()

    return redirect(url_for("resident_page", resident_id=payment.resident_id))




@app.route("/apartmanim/admin_panel/financial", methods=["GET", "POST"])
@login_required(role="apartment_admin")
def financial():
    
    if request.method == "POST":
        pass
    
    return render_template("apartmanim/financial.html")


# ?-----------------------------------------------
# * apartment resident info page
@app.route("/apartmanim/user_panel")
@login_required(role="apartment_user")
def user_panel():

    return render_template("apartmanim/user_panel.html")
