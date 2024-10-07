from flask import render_template, send_from_directory, url_for, request, flash, redirect, abort, current_app
from board import app, db, bcrypt, login_manager
from board.models import History, Visit, User, Payment, Resident
from flask_login import login_user,current_user
import os


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
    track_visit('home')
    return render_template("pages/home.html")

@app.route("/admin",methods=['GET','POST'])
def admin():
    track_visit('admin')
    
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user.role == 'ika':
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for('panel'))
            else:
                flash('Wrong user name or password!') #! not working 06/10/2024


        
    return render_template("pages/admin.html")



from functools import wraps
def login_required(role="ANY"):
    def wrapper(fn):
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            if not current_user.is_authenticated:
              return login_manager.unauthorized()
            if ((current_user.role != role) and (role != "ANY")):
                abort(403)
                return login_manager.unauthorized()
            return fn(*args, **kwargs)
        return decorated_view
    return wrapper

@app.route('/admin/panel')
@login_required(role='ika')
def panel():
    histories = History.query.all()
    return render_template('pages/panel.html', histories=histories)

@app.errorhandler(404)
def error_404(e):
  return render_template('errors/404.html'), 404

@app.errorhandler(500)
def error_500(e):
  return render_template('errors/500.html'), 500

#?______________________________________________________________________
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

@app.route("/apartmanım",methods=['GET','POST'])
def apartmanım_login():
    track_visit("apartmanım/login")
    
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user.role == 'admin':
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return redirect('/apartmanım/admin_panel')
            
        if user.role == 'user':
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return redirect("/apartmanım/user_panel")
        
    return render_template("apartmanım/login_page.html")


#* apartment administrator control panel
@app.route('/apartmanım/admin_panel')
@login_required(role='admin')
def admin_panel():
    residents = Resident.query.all()
    return render_template('apartmanım/admin_panel.html',residents=residents)


@app.route('/apartmanım/admin_panel/add_user',methods=['GET','POST'])
@login_required(role='admin')
def add_user():
    residents = Resident.query.all()
    
    if request.method == "POST":
        name = request.form.get('name')
        surname = request.form.get('surname')
        door_number = request.form.get('door_number')
        phone_number = request.form.get('phone_number')
        
        resident = Resident(name=name,surname=surname,door_number=door_number,phone_number=phone_number)
        db.session.add(resident)
        db.session.commit()
        return redirect(url_for('add_user'))
        
        
    return render_template('apartmanım/add_user.html',residents=residents)

@app.route('/apartmanım/admin_panel/delete_user/<int:resident_id>',methods=['POST'])
@login_required(role='admin')
def delete_user(resident_id):
    
    
    resident = Resident.query.get(resident_id)
    if resident.total_payment == 0:
        db.session.delete(resident)
        db.session.commit()
    else:
        for p in resident.payments:#? p's are payment objects
            print(p) #! first delete payments then delete resident otherwise gives error
    
    return redirect(url_for('add_user'))
    
    

#?-----------------------------------------------
#* apartment resident info page
@app.route('/apartmanım/user_panel')
@login_required(role='user')
def user_panel():

    return render_template('apartmanım/user_panel.html')

