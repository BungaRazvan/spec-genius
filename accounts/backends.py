from .models import CustomUser
from rest_framework_simplejwt.authentication import JWTAuthentication


class AppUserAuthBackend:
    def authenticate(self, request, email=None, password=None, **kwargs):

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return None

        if user.check_password(password):
            return user

        return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None


class MyCustomJWTAuthentication(JWTAuthentication):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_model = CustomUser
