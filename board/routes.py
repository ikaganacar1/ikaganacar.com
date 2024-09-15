from flask import render_template, send_from_directory, url_for, request, flash, redirect
from board import app, db, bcrypt, login_manager
from board.models import History, Visit, User
from flask_login import login_user, login_required
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
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('panel'))
        else:
            flash('Wrong user name or password!')
    
    return render_template("pages/admin.html")

@app.route('/admin/panel')
@login_required
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