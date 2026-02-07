from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from .models import Profile, VocabEntry


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = Profile
        fields = (
            "username",
            "email",
            "elo",
            "country",
            "bio",
            "is_premium",
            "wins",
            "losses",
            "draws",
            "streak",
            "coins",
            "avatar_emoji",
            "profile_image",
        )


class ProfileUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", required=False)
    email = serializers.EmailField(source="user.email", required=False)
    elo = serializers.IntegerField(min_value=0, required=False)
    wins = serializers.IntegerField(min_value=0, required=False)
    losses = serializers.IntegerField(min_value=0, required=False)
    draws = serializers.IntegerField(min_value=0, required=False)
    streak = serializers.IntegerField(min_value=0, required=False)
    coins = serializers.IntegerField(min_value=0, required=False)

    class Meta:
        model = Profile
        fields = (
            "username",
            "email",
            "elo",
            "country",
            "bio",
            "is_premium",
            "wins",
            "losses",
            "draws",
            "streak",
            "coins",
            "avatar_emoji",
            "profile_image",
        )

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username__iexact=value).exclude(pk=self.instance.user_id).exists():
            raise serializers.ValidationError("Username already in use.")
        return value

    def validate_email(self, value: str) -> str:
        if value and User.objects.filter(email__iexact=value).exclude(pk=self.instance.user_id).exists():
            raise serializers.ValidationError("Email already in use.")
        return value

    def update(self, instance: Profile, validated_data):
        user_data = validated_data.pop("user", {})
        if "username" in user_data:
            instance.user.username = user_data["username"]
        if "email" in user_data:
            instance.user.email = user_data["email"]
        instance.user.save()
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login = attrs.get("login", "").strip()
        password = attrs.get("password", "")
        user = User.objects.filter(Q(username__iexact=login) | Q(email__iexact=login)).first()
        if not user or not user.check_password(password):
            raise AuthenticationFailed("Invalid credentials.")
        if not user.is_active:
            raise AuthenticationFailed("User account is disabled.")
        attrs["user"] = user
        return attrs


class VocabEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabEntry
        fields = ("id", "en", "uz", "created_at")


class GameResultSerializer(serializers.Serializer):
    result = serializers.ChoiceField(choices=["win", "loss", "draw"])
    opponent_elo = serializers.IntegerField(min_value=0)


class AIWordSerializer(serializers.Serializer):
    last_word = serializers.CharField()
    used_words = serializers.ListField(child=serializers.CharField(), required=False)


class AIHintSerializer(serializers.Serializer):
    start_char = serializers.CharField(max_length=1)
    used_words = serializers.ListField(child=serializers.CharField(), required=False)


class ValidateWordSerializer(serializers.Serializer):
    word = serializers.CharField()
    start_char = serializers.CharField(max_length=1, required=False, allow_blank=True)
    used_words = serializers.ListField(child=serializers.CharField(), required=False)
