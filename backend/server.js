const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");

const app = express();

// Fail fast rather than silently connecting with a known default password.
if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD must be set before starting the API.");
}

// CORS - restrict to known origins
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:8080")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, veuillez réessayer plus tard." },
});

app.use(apiLimiter);

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "geo_project",
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT || "5432", 10),
});

// Input validation helper for parcel IDs
function isValidParcelId(id) {
  return /^[a-zA-Z0-9\-_.]{1,50}$/.test(id);
}

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/parcel/:id", async (req, res) => {
  const parcelId = req.params.id;

  if (!isValidParcelId(parcelId)) {
    return res.status(400).json({ message: "Format de titre foncier invalide. Caractères autorisés: lettres, chiffres, tirets, underscores, points. Maximum 50 caractères." });
  }

  const region = req.query.region;
  const searchColumn = region === "nabeul" ? "titre_n" : "titre_s2_t";

  try {
    const parcelResult = await pool.query(`
      SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM placess
      WHERE ${searchColumn}::text = $1
      LIMIT 1
    `, [parcelId]);

    if (parcelResult.rows.length === 0) {
      return res.status(404).json({ message: "Parcelle non trouvée" });
    }

    const parcel = parcelResult.rows[0];

    const lineResult = await pool.query(`
      SELECT l.ogc_fid, l.layer, ST_AsGeoJSON(ST_Transform(l.geom, 4326)) AS geometry
      FROM liness l, placess p
      WHERE p.id = $1 AND ST_Intersects(p.geom, l.geom)
    `, [parcel.id]);

    const lines = lineResult.rows.map(row => ({
      id: row.ogc_fid,
      layer: row.layer,
      geometry: JSON.parse(row.geometry)
    }));

    const intersectionData = (parcel.long_int_m !== null && parcel.long_int_m !== undefined) ? parcel : null;

    res.json({
      parcel: { ...parcel, geometry: JSON.parse(parcel.geometry) },
      intersectingLines: lines,
      isAffected: lines.length > 0,
      intersectionInfo: intersectionData ? {
        longueurIntersection: intersectionData.long_int_m,
        surfaceIntersection: intersectionData.surf_emp_m,
        pourcentageIntersection: intersectionData.pct_emp
      } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching for parcel");
  }
});

app.get("/titre_fonciere", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nom as text, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM placess
    `);

    res.json({
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: { id: row.id, name: row.text },
        geometry: JSON.parse(row.geometry),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching titre_fonciere from placess");
  }
});

app.get("/lines", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ogc_fid, layer, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM liness
    `);

    res.json({
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: { id: row.ogc_fid, type: row.layer },
        geometry: JSON.parse(row.geometry),
      })),
    });
  } catch (err) {
    res.status(500).send("Error fetching lines");
  }
});

app.get("/emprise", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ogc_fid, layer, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM emprises
    `);

    res.json({
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: { id: row.ogc_fid, layer: row.layer },
        geometry: JSON.parse(row.geometry),
      })),
    });
  } catch (err) {
    console.error("Error fetching emprise:", err);
    res.status(500).send("Error fetching emprise");
  }
});

const port = Number.parseInt(process.env.PORT || "3000", 10);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
