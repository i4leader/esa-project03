# Sample Python code with various issues for testing

# Security Issue: Hardcoded credentials
password = "admin123"
api_token = "secret_token_12345"

# Security Issue: Using eval
def execute_code(user_input):
    eval(user_input)  # Dangerous!

# Performance Issue: Inefficient list concatenation
def process_items(items):
    result = []
    for item in items:
        result = result + [item]  # Creates new list each time
    return result

# Style Issue: Inconsistent naming
def getUserName():  # Should be snake_case in Python
    return "John Doe"

# Security Issue: Missing error handling
def read_file(filename):
    with open(filename, 'r') as f:
        return f.read()

# Performance Issue: Multiple database queries in loop
def get_user_details(user_ids):
    users = []
    for user_id in user_ids:
        # Simulated database query
        user = database.query(f"SELECT * FROM users WHERE id = {user_id}")
        users.append(user)
    return users

# Good practice example
import os

def get_config():
    return {
        'api_url': os.getenv('API_URL'),
        'timeout': 5000
    }

if __name__ == '__main__':
    print("Running sample code")
