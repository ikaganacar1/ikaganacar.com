from board import app
from flask import (
    render_template
)
from board.routes.main_routes import track_visit

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


@app.route("/useless_projects/movies")
def movies():
    track_visit("useless_projects/movies")
    return render_template("useless_projects/movies.html")


#? Lot more Useless:
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
