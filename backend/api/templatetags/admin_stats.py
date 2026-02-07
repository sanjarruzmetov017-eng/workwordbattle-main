from django import template
from django.contrib.auth.models import User
from django.db.models import Avg

from api.models import Profile, VocabEntry

register = template.Library()


@register.simple_tag
def admin_stats():
    users_total = User.objects.count()
    users_active = User.objects.filter(is_active=True).count()
    users_staff = User.objects.filter(is_staff=True).count()
    profiles_total = Profile.objects.count()
    vocab_total = VocabEntry.objects.count()
    avg_elo = Profile.objects.aggregate(value=Avg("elo"))["value"] or 0
    top_profiles = (
        Profile.objects.select_related("user")
        .order_by("-elo")
        .values("user__username", "elo", "wins", "losses")[:5]
    )

    return {
        "users_total": users_total,
        "users_active": users_active,
        "users_staff": users_staff,
        "profiles_total": profiles_total,
        "vocab_total": vocab_total,
        "avg_elo": int(avg_elo),
        "top_profiles": list(top_profiles),
    }
