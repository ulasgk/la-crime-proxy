import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/la-crime", async (req, res) => {
  try {
    // Calculate date 30 days ago in ISO format
    const now = new Date();
    const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const isoDate = past30.toISOString();

    // Fetch up to 50,000 records since that date
    const url = `https://data.lacity.org/resource/2nrs-mtv8.json?$limit=50000&$where=date_occ > '${isoDate}'&$order=date_occ DESC`;
    const response = await fetch(url);
    const data = await response.json();

    // Categorize crime types
    const categories = {};
    for (const incident of data) {
      const type = incident.crm_cd_desc || "UNKNOWN";
      categories[type] = (categories[type] || 0) + 1;
    }

    res.json({
      total: data.length,
      categories: categories
    });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`🚨 LA Crime Proxy running on port ${PORT}`);
});


