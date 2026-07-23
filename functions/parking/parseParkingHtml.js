const cheerio = require("cheerio");

function parseParkingHtml(html) {
  const $ = cheerio.load(html);
  const lots = [];

  $("#GridView_All tr").each((i, row) => {
    const $row = $(row);
    const name = $row.find("p.LocationName").text().trim();

    if (!name) return;

    const availableText = $row.find('span[id*="Label_AllSpots"]').text().trim();
    const totalText = $row.find('span[id*="Label_Avail_"]').text().trim();
    const availableNum = parseInt(availableText, 10);

    lots.push({
      name,
      available: isNaN(availableNum) ? null : availableNum,
      status: isNaN(availableNum) ? availableText : null,
      total: parseInt(totalText, 10),
    });
  });

  return lots;
}

module.exports = { parseParkingHtml };
