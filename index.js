import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/la-crime", async (req, res) => {
  try {
    const url = "https://data.lacity.org/resource/2nrs-mtv8.json?$limit=10000&$order=date_occ DESC";
    const response = await fetch(url);
    const data = await response.json();

    console.log(`✅ Total records fetched: ${data.length}`);

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    let validCount = 0;

    data.forEach((item, idx) => {
      const dateStr = item.date_occ || item.date_rptd;
      if (!dateStr) return;

      const crimeDate = new Date(dateStr);
      if (isNaN(crimeDate)) return;

      if (idx < 10) {
        console.log(`📅 Record ${idx + 1}: ${dateStr} => ${crimeDate}`);
      }

      if (crimeDate >= oneYearAgo) validCount++;
    });

    console.log(`📊 Total crimes in the last year: ${validCount}`);

    res.json({ count: validCount });
  } catch (err) {
    console.error("❌ Fetch or parse error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`🚨 LA Crime Proxy running on port ${PORT}`);
});

