from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import User

from .models import Profile, VocabEntry

admin.site.site_header = "Word Battle Admin"
admin.site.site_title = "Word Battle Admin"
admin.site.index_title = "Control Center"

try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass


class EloRangeFilter(admin.SimpleListFilter):
    title = "ELO range"
    parameter_name = "elo_range"

    def lookups(self, request, model_admin):
        return (
            ("lt1000", "< 1000"),
            ("1000-1400", "1000 - 1400"),
            ("1400-1800", "1400 - 1800"),
            ("gt1800", "1800+"),
        )

    def queryset(self, request, queryset):
        value = self.value()
        if value == "lt1000":
            return queryset.filter(profile__elo__lt=1000)
        if value == "1000-1400":
            return queryset.filter(profile__elo__gte=1000, profile__elo__lt=1400)
        if value == "1400-1800":
            return queryset.filter(profile__elo__gte=1400, profile__elo__lt=1800)
        if value == "gt1800":
            return queryset.filter(profile__elo__gte=1800)
        return queryset


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    fk_name = "user"
    fields = (
        "elo",
        "wins",
        "losses",
        "draws",
        "streak",
        "coins",
        "avatar_emoji",
        "profile_image",
        "created_at",
        "updated_at",
    )
    readonly_fields = ("created_at", "updated_at")
    extra = 0


class VocabInline(admin.TabularInline):
    model = VocabEntry
    fields = ("en", "uz", "created_at")
    readonly_fields = ("created_at",)
    extra = 0
    show_change_link = True


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    inlines = (ProfileInline, VocabInline)
    list_display = (
        "username",
        "email",
        "is_staff",
        "is_active",
        "date_joined",
        "last_login",
        "elo",
        "wins",
        "losses",
        "draws",
        "coins",
        "win_rate",
    )
    list_filter = ("is_staff", "is_active", "date_joined", "last_login", EloRangeFilter)
    search_fields = ("username", "email")
    ordering = ("-date_joined",)
    list_select_related = ("profile",)

    @admin.display(ordering="profile__elo", description="ELO")
    def elo(self, obj):
        return getattr(obj.profile, "elo", "-")

    @admin.display(ordering="profile__wins", description="Wins")
    def wins(self, obj):
        return getattr(obj.profile, "wins", "-")

    @admin.display(ordering="profile__losses", description="Losses")
    def losses(self, obj):
        return getattr(obj.profile, "losses", "-")

    @admin.display(ordering="profile__draws", description="Draws")
    def draws(self, obj):
        return getattr(obj.profile, "draws", "-")

    @admin.display(ordering="profile__coins", description="Coins")
    def coins(self, obj):
        return getattr(obj.profile, "coins", "-")

    @admin.display(description="Win Rate")
    def win_rate(self, obj):
        wins = getattr(obj.profile, "wins", 0)
        losses = getattr(obj.profile, "losses", 0)
        draws = getattr(obj.profile, "draws", 0)
        total = wins + losses + draws
        if total == 0:
            return "0%"
        return f"{int((wins / total) * 100)}%"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "elo", "wins", "losses", "draws", "streak", "coins", "created_at", "updated_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "user__email")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-elo",)
    list_select_related = ("user",)


@admin.register(VocabEntry)
class VocabEntryAdmin(admin.ModelAdmin):
    list_display = ("user", "en", "uz", "created_at")
    list_filter = ("created_at",)
    search_fields = ("en", "uz", "user__username", "user__email")
    date_hierarchy = "created_at"
