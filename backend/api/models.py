from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    elo = models.IntegerField(default=1200)
    country = models.CharField(max_length=10, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    is_premium = models.BooleanField(default=False)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    draws = models.PositiveIntegerField(default=0)
    streak = models.PositiveIntegerField(default=0)
    coins = models.PositiveIntegerField(default=0)
    avatar_emoji = models.CharField(max_length=10, blank=True, default="")
    profile_image = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Profile({self.user.username})"


class VocabEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vocab_entries")
    en = models.CharField(max_length=120)
    uz = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "en")
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.en} -> {self.uz}"


@receiver(post_save, sender=User)
def create_profile(sender, instance: User, created: bool, **kwargs):
    if created:
        Profile.objects.create(user=instance)
