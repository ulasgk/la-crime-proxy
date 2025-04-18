import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/la-crime", async (req, res) => {
  try {
    const url = "https://data.lacity.org/resource/2nrs-mtv8.json?$limit=50000&$order=date_occ DESC";
    const response = await fetch(url);
    const data = await response.json();

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Only keep rows from the last 30 days
    const filtered = data.filter(item => {
      const dateStr = item.date_occ || item.date_rptd;
      if (!dateStr) return false;
      const date = new Date(dateStr);
      return !isNaN(date) && date >= thirtyDaysAgo;
    });

    // Count by crime category
    const counts = {};
    filtered.forEach(item => {
      const type = item.crm_cd_desc || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });

    res.json({ total: filtered.length, breakdown: counts });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`🚨 LA Crime Proxy running on port ${PORT}`);
});
