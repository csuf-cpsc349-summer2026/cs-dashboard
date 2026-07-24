import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth, githubProvider, db, getCurrentUser } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Live: fetches current temperature and wind speed from Open-Meteo.
 */

// Open-Meteo: Coordinates below are Fullerton, CA
const WEATHER_LAT = 33.8704;
const WEATHER_LON = -117.9242;

export async function getWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,wind_speed_10m`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`);
  }
  return response.json();
}

/**
 * Live: MOCK Canvas LMS API Implementation
 */
const CANVAS_API_BASE =
  "http://127.0.0.1:5001/cpsc349-cs-dashboard/us-central1";

export async function getCanvasCourses() {
  const userId = "jordan"; // TODO: replace with real lookup function when user flow exists
  const res = await fetch(
    `${CANVAS_API_BASE}/getCanvasCourses?userId=${userId}`,
  );

  if (!res.ok) {
    throw new Error("Canvas fetch failed: ${res.status}");
  }

  return res.json();
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
 * TODO: move token usage server-side via callable function
 */

export async function getGitHubRepos() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not signed in...");
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const token = userDoc.data()?.githubAccessToken;

  const res = await fetch("https://api.github.com/user/repos", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`GitHub fetch failed: ${res.status}`);
  }

  return res.json();
}
