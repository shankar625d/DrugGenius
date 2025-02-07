from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_mysqldb import MySQL
import subprocess
import os
import pymysql
import bcrypt

app = Flask(__name__)
app.secret_key = '717730305d8ed3cdc3f37eedaf000abe29f377cdc7800607'  # For session or additional security

# Database connection
db = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    database="druggenius"
)
cursor = db.cursor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (username, email, hashed_password))
        db.commit()
        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"message": "Registration failed"}), 500
    

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    
    query = "SELECT password FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    result = cursor.fetchone()
    
    if result:
        stored_password = result[0]
        # Verify the password
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    else:
        return jsonify({"message": "Invalid credentials"}), 401






if __name__ == '__main__':
    app.run(debug=True)
