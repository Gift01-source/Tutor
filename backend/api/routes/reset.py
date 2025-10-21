from flask import Blueprint, request, jsonify
from flask_mail import Mail, Message
import uuid
import datetime

reset_bp = Blueprint('reset', __name__, url_prefix='/api/reset')

# In-memory storage for demo purposes
# In production, store tokens in a database
reset_tokens = {}

# Configure Flask-Mail separately in your app
mail = Mail()


@reset_bp.route('/request', methods=['POST'])
def request_reset():
    """
    Request password reset: send an email with a reset token
    Expects JSON: { "email": "user@example.com" }
    """
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    # Generate a unique token
    token = str(uuid.uuid4())
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

    # Save token with email and expiry
    reset_tokens[token] = {'email': email, 'expires_at': expires_at}

    # Construct reset link (frontend URL)
    reset_link = f"https://pakachere.onrender.com/reset-password/{token}"

    # Send email
    try:
        msg = Message(
            subject="Password Reset Request",
            sender="no-reply@example.com",
            recipients=[email],
            body=f"Click the link to reset your password: {reset_link}"
        )
        mail.send(msg)
    except Exception as e:
        print("Email failed:", e)
        # For demo, we just print the link
        print(f"Reset link for {email}: {reset_link}")

    return jsonify({'message': 'Reset link sent', 'token': token})


@reset_bp.route('/verify/<token>', methods=['GET'])
def verify_token(token):
    """
    Verify the reset token is valid
    """
    token_data = reset_tokens.get(token)
    if not token_data:
        return jsonify({'valid': False, 'error': 'Invalid token'}), 400

    if datetime.datetime.utcnow() > token_data['expires_at']:
        return jsonify({'valid': False, 'error': 'Token expired'}), 400

    return jsonify({'valid': True, 'email': token_data['email']})


@reset_bp.route('/reset', methods=['POST'])
def reset_password():
    """
    Reset the password using token
    Expects JSON: { "token": "...", "new_password": "..." }
    """
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    token_data = reset_tokens.get(token)
    if not token_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 400

    if datetime.datetime.utcnow() > token_data['expires_at']:
        return jsonify({'success': False, 'error': 'Token expired'}), 400

    # Here you would update the user's password in your DB
    email = token_data['email']
    print(f"Password for {email} has been updated to: {new_password}")

    # Remove token after use
    reset_tokens.pop(token)

    return jsonify({'success': True, 'message': 'Password has been reset successfully'})
