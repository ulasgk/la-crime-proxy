import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/la-crime", async (req, res) => {
  try {
    const url = "https://data.lacity.org/resource/2nrs-mtv8.json?$limit=5000"; // TEMP: Lower limit
    const response = await fetch(url);
    const data = await response.json();

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const filtered = data.filter(item => {
      const dateStr = item.date_occ || item.date_rptd;
      if (!dateStr) return false;
      const date = new Date(dateStr);
      return date >= oneYearAgo;
    });

    res.json({ count: filtered.length });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`🚨 LA Crime Proxy running on port ${PORT}`);
});
