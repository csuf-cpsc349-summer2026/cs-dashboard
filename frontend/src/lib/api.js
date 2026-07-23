// Open-Meteo: Coordinates below are Fullerton, CA
const WEATHER_LAT = 33.8704;
const WEATHER_LON = -117.9242;

/**
 * Live: fetches current temperature and wind speed from Open-Meteo.
 */
export async function getWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,wind_speed_10m`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`);
  }
  return response.json();
}

/**
 * Stubbed: intended to call the Canvas LMS REST API to list the current
 * user's upcoming assignments.
 *
 * TODO: Replace with a real fetch once a Canvas token is available:
 *   GET https://<institution>.instructure.com/api/v1/users/self/upcoming_events
 *   Headers: { Authorization: `Bearer ${import.meta.env.VITE_CANVAS_TOKEN}` }
 *
 * Returns mock data shaped like the real Canvas assignments response so the
 * UI can be built against it before the integration goes live.
 */
// export async function getCanvasTasks() {
//   return [
//     {
//       id: 4501287,
//       name: "Homework 4: Binary Search Trees",
//       course_id: 123456,
//       html_url: "https://canvas.example.edu/courses/123456/assignments/4501287",
//       due_at: "2026-07-25T06:59:00Z",
//       points_possible: 100,
//       submission_types: ["online_upload"],
//     },
//     {
//       id: 4501299,
//       name: "Quiz 3: Graph Traversal",
//       course_id: 123456,
//       html_url: "https://canvas.example.edu/courses/123456/assignments/4501299",
//       due_at: "2026-07-22T06:59:00Z",
//       points_possible: 20,
//       submission_types: ["online_quiz"],
//     },
//   ];
// }

/**
 * MOCK Canvas LMS API Implementation
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
 * Stubbed: intended to call the GitHub REST API to list recent activity for
 * the authenticated user.
 *
 * TODO: Replace with a real fetch once a GitHub token is available:
 *   GET https://api.github.com/users/{username}/events
 *   Headers: {
 *     Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
 *     Accept: 'application/vnd.github+json',
 *   }
 *
 * Returns mock data shaped like the real GitHub events response so the UI
 * can be built against it before the integration goes live.
 */
export async function getGitHubActivity() {
  return [
    {
      id: "41302981234",
      type: "PushEvent",
      repo: { name: "jordanemq/cs-productivity-dashboard" },
      payload: {
        commits: [{ sha: "a1b2c3d", message: "Scaffold dashboard frontend" }],
      },
      created_at: "2026-07-19T04:12:00Z",
    },
    {
      id: "41302975678",
      type: "PullRequestEvent",
      repo: { name: "jordanemq/cs-productivity-dashboard" },
      payload: {
        action: "opened",
        number: 7,
      },
      created_at: "2026-07-18T21:47:00Z",
    },
  ];
}
