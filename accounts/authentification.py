from typing import Tuple, Union

from accounts.models import User

from django.http import HttpRequest
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.utils import verify_jwt


class UserJWTAuthentification(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request: HttpRequest) -> Union[None, Tuple[User, None]]:
        auth_header = request.headers.get("Autorization")

        if not auth_header:
            return None

        if not auth_header.startswith(self.keyword):
            raise AuthenticationFailed("Invalid token")

        token = auth_header.replace(self.keyword, "").strip()
        payload = verify_jwt(token)

        if not payload:
            raise AuthenticationFailed("Invalid token")

        try:
            user = User.objects.get(id=payload["user_id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        return user, None
