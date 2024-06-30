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
