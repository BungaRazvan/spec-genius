from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.utils import verify_jwt, create_jwt
from accounts.models import User


class Refresh(APIView):
    def post(self, request):
        refresh = request.COOKIES.get("refresh_token")

        if not refresh:
            return Response(
                {"detail": "Missing refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        payload = verify_jwt(refresh, "refresh")

        if not payload:
            return Response(
                {"detail": "Invalid or expired refresh token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            user = User.objects.get(id=payload["user_id"])
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_401_UNAUTHORIZED
            )

        access, refresh_new = create_jwt(user.id)

        res = Response({"user": {"email": user.email}})
        res.set_cookie(
            "access_token", access, httponly=True, samesite="Strict", secure=False
        )
        res.set_cookie(
            "refresh_token", refresh_new, httponly=True, samesite="Strict", secure=False
        )
        return res
