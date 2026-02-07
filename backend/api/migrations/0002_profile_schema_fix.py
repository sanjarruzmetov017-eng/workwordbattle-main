from django.db import migrations


SQL = """
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS wins integer NOT NULL DEFAULT 0;
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS losses integer NOT NULL DEFAULT 0;
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS draws integer NOT NULL DEFAULT 0;
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS streak integer NOT NULL DEFAULT 0;
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS coins integer NOT NULL DEFAULT 0;
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS avatar_emoji varchar(10) NOT NULL DEFAULT '';
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS profile_image text NOT NULL DEFAULT '';
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT NOW();
ALTER TABLE api_profile ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS api_vocabentry (
    id bigserial PRIMARY KEY,
    en varchar(120) NOT NULL,
    uz varchar(120) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    user_id integer NOT NULL REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX IF NOT EXISTS api_vocabentry_user_en_uniq ON api_vocabentry (user_id, en);
"""


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(SQL, reverse_sql=migrations.RunSQL.noop),
    ]
