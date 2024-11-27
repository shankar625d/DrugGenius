from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_mysqldb import MySQL
import subprocess
import os

app = Flask('__name__')
app.secret_key = 'your-secret-key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'login'

mysql = MySQL(app)

@app.route('/')
def home():
    if'username' in session:
        return render_template('index.html', username=session['username'])
    else:
        return render_template('index.html')



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        pwd = request.form['password']
        cur = mysql.connection.cursor()
        cur.execute(f"select username, password from users where username = '{username}")
        user = cur.fetchone()
        cur.close()
        if user and pwd == user[1]:
            session['username'] = user[0]
            return redirect(url_for('home'))
        else:
            return render_template('login.html', error='Invalid username or password')

    return render_template('login.html')

@app.route('/train_rf_model', methods=['POST'])
def train_rf_model():
    try:
        subprocess.run(['python', 'train_model.py', 'rf'])
        return 'Random Forest Model Training Initiated Successfully!'
    except Exception as e:
        return str(e), 500

@app.route('/train_dt_model', methods=['POST'])
def train_dt_model():
    try:
        subprocess.run(['python', 'train_model.py', 'dt'])
        return 'Decision Tree Model Training Initiated Successfully!'
    except Exception as e:
        return str(e), 500

@app.route('/check_training_status', methods=['GET'])
def check_training_status():
    classifier = request.args.get('classifier')
    if classifier == 'rf':
        filename = 'rf_accuracy.txt'
    elif classifier == 'dt':
        filename = 'dt_accuracy.txt'
    else:
        return jsonify({'status': 'invalid_classifier'})
    
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            accuracy = f.read()
        os.remove(filename)
        return jsonify({'status': 'complete', 'accuracy': accuracy})
    else:
        return jsonify({'status': 'in_progress'})




if __name__ == '__main__':
    app.run(debug=True)
