from typing import Any


from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile, VocabEntry
from .serializers import (
    AIHintSerializer,
    AIWordSerializer,
    GameResultSerializer,
    LoginSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    ValidateWordSerializer,
    VocabEntrySerializer,
)
from .services import calculate_elo_change, generate_ai_word, generate_hint
from .wordlist import get_word_level, is_valid_chain_word


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = RefreshToken.for_user(user)
        profile_data = ProfileSerializer(user.profile).data
        return Response(
            {
                "access": str(tokens.access_token),
                "refresh": str(tokens),
                "profile": profile_data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: User = serializer.validated_data["user"]
        tokens = RefreshToken.for_user(user)
        profile_data = ProfileSerializer(user.profile).data
        return Response(
            {
                "access": str(tokens.access_token),
                "refresh": str(tokens),
                "profile": profile_data,
            }
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(ProfileSerializer(request.user.profile).data)

    def patch(self, request, *args, **kwargs):
        serializer = ProfileUpdateSerializer(request.user.profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ProfileSerializer(request.user.profile).data)


class LeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            limit = int(request.query_params.get("limit", 50))
        except ValueError:
            limit = 50
        limit = max(1, min(limit, 200))
        profiles = Profile.objects.select_related("user").order_by("-elo")[:limit]
        return Response(ProfileSerializer(profiles, many=True).data)


class VocabListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VocabEntrySerializer

    def get_queryset(self):
        return VocabEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class VocabDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VocabEntrySerializer

    def get_queryset(self):
        return VocabEntry.objects.filter(user=self.request.user)


class GameResultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = GameResultSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.validated_data["result"]
        opponent_elo = serializer.validated_data["opponent_elo"]

        profile = request.user.profile
        if result == "win":
            score = 1.0
        elif result == "draw":
            score = 0.5
        else:
            score = 0.0

        elo_change = calculate_elo_change(profile.elo, opponent_elo, score)
        profile.elo = max(0, profile.elo + elo_change)

        if result == "win":
            profile.wins += 1
            profile.streak += 1
            profile.coins += 50
        elif result == "loss":
            profile.losses += 1
            profile.streak = 0
        else:
            profile.draws += 1

        profile.save()
        return Response({"elo_change": elo_change, "profile": ProfileSerializer(profile).data})


class AIWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = AIWordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        last_word = serializer.validated_data["last_word"]
        used_words = serializer.validated_data.get("used_words", [])
        word, level = generate_ai_word(last_word, used_words)
        if not word:
            return Response({"word": None, "level": level, "reason": "no_word"})
        return Response({"word": word, "level": level})


class AIHintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = AIHintSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        start_char = serializer.validated_data["start_char"]
        used_words = serializer.validated_data.get("used_words", [])
        hint = generate_hint(start_char, used_words)
        return Response({"hint": hint})


class ValidateWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ValidateWordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        word = serializer.validated_data["word"]
        start_char = serializer.validated_data.get("start_char")
        used_words = serializer.validated_data.get("used_words", [])

        valid, reason, normalized = is_valid_chain_word(
            word,
            start_char=start_char,
            used_words=used_words,
        )
        level = get_word_level(normalized) if valid else None
        return Response({"valid": valid, "reason": reason, "word": normalized, "level": level})
