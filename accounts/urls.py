from django.urls import path
from accounts.views import RegisterView, LoginView, ProfileView, Refresh

urlpatterns = [
    path("register/", RegisterView.as_view(), name="user-register"),
    path("refresh/", Refresh.as_view(), name="user-refresh"),
    path("login/", LoginView.as_view(), name="user-login"),
    path("profile/", ProfileView.as_view(), name="user-profile"),
]
