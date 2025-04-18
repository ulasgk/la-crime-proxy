import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Get ISO date 12 months ago
const now = new Date();
const lastYear = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split("T")[0];

app.get("/la-crime", async (req, res) => {
  try {
    const response = await fetch(`https://data.lacity.org/resource/2nrs-mtv8.json?$select=count(*)&$where=date_occured > '${lastYear}'`);
    const data = await response.json();
    const count = parseInt(data[0].count);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`LA Crime Proxy listening on port ${PORT}`);
});
