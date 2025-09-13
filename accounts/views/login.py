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
            return Response({"token": create_jwt(user)})

        return Response(
            {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )
