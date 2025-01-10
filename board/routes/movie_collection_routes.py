from board import app, db, bcrypt, login_manager, bcrypt
from board.models import User, IMC_user, Followed, Watched, Watchlist
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
from board.routes.main_routes import track_visit
import tmdbsimple as tmdb
from flask_login import login_user, current_user, logout_user
from functools import wraps


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


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


key = open("board/secret_key.txt", "r").readlines()[1]
tmdb.API_KEY = key
tmdb.REQUESTS_TIMEOUT = 5


@app.route("/useless_projects/movies", methods=["GET", "POST"])
def movies():

    logged_in = True if current_user.is_authenticated else False

    if current_user.is_authenticated:
        username = current_user.username
        email = current_user.email
    else:
        username = "IKA's Movie Collection"
        email = "Share your movie journey with friends."

    if request.method == "POST":
        input_ = request.form.get("input_")

        return redirect(url_for("search", search_word=input_))

    watched_list = Watched.query.limit(5).all()
    watched_list_followed = []
    
    try:
        if logged_in:
            for i in current_user.following:
                id = i.followed_user_id 
                watched_list_followed.append(Watched.query.filter_by(user_id=id).all())
    except Exception as e:
        pass
    
    temp_list = []
    for j in watched_list_followed:
        for data in j :
            user = IMC_user.query.get(data.user_id)
            rated = data.rated
            data = tmdb.Movies(data.movie_id).info()
            temp_list.append((data, user, rated))

    track_visit("useless_projects/movies")
    return render_template(
        "useless_projects/movie_collection/movies.html",
        username=username,
        email=email,
        logged_in=logged_in,
        watched_list=temp_list,
    )


@app.route("/movie_page/<movie_id>", methods=["GET", "POST"])
def movie_page(movie_id):
    movie = tmdb.Movies(movie_id).info()

    logged_in = True if current_user.is_authenticated else False
    in_watched = True if Watched.query.filter_by(movie_id= movie_id, user_id= current_user.id ).first() else False
    in_watchlist = True if Watchlist.query.filter_by(movie_id= movie_id, user_id= current_user.id ).first() else False
    
    if in_watched:
        rate = Watched.query.filter_by(movie_id= movie_id, user_id= current_user.id ).first().rated
    else:
        rate = 0
        
        
    return render_template(
        "useless_projects/movie_collection/movie_page.html",
        movie=movie,
        current_user=current_user,
        logged_in=logged_in,
        in_watched=in_watched,
        in_watchlist=in_watchlist,
        rate=rate
    )


@app.route("/watched/<user_id>", methods=["GET", "POST"])
@login_required(role="IMC_user")
def watched(user_id):
    watched_list = IMC_user.query.get(user_id).watched
    templist = []
    for i in watched_list:
        templist.append((tmdb.Movies(i.movie_id).info(), i.rated, i.id))

    return render_template(
        "useless_projects/movie_collection/movies_wathced.html", response=templist
    )


@app.route("/watchlist/<user_id>")
@login_required(role="IMC_user")
def watchlist(user_id):
    watch_list = IMC_user.query.get(user_id).watchlist
    templist = []
    for i in watch_list:
        templist.append((tmdb.Movies(i.movie_id).info(), i.id))

    return render_template(
        "useless_projects/movie_collection/movies_watchlist.html", response=templist
    )


@app.route("/add_to_watchlist/<user_id>/<movie_id>", methods=["POST"])
@login_required(role="IMC_user")
def add_to_watchlist(user_id, movie_id):

    if request.method == "POST":
        new_element = Watchlist(user_id=user_id, movie_id=movie_id)
        db.session.add(new_element)
        db.session.commit()

    return redirect(url_for("movie_page", movie_id=movie_id))


@app.route("/add_to_watched/<user_id>/<movie_id>/<rated>", methods=["POST"])
@login_required(role="IMC_user")
def add_to_watched(user_id, movie_id, rated):

    if request.method == "POST":
        new_element = Watched(user_id=user_id, movie_id=movie_id, rated=rated)
        db.session.add(new_element)
        db.session.commit()

    return redirect(url_for("movie_page", movie_id=movie_id))


