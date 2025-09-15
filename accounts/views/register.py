from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.serializers import RegisterSerializer
from accounts.utils import create_jwt


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            access, refresh = create_jwt(user)

            res = Response({"user": {"email": user.email}})
            res.set_cookie(
                "access_token", access, httponly=True, samesite="Strict", secure=False
            )
            res.set_cookie(
                "refresh_token", refresh, httponly=True, samesite="Strict", secure=False
            )

            return res

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
