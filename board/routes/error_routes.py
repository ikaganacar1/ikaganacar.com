from flask import (
    render_template,

)
from board import app

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

@app.route("/custom_error/<error>")
def custom_error(error):
    return render_template("errors/custom_error.html",error=error)