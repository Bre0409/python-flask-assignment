from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

# Blueprint named 'auth' for authentication routes
auth = Blueprint('auth', __name__)

# Stores user data temporarily
users = {}

# Home page route
@auth.route('/')
@auth.route('/home')
def home():
    # Remove 'just_signed_up' from session if it exists
    session.pop('just_signed_up', None)
    # Render the home page template
    return render_template('home.html')

# Sign-up route using GET and POST
@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        # Get form input values
        email = request.form.get('email')
        first_name = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        # Input validation
        # Check all fields are filled
        if not all([email, first_name, password1, password2]):
            flash("Please fill in all the fields.")
            return render_template('sign_up.html')

        # Check passwords match
        if password1 != password2:
            flash("Passwords don't match.")
            return render_template('sign_up.html')

        # Check if email already registered
        if email in users:
            flash('Email already exists.')
            return render_template('sign_up.html')

        # Create new user
        users[email] = {
            'first_name': first_name,
            # Store hashed password for security
            'password': generate_password_hash(password1, method='pbkdf2:sha256')
        }

        # Mark that user just signed up
        session['just_signed_up'] = True
        # Flash success message
        flash('Signup successful! Please log in.')
        # Redirect to login page
        return redirect(url_for('auth.login'))

    # For GET request, render the signup form
    return render_template('sign_up.html')

# Login route using GET and POST
@auth.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    success_message = None

    # Show signup success message if redirected after signup
    if session.get('just_signed_up'):
        success_message = "Signup successful! Please log in."
        session.pop('just_signed_up', None)

    if request.method == 'POST':
        # Get form input values
        email = request.form.get('email')
        password = request.form.get('password')
        # Lookup user by email
        user = users.get(email)

        # Validate user and password
        if not user or not check_password_hash(user['password'], password):
            error = "Incorrect email or password."
        else:
            # Save user email in session when logging in
            session['user_email'] = email
            # Redirect to home page after successful login
            return redirect(url_for('auth.home'))

    # Render login form with any messages
    return render_template('login.html', error=error, success_message=success_message)

# Logout route
@auth.route('/logout')
def logout():
    # Clear all session data when user logs out)
    session.clear()
    # Render logout confirmation page
    return render_template('logout.html')
