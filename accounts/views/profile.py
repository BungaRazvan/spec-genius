from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest

from accounts.serializers import UserSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: HttpRequest) -> Response:
        return Response(UserSerializer(request.user).data)
