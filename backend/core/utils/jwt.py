import jwt
from django.conf import settings
from datetime import datetime, timedelta

def generate_jwt(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS)
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token

def decode_jwt(token):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload["user_id"]
    except Exception:
        return None
