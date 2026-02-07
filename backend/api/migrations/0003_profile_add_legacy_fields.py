from django.db import migrations, models

SQL = """
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS country varchar(10) NOT NULL DEFAULT '';
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

ALTER TABLE api_profile ALTER COLUMN country SET DEFAULT '';
ALTER TABLE api_profile ALTER COLUMN bio SET DEFAULT '';
ALTER TABLE api_profile ALTER COLUMN is_premium SET DEFAULT false;
"""


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_profile_schema_fix"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[migrations.RunSQL(SQL, reverse_sql=migrations.RunSQL.noop)],
            state_operations=[
                migrations.AddField(
                    model_name="profile",
                    name="country",
                    field=models.CharField(blank=True, default="", max_length=10),
                ),
                migrations.AddField(
                    model_name="profile",
                    name="bio",
                    field=models.TextField(blank=True, default=""),
                ),
                migrations.AddField(
                    model_name="profile",
                    name="is_premium",
                    field=models.BooleanField(default=False),
                ),
            ],
        ),
    ]
