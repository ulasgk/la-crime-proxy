import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/la-crime", async (req, res) => {
  try {
    const url = "https://data.lacity.org/resource/2nrs-mtv8.json?$limit=1000000";
    const response = await fetch(url);
    const data = await response.json();

    // Filter records from the past 12 months
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const filtered = data.filter(item => {
      const date = new Date(item.date_occured || item.date_occured);
      return date >= oneYearAgo;
    });

    res.json({ count: filtered.length });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
