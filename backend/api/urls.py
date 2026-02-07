from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AIHintView,
    AIWordView,
    GameResultView,
    LeaderboardView,
    LoginView,
    MeView,
    RegisterView,
    ValidateWordView,
    VocabDeleteView,
    VocabListCreateView,
)

urlpatterns = [
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/refresh", TokenRefreshView.as_view(), name="auth-refresh"),
    path("me", MeView.as_view(), name="me"),
    path("leaderboard", LeaderboardView.as_view(), name="leaderboard"),
    path("vocab", VocabListCreateView.as_view(), name="vocab-list"),
    path("vocab/<int:pk>", VocabDeleteView.as_view(), name="vocab-delete"),
    path("game/result", GameResultView.as_view(), name="game-result"),
    path("game/ai-word", AIWordView.as_view(), name="game-ai-word"),
    path("game/hint", AIHintView.as_view(), name="game-hint"),
    path("game/validate-word", ValidateWordView.as_view(), name="game-validate-word"),
]
