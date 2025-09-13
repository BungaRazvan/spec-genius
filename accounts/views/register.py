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
            token = create_jwt(user)

            return Response({"token": token}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
