from typing import Tuple, Union

from accounts.models import User

from django.http import HttpRequest
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.utils import verify_jwt


class UserJWTAuthentification(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request: HttpRequest) -> Union[None, Tuple[User, None]]:
        token = request.COOKIES.get("access_token")

        if not token:
            return None

        payload = verify_jwt(token)

        if not payload:
            raise AuthenticationFailed("Invalid token")

        try:
            user = User.objects.get(id=payload["user_id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        return user, None
