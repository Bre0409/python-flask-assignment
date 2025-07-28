from website import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

    from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('daily_organiser.html')

if __name__ == '__main__':
    app.run(debug=True)

    

    