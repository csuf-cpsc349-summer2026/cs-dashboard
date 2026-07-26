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
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
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
