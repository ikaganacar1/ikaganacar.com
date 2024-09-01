#python -m flask --app board run --port 8000 --debug
#Set-ExecutionPolicy Unrestricted -Scope Process             
#./venv/Scripts/activate  
#set FLASK_APP=app.py 
#python -m flask run
from flask import Flask
from flask import render_template, send_from_directory
import os
import flask_monitoringdashboard as dashboard

app = Flask(__name__)

dashboard.config.init_from(file='board/config.cfg')

application = app

@app.route("/")
def home():
    return render_template("pages/home.html")

@app.route("/hearts8")
def hearts8():
    return render_template("pages/hearts8.html")

@app.route("/1025438697")
def _1025438697():
    return render_template("pages/1025438697.html")

@app.route("/_")
def _():
    return render_template("pages/_.html")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/image'),'favicon.ico',mimetype='image/vnd.microsoft.icon')

#?______________________________________________________________________

@app.route("/useless_projects")
def useless_projects():
    return render_template("useless_projects/useless_projects.html")

@app.route("/useless_projects/howmuchmoneyleft")
def howmuchmoneyleft():
    return render_template("useless_projects/howmuchmoneyleft.html")



dashboard.bind(app) 