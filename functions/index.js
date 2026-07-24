/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { setGlobalOptions } = require("firebase-functions");
const { onRequest, onCall, HttpsError } = require("firebase-functions/https");
const { scrapeAndStoreParking } = require("./parking/scrapeAndStoreParking");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const canvasCourses = require("./fixtures/canvasCourses.json");

initializeApp();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.health = onRequest((req, res) => {
  res.json({ status: "ok" });
});

exports.getCanvasCourses = onRequest((req, res) => {
  cors(req, res, () => {
    const userId = req.query.userId;
    const userData = canvasCourses[userId];

    if (!userData) {
      return res.status(404).json({ error: "invalid userId" });
    }

    res.json(userData);
  });
});

exports.getGitHubRepos = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be signed in.");
  }

  const uid = request.auth.uid;
  const db = getFirestore();
  const userDoc = await db.collection("users").doc(uid).get();
  const token = userDoc.data()?.githubAccessToken;

  if (!token) {
    throw new HttpsError("failed-precondition", "No GitHub token on file.");
  }

  const res = await fetch(
    "https://api.github.com/user/repos?affiliation=owner&sort=updated",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new HttpsError("internal", `GitHub fetch failed: ${res.status}`);
  }

  return res.json();
});

exports.scrapeAndStoreParking = onRequest((req, res) => {
  cors(req, res, async () => {
    const lots = await scrapeAndStoreParking();

    res.json({ lots });
  });
});

exports.scheduledScrapeParking = onSchedule(
  {
    schedule: "0,15,30,45 6-22 * * *",
    timeZone: "America/Los_Angeles",
  },
  async () => {
    await scrapeAndStoreParking();
  },
);
