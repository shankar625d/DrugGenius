from flask import Flask, render_template, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

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
