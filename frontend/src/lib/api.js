import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  auth,
  githubProvider,
  db,
  getCurrentUser,
  functions,
} from "./firebase";

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
const CANVAS_API_BASE = import.meta.env.DEV
  ? "http://127.0.0.1:5001/cpsc349-cs-dashboard/us-central1"
  : "https://us-central1-cpsc349-cs-dashboard.cloudfunctions.net";

export async function getCanvasCourses(userId = "jordan") {
  const res = await fetch(
    `${CANVAS_API_BASE}/getCanvasCourses?userId=${userId}`,
  );

  if (!res.ok) {
    throw new Error("Canvas fetch failed: ${res.status}");
  }

  return res.json();
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
