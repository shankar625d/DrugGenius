from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_mysqldb import MySQL
import subprocess
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import os


app = Flask(__name__)
app.secret_key = '717730305d8ed3cdc3f37eedaf000abe29f377cdc7800607'  # For session or additional security

# Database connection
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'druggenius'
}

# Route for homepage
@app.route('/')
def index():
    return render_template('index.html')  # Replace with your HTML filename

# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.form
    username = data['username']
    email = data['email']
    password = data['password']
    confirm_password = data['confirmPassword']

    if password != confirm_password:
        return jsonify({'message': 'Passwords do not match!'}), 400

    hashed_password = generate_password_hash(password, method='sha256')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", 
                       (username, email, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Registration successful!'}), 200
    except mysql.connector.Error as err:
        return jsonify({'message': f'Error: {err}'}), 500

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.form
    username = data['username']
    password = data['password']

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user['password'], password):
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'message': 'Invalid username or password!'}), 400
    except mysql.connector.Error as err:
        return jsonify({'message': f'Error: {err}'}), 500




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
