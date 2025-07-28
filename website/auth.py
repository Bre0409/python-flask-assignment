from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

# In-memory user store (for demo only)
users = {}

@auth.route('/')
@auth.route('/home')
def home():
    session.pop('just_signed_up', None)
    return render_template('home.html')

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        first_name = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        # Input validation
        if not all([email, first_name, password1, password2]):
            flash("Please fill in all the fields.")
            return render_template('sign_up.html')

        if password1 != password2:
            flash("Passwords don't match.")
            return render_template('sign_up.html')

        if email in users:
            flash('Email already exists.')
            return render_template('sign_up.html')

        # Store user
        users[email] = {
            'first_name': first_name,
            'password': generate_password_hash(password1, method='pbkdf2:sha256')
        }

        session['just_signed_up'] = True
        flash('Signup successful! Please log in.')
        return redirect(url_for('auth.login'))

    return render_template('sign_up.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    success_message = None

    if session.get('just_signed_up'):
        success_message = "Signup successful! Please log in."
        session.pop('just_signed_up', None)

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = users.get(email)

        if not user or not check_password_hash(user['password'], password):
            error = "Incorrect email or password."
        else:
            session['user_email'] = email
            return redirect(url_for('auth.home'))

    return render_template('login.html', error=error, success_message=success_message)

@auth.route('/logout')
def logout():
    session.clear()
    return render_template('logout.html')
