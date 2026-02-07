from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_profile_add_legacy_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="google_sub",
            field=models.CharField(blank=True, max_length=64, null=True, unique=True),
        ),
    ]
