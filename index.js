import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/la-crime", async (req, res) => {
  try {
    // Calculate date 30 days ago in ISO format
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30)).toISOString();

    // SoQL query: get recent crimes only
    const url = `https://data.lacity.org/resource/2nrs-mtv8.json?$limit=50000&$order=date_occ DESC&$where=date_occ >= '${thirtyDaysAgo}'`;

    const response = await fetch(url);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    const breakdown = {};
    for (const item of data) {
      const crime = item.crm_cd_desc || "Unknown";
      breakdown[crime] = (breakdown[crime] || 0) + 1;
    }

    res.json({ total: data.length, breakdown });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`🚨 LA Crime Proxy running on port ${PORT}`);
});

