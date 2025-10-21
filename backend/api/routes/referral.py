from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

referral_bp = Blueprint('referral', __name__, url_prefix='/api/referrals')

# ----- Models -----
class Referral(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(64), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    rewarded = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'rewarded': self.rewarded,
            'date': self.date.isoformat()
        }

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(64), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    method = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'method': self.method,
            'date': self.date.isoformat()
        }

# ----- Referral Routes -----

# GET all referrals for a user
@referral_bp.route('/<string:user_id>', methods=['GET'])
def get_referrals(user_id):
    referrals = Referral.query.filter_by(user_id=user_id).order_by(Referral.date.desc()).all()
    return jsonify({'referrals': [r.to_dict() for r in referrals]}), 200

# POST a new referral
@referral_bp.route('', methods=['POST'])
def add_referral():
    data = request.get_json()
    if not data or not all(k in data for k in ('userId', 'name', 'email')):
        return jsonify({'error': 'Missing fields'}), 400

    new_referral = Referral(
        user_id=data['userId'],
        name=data['name'],
        email=data['email']
    )
    db.session.add(new_referral)
    db.session.commit()
    return jsonify({'referral': new_referral.to_dict()}), 201

# PUT to mark referral as rewarded
@referral_bp.route('/<int:ref_id>/reward', methods=['PUT'])
def mark_rewarded(ref_id):
    referral = Referral.query.get_or_404(ref_id)
    referral.rewarded = True
    db.session.commit()
    return jsonify({'referral': referral.to_dict()}), 200

# ----- Payment Routes -----

# POST a new payment
@referral_bp.route('/payments', methods=['POST'])
def add_payment():
    data = request.get_json()
    required_fields = ['userId', 'amount', 'method']
    if not data or not all(k in data for k in required_fields):
        return jsonify({'error': 'Missing payment fields'}), 400

    payment = Payment(
        user_id=data['userId'],
        amount=float(data['amount']),
        method=data['method']
    )
    db.session.add(payment)

    # Auto-mark referral as rewarded if user exists
    referral = Referral.query.filter_by(user_id=data['userId'], rewarded=False).first()
    if referral:
        referral.rewarded = True

    db.session.commit()
    return jsonify({
        'payment': payment.to_dict(),
        'rewarded_referral': referral.to_dict() if referral else None
    }), 201
