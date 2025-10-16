import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

USERS_FILE = os.path.join(DATA_DIR, "users.json")

def load_users():
    if not os.path.exists(USERS_FILE) or os.stat(USERS_FILE).st_size == 0:
        return []  # Return empty list if file doesn't exist or is empty
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

#goals
def _goal_file(student_id):
    return os.path.join(DATA_DIR, f"goals_{student_id}.json")

def load_goals(student_id):
    path = _goal_file(student_id)
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_goals(student_id, goals):
    path = _goal_file(student_id)
    with open(path, "w") as f:
        json.dump(goals, f, indent=2)