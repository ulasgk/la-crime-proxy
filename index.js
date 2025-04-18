import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/la-crime", async (req, res) => {
  try {
    const url = "https://data.lacity.org/resource/2nrs-mtv8.json?$limit=10000"; // Reduced limit for testing
    const response = await fetch(url);
    const data = await response.json();

    console.log("Total records fetched:", data.length);

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    let sampleDates = [];
    const filtered = data.filter((item, index) => {
      const rawDate = item.date_occ || item.date_rptd;
      if (index < 10) sampleDates.push(rawDate); // capture first 10 dates

      const date = new Date(rawDate);
      return date >= oneYearAgo;
    });

    console.log("Sample date fields:", sampleDates);
    console.log("Filtered records in the last year:", filtered.length);

    res.json({ count: filtered.length });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`🚨 LA Crime Proxy running on port ${PORT}`);
});
