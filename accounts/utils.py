from typing import Optional, Dict

import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from accounts.models import User

ALGO = "HS256"
ACCESS_TOKEN_LIFETIME = timedelta(hours=1)


def create_jwt(user: User) -> str:
    payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + ACCESS_TOKEN_LIFETIME,
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGO)


def verify_jwt(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGO])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
