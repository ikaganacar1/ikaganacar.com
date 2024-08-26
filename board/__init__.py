#python -m flask --app board run --port 8000 --debug
#Set-ExecutionPolicy Unrestricted -Scope Process             
#./venv/Scripts/activate  
#set FLASK_APP=app.py 
#python -m flask run
from flask import Flask
from flask import render_template

app = Flask(__name__)
    
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

@app.route("/howmuchmoneyleft")
def howmuchmoneyleft():
    return render_template("pages/howmuchmoneyleft.html")

