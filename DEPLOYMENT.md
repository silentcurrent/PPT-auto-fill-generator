# Deploy to Render

This app uses PostgreSQL to persist placeholder mappings on Render (filesystem is ephemeral).

## Quick Deploy with Blueprint

1. Push this repo to GitHub/GitLab.
2. In [Render Dashboard](https://dashboard.render.com), click **New** → **Blueprint**.
3. Connect your repo and select it.
4. Render will detect `render.yaml` and create:
   - **PostgreSQL database** (`ppt-mappings-db`) – stores placeholder mappings
   - **Backend** (`ppt-backend`) – Flask API, connects to DB via `DATABASE_URL`
   - **Frontend** (`ppt-frontend`) – Next.js app

5. **Set `BACKEND_URL` for the frontend** (if needed):
   - Go to the frontend service → Environment
   - Set `BACKEND_URL` = your backend URL (e.g. `https://ppt-backend.onrender.com`)
   - The blueprint sets this by default; only change if your backend service has a different name/URL.

## Environment Variables

| Service | Variable | Source |
|---------|----------|--------|
| ppt-backend | `DATABASE_URL` | Auto from PostgreSQL (Blueprint) |
| ppt-frontend | `BACKEND_URL` | Set to backend URL (default: `https://ppt-backend.onrender.com`) |

## Local Development

Without `DATABASE_URL`, the backend uses the JSON file (`mapping_config.json`) for mappings. No database needed locally.

To test with PostgreSQL locally:

```bash
# Create a Postgres DB (e.g. Docker or local install), then:
export DATABASE_URL=postgresql://user:pass@localhost:5432/ppt_mappings
cd backend && python main.py
```

## Troubleshooting

- **Mappings not persisting**: Ensure `DATABASE_URL` is set for the backend (Render does this automatically when using the Blueprint).
- **Frontend can't reach backend**: Check `BACKEND_URL` on the frontend service. CORS is enabled on the backend.
- **502 Bad Gateway**: Backend may be starting; wait a minute. Free tier services spin down after inactivity.
