# ELMEDGeo — Geospatial Parcel Impact Analysis

A geospatial web application built around a React map interface, an Express API, and PostgreSQL/PostGIS. The backend retrieves land-parcel geometries and checks their spatial relationship with mapped line and infrastructure layers.

## What the repository contains

- **Interactive frontend:** React, Vite, Leaflet, and React-Leaflet.
- **API backend:** Express endpoints backed by PostgreSQL.
- **Spatial queries:** PostGIS functions such as `ST_Intersects`, `ST_Transform`, and `ST_AsGeoJSON`.
- **Parcel lookup:** retrieves parcel details using a land-title identifier, with a region selector for the Tunis and Nabeul identifier columns.
- **Impact information:** returns intersecting line features and, when available, intersection length, area, and percentage fields.
- **GeoJSON output:** exposes parcel, line, and emprise layers as GeoJSON FeatureCollections.
- **Container setup:** Docker Compose configures PostGIS, the backend, and the frontend.

## Architecture

```text
React + Leaflet frontend
          |
          v
     Express API
          |
          v
   PostgreSQL + PostGIS
```

## Repository layout

| Path | Purpose |
|---|---|
| `frontend/` | React/Vite map application |
| `backend/` | Express API and Dockerfile |
| `database/` | Database initialization scripts and geospatial data files |
| `docker-compose.yml` | Local multi-container setup |

## Run with Docker Compose

Create a root `.env` file with the variables consumed by `docker-compose.yml`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=replace_with_a_strong_local_password
POSTGRES_DB=geo_project
DB_PORT=5432
CORS_ORIGIN=http://localhost:8080
```

Then start the stack:

```bash
docker compose up --build
```

The frontend is published on port `8080`. The backend is exposed internally to the Compose network on port `3000`, and the database uses the PostGIS `17-3.5` image.

The database directory is mounted into the Postgres initialization directory. Review the initialization scripts and included data files before using this setup with production or sensitive datasets.

## API endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/` | API health-style response |
| `GET` | `/api/parcel/:id?region=tunis` | Retrieve a parcel and intersecting lines |
| `GET` | `/titre_fonciere` | Return parcel geometries as GeoJSON |
| `GET` | `/lines` | Return line geometries as GeoJSON |
| `GET` | `/emprise` | Return emprise geometries as GeoJSON |

The parcel route uses the Nabeul parcel identifier column when `region=nabeul`; otherwise it uses the Tunis column.

## Technology

- React, Vite, Leaflet, React-Leaflet
- Node.js, Express
- PostgreSQL, PostGIS
- Docker, Docker Compose

## Configuration and security notes

- Database credentials are supplied to the containers through Compose environment variables. Do not commit a real root `.env` file.
- The backend source contains a development fallback database password; remove that fallback and require explicit environment configuration before production deployment.
- Configure `CORS_ORIGIN` to the exact frontend origin(s) you trust.
- The repository currently tracks files under `backend/node_modules` despite the root `.gitignore` rule. These generated dependencies should be removed from version control in a separate cleanup commit; the ignore rule alone does not untrack existing files.
- Database dump and GeoJSON files are included in the repository. Confirm their intended use and data sensitivity before redistributing them.

## Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
node server.js
```

For the local backend command, ensure PostgreSQL/PostGIS is running and the `DB_*` environment variables point to it.
