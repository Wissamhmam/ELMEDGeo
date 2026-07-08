const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "geo_project",
  password: process.env.DB_PASSWORD || "123456",
  port: parseInt(process.env.DB_PORT) || 5432,
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/parcel/:id", async (req, res) => {
  const parcelId = req.params.id;
  const region = req.query.region; // Get region from query parameters
  
  // Choose the column based on region
  // Default to titre_s2_t (Tunis) if not specified or unknown
  const searchColumn = region === "nabeul" ? "titre_n" : "titre_s2_t";

  try {
    // 1. Get parcel details from placess table
    const parcelResult = await pool.query(`
      SELECT 
        *,
        ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM placess
      WHERE ${searchColumn}::text = $1
      LIMIT 1
    `, [parcelId]);

    if (parcelResult.rows.length === 0) {
      return res.status(404).json({ message: "Parcelle non trouvée" });
    }

    const parcel = parcelResult.rows[0];

    // 2. Check if any line intersects this parcel
    const lineResult = await pool.query(`
      SELECT 
        l.ogc_fid,
        l.layer,
        ST_AsGeoJSON(ST_Transform(l.geom, 4326)) AS geometry
      FROM liness l, placess p
      WHERE p.id = $1 AND ST_Intersects(p.geom, l.geom)
    `, [parcel.id]);

    const lines = lineResult.rows.map(row => ({
      id: row.ogc_fid,
      layer: row.layer,
      geometry: JSON.parse(row.geometry)
    }));

    // Intersection details are already part of the placess row
    const intersectionData = (parcel.long_int_m !== null && parcel.long_int_m !== undefined) ? parcel : null;

    res.json({
      parcel: {
        ...parcel,
        geometry: JSON.parse(parcel.geometry)
      },
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

//----------------------------------------------
app.get("/titre_fonciere", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        nom as text,
        ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM placess
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: {
          id: row.id,
          name: row.text,
        },
        geometry: JSON.parse(row.geometry),
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching titre_fonciere from placess");
  }
});

app.get("/lines", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ogc_fid,
        layer,
        ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM liness
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: {
          id: row.ogc_fid,
          type: row.layer,
        },
        geometry: JSON.parse(row.geometry),
      })),
    };

    res.json(geojson);
  } catch (err) {
    res.status(500).send("Error fetching lines");
  }
});

app.get("/emprise", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ogc_fid,
        layer,
        ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM emprises
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        properties: {
          id: row.ogc_fid,
          layer: row.layer,
        },
        geometry: JSON.parse(row.geometry),
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error("Error fetching emprise:", err);
    res.status(500).send("Error fetching emprise");
  }
});