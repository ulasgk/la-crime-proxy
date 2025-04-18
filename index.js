app.get("/la-crime", async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const isoDate = thirtyDaysAgo.toISOString();

    const url = `https://data.lacity.org/resource/2nrs-mtv8.json?$limit=50000&$where=date_occ >= '${isoDate}'&$order=date_occ DESC`;
    const response = await fetch(url);
    const data = await response.json();

    // ✅ Make sure it's an array before filtering
    if (!Array.isArray(data)) {
      throw new Error("Invalid response: not an array");
    }

    const crimeCounts = {};

    for (const item of data) {
      const type = item.crm_cd_desc || "Unknown";
      crimeCounts[type] = (crimeCounts[type] || 0) + 1;
    }

    res.json({
      total: data.length,
      breakdown: crimeCounts,
      since: isoDate
    });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});
