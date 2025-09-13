import datetime

from rest_framework import serializers
from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        user = User(
            email=validated_data["email"],
            name=validated_data["name"],
            date_joined=datetime.datetime.now(datetime.timezone.utc).date(),
        )
        user.set_password(validated_data["password"])
        user.save()

        return user
