import pandas as pd
import sys
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

def prepare_data(df):
    # Example preprocessing; adjust based on your analysis
    X = df.iloc[:, 1:-1]  # Features (side effects)
    y = df.iloc[:, -1]    # Target (assuming last column is the target, e.g., 'has_side_effect')
    
    return X, y

def train_rf_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Random Forest Model Accuracy: {accuracy:.3f}")
    
    with open('rf_model.pkl', 'wb') as f:
        pickle.dump(clf, f)
    with open('rf_accuracy.txt', 'w') as f:
        f.write(f"{accuracy:.3f}%")

def train_dt_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    clf = DecisionTreeClassifier(random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Decision Tree Model Accuracy: {accuracy:.3f}")
    
    with open('dt_model.pkl', 'wb') as f:
        pickle.dump(clf, f)
    with open('dt_accuracy.txt', 'w') as f:
        f.write(f"{accuracy:.3f}%")

if __name__ == "__main__":
    df = pd.read_csv('data/symptoms_diseases_medicines.csv')
    X, y = prepare_data(df)
    
    if len(sys.argv) > 1 and sys.argv[1] == 'rf':
        train_rf_model(X, y)
    elif len(sys.argv) > 1 and sys.argv[1] == 'dt':
        train_dt_model(X, y)
    else:
        print("Please specify the model type (rf/dt) as a command-line argument.")