@app.route("/remove_watched/<watched_id>", methods=["GET", "POST"])
def remove_watched(watched_id):
    the = Watched.query.get(watched_id)
    db.session.delete(the)
    db.session.commit()
    return redirect(url_for("watched", user_id=current_user.id))


@app.route("/remove_watchlist/<watchlist_id>", methods=["GET", "POST"])
def remove_watchlist(watchlist_id):
    the = Watchlist.query.get(watchlist_id)
    db.session.delete(the)
    db.session.commit()
    return redirect(url_for("watchlist", user_id=current_user.id))


@app.route("/follow_page/<user_id>")
@login_required(role="IMC_user")
def follow_page(user_id):
    user_list = IMC_user.query.all()
    following_list = IMC_user.query.get(user_id).following
    tmp_list = []
    
    for i in following_list:
        tmp_list.append(IMC_user.query.get(i.followed_user_id))
    
    return render_template(
        "useless_projects/movie_collection/movies_friends.html",
        user_list=user_list,
        following_list=tmp_list,
    )


@app.route('/follow/<user_id>', methods=["GET", "POST"])
@login_required(role="IMC_user")
def follow(user_id):
    user_to_follow = IMC_user.query.get(user_id)
    if request.method == "POST":
        if user_to_follow and user_to_follow != current_user:
            temp = Followed(followed_user_id=user_id,user_id=current_user.id)
            db.session.add(temp)
            db.session.commit()
        
    return redirect(url_for('follow_page',user_id=current_user.id))

@app.route('/unfollow/<followed_user_id>', methods=["GET", "POST"])
@login_required(role="IMC_user")
def unfollow(followed_user_id):
    user_to_unfollow = IMC_user.query.get(followed_user_id)
    if request.method == "POST":

        if user_to_unfollow :
            temp = Followed.query.filter_by(followed_user_id=followed_user_id, user_id=current_user.id).first()
            db.session.delete(temp)
            db.session.commit()
            
    return redirect(url_for('follow_page',user_id=current_user.id))


@app.route("/invite_friend/<user_id>")
@login_required(role="IMC_user")
def invite_friend(user_id):
    user = IMC_user.query.get(user_id)
    ic_1 = user.invitation_code_1
    ic_2 = user.invitation_code_2
    return render_template(
        "useless_projects/movie_collection/movies_invitation.html",
        invitation_codes=(ic_1,ic_2),
    )


@app.route("/search/<search_word>", methods=["GET", "POST"])
def search(search_word):
    search1 = tmdb.Search()
    response = search1.movie(query=search_word)["results"]

    return render_template(
        "useless_projects/movie_collection/movies_search.html",
        search_word=search_word,
        response=response,
    )


@app.route("/useless_projects/movies/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = IMC_user.query.filter_by(email=email).first()
        try:
            if user.role == "IMC_user":
                if user and bcrypt.check_password_hash(user.password, password):
                    login_user(user)
                    return redirect(url_for("movies"))
                else:
                    return redirect(url_for("error_invalid_user"))

        except AttributeError:
            return redirect(url_for("error_invalid_user"))

    return render_template("useless_projects/movie_collection/movies_login.html")


@app.route("/useless_projects/movies/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        invitation_code = request.form.get("invitation_code")

        try:
            condition1 = False if IMC_user.query.filter_by(previous_code=invitation_code).first() else True
            
            all_users = IMC_user.query.all()
            condition2 = next((user for user in all_users if user.invitation_code_1 == invitation_code or user.invitation_code_2 == invitation_code), None)

        
            if (not condition1) and condition2:
                new_user = IMC_user(
                    username=username,
                    email=email,
                    previous_code=invitation_code,
                    role="IMC_user",
                    password=bcrypt.generate_password_hash(password).decode("utf-8"),
                )
                db.session.add(new_user)
                db.session.commit()
                return redirect(url_for("login"))

            else:
                return redirect(url_for("error_invalid_user"))

        except Exception as e:
            print(e)
            return redirect(url_for("error_invalid_user"))

    return render_template("useless_projects/movie_collection/movies_register.html")
