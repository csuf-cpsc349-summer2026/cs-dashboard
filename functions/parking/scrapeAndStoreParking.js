const { parseParkingHtml } = require("./parseParkingHtml");
const { getFirestore } = require("firebase-admin/firestore");

async function scrapeAndStoreParking() {
  const res = await fetch(
    "https://parking.fullerton.edu/parkinglotcounts/mobile.aspx",
  );
  const html = await res.text();
  const lots = parseParkingHtml(html);

  const db = getFirestore();
  await db.collection("parking").doc("latest").set({
    lots,
    scrapedAt: new Date().toISOString(),
  });

  return lots;
}

module.exports = { scrapeAndStoreParking };
