from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_profile_google_sub"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="profile",
            name="google_sub",
        ),
    ]
