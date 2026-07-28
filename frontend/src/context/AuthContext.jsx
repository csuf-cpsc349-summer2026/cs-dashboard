import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { resolveAccentColor } from "../lib/theme";

/**
 * Reactive counterpart to getCurrentUser() in firebase.js. getCurrentUser()
 * is a one-off promise for async calls (e.g. inside api.js); this context
 * holds auth state in React state so components/routes re-render on login,
 * logout, or initial session resolution.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Mirrors users/{uid} so onboarding/profile state updates live (e.g. right
  // after the onboarding wizard writes onboardingComplete).
  useEffect(() => {
    if (loading) return;

    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setProfile(snap.exists() ? snap.data() : null);
      setProfileLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Applies the user's saved theme (accent preset + light/dark mode) on load,
  // so it's already correct on a fresh session, not just right after changing it.
  useEffect(() => {
    if (!profile) return;

    const mode = profile.colorMode ?? "light";
    const preset = profile.accentPreset ?? "indigo";

    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.style.setProperty(
      "--accent-color",
      resolveAccentColor(preset, mode),
    );
  }, [profile]);

  const value = useMemo(
    () => ({ user, loading, profile, profileLoading }),
    [user, loading, profile, profileLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
