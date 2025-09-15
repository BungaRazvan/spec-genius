from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.utils import create_jwt
from accounts.models import User


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        pwd = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        if user.check_password(pwd) and user.is_active:
            access, refresh = create_jwt(user)
            response = Response()

            response.set_cookie(
                "access_token", access, httponly=True, samesite="Strict", secure=False
            )
            response.set_cookie(
                "refresh_token", refresh, httponly=True, samesite="Strict", secure=False
            )

            return response

        return Response(
            {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )
