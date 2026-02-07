from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("elo", models.IntegerField(default=1200)),
                ("wins", models.PositiveIntegerField(default=0)),
                ("losses", models.PositiveIntegerField(default=0)),
                ("draws", models.PositiveIntegerField(default=0)),
                ("streak", models.PositiveIntegerField(default=0)),
                ("coins", models.PositiveIntegerField(default=0)),
                ("avatar_emoji", models.CharField(blank=True, default="", max_length=10)),
                ("profile_image", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="profile", to="auth.user"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="VocabEntry",
            fields=[
                (
                    "id",
                    models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("en", models.CharField(max_length=120)),
                ("uz", models.CharField(max_length=120)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="vocab_entries", to="auth.user"),
                ),
            ],
            options={
                "ordering": ["-created_at"],
                "unique_together": {("user", "en")},
            },
        ),
    ]
