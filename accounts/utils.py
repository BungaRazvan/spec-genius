from typing import Optional, Dict

import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from accounts.models import User

ALGO = "HS256"

ACCESS_TOKEN_LIFETIME = timedelta(hours=1)
REFRESH_TOKEN_LIFETIME = timedelta(hours=2)


def create_jwt(user: User) -> str:

    access_payload = {
        "user_id": user.id,
        "exp": datetime.now(timezone.utc) + ACCESS_TOKEN_LIFETIME,
        "type": "access",
    }
    refresh_payload = {
        "user_id": user.id,
        "exp": datetime.now(timezone.utc) + REFRESH_TOKEN_LIFETIME,
        "type": "refresh",
    }
    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm=ALGO)
    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm=ALGO)

    return access_token, refresh_token


def verify_jwt(token: str, expected_type: str = "access") -> Optional[Dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGO])

        if payload["type"] != expected_type:
            return None

        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
