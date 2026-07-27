import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  auth,
  githubProvider,
  db,
  getCurrentUser,
  functions,
} from "./firebase";

/**
 * Live: geocodes a city name via Open-Meteo's Geocoding API, then fetches
 * current conditions plus today's high/low from Open-Meteo's forecast API.
 */

export async function getWeather(city) {
  // Open-Meteo's geocoding API returns zero results for "City, ST"-style
  // input (e.g. the onboarding default "Fullerton, CA") — it wants a bare
  // city name, so drop anything from the first comma onward.
  const cityName = city.split(",")[0].trim();
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error(`Geocoding request failed: ${geoResponse.status}`);
  }
  const geoData = await geoResponse.json();
  const location = geoData.results?.[0];
  if (!location) {
    throw new Error(`No location found for "${city}"`);
  }

  const { latitude, longitude, name } = location;
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=fahrenheit`;
  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) {
    throw new Error(`Open-Meteo request failed: ${forecastResponse.status}`);
  }
  const forecast = await forecastResponse.json();

  return {
    location: name,
    temperature: forecast.current.temperature_2m,
    weatherCode: forecast.current.weather_code,
    high: forecast.daily.temperature_2m_max[0],
    low: forecast.daily.temperature_2m_min[0],
  };
}

/**
 * Live: Hacker News (public, keyless) top stories for the Coder page's News card.
 */
const HN_BASE = "https://hacker-news.firebaseio.com/v0";
const NEWS_COUNT = 8;

export async function getTechNews() {
  const idsRes = await fetch(`${HN_BASE}/topstories.json`);
  if (!idsRes.ok) {
    throw new Error(`Hacker News fetch failed: ${idsRes.status}`);
  }
  const ids = (await idsRes.json()).slice(0, NEWS_COUNT * 2); // buffer for filtered-out items

  const items = await Promise.all(
    ids.map((id) => fetch(`${HN_BASE}/item/${id}.json`).then((r) => r.json())),
  );

  return items
    .filter((item) => item?.type === "story" && item.url)
    .slice(0, NEWS_COUNT)
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      score: item.score,
      by: item.by,
    }));
}

/**
 * Live: MOCK Canvas LMS API Implementation
 */
const CANVAS_API_BASE = import.meta.env.DEV
  ? "http://127.0.0.1:5001/cpsc349-cs-dashboard/us-central1"
  : "https://us-central1-cpsc349-cs-dashboard.cloudfunctions.net";

export async function getCanvasCourses(userId) {
  const res = await fetch(
    `${CANVAS_API_BASE}/getCanvasCourses?userId=${userId}`,
  );

  if (!res.ok) {
    throw new Error("Canvas fetch failed: ${res.status}");
  }

  return res.json();
}

/**
 * Live: fetches the latest scraped campus parking snapshot from Firestore.
 */

export async function getParkingStatus() {
  const snap = await getDoc(doc(db, "parking", "latest"));
  return snap.exists() ? snap.data() : null;
}

/**
 * Flattens Canvas courses into a task-shaped list for the Study page's
 * Kanban board: { id, title, dueAt, source }.
 */
export async function getCanvasTasks(userId = "jordan") {
  const data = await getCanvasCourses(userId);

  return data.courses.flatMap((course) =>
    course.assignments.map((assignment) => ({
      id: `canvas-${assignment.id}`,
      title: `${assignment.name} (${course.course_code})`,
      dueAt: assignment.due_at,
      source: "canvas",
    })),
  );
}

/**
 * Live (with mock fallback): Daily Algo Challenge for the Coder page.
 * Tries the community LeetCode daily-challenge API first; if that's down or
 * slow, falls back to the mocked Cloud Function so the card never breaks.
 */
const LEETCODE_DAILY_URL = "https://alfa-leetcode-api.onrender.com/daily";
const LEETCODE_TIMEOUT_MS = 4000;

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function getDailyAlgoChallenge() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LEETCODE_TIMEOUT_MS);
    const res = await fetch(LEETCODE_DAILY_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`LeetCode daily fetch failed: ${res.status}`);
    const data = await res.json();

    return {
      title: data.questionTitle,
      difficulty: data.difficulty,
      description: stripHtml(data.question),
      url: data.questionLink,
      date: data.date,
      source: "live",
    };
  } catch (error) {
    console.error("Live daily algo challenge failed, falling back to mock:", error);

    const res = await fetch(`${CANVAS_API_BASE}/getDailyAlgoChallenge`);
    if (!res.ok) {
      throw new Error(`Mock daily algo challenge fetch failed: ${res.status}`);
    }
    const data = await res.json();

    return { ...data, source: "mock" };
  }
}

/**
 * TESTING: GitHub OAuth
 */

export async function signInWithGitHub() {
  const result = await signInWithPopup(auth, githubProvider);
  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  const user = result.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.photoURL,
      githubAccessToken: token,
    },
    { merge: true },
  );

  return user;
}

/**
 * TESTING: GitHub Repo Fetch
 */

export async function getGitHubRepos() {
  const callable = httpsCallable(functions, "getGitHubRepos");
  const result = await callable();

  return result.data;
}
