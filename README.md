

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1slM79VmsNGziHmx2SOni1zvLul7pNrDP

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Backend (Django)

**Prerequisites:** Python 3.11+

1. Create a virtual environment and install deps:
   `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
2. Copy env and set secrets:
   `cp .env.example .env` and set `DJANGO_SECRET_KEY` and `GEMINI_API_KEY`
3. Run migrations:
   `python manage.py migrate`
4. Start the API:
   `python manage.py runserver 0.0.0.0:8000`

**Frontend API base URL**
Set `VITE_API_BASE_URL=http://localhost:8000` in `.env.local` if needed.
