import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'

export default function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, loading, profile, profileLoading } = useAuth()

  if (loading || (user && requireOnboarding && profileLoading)) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireOnboarding && !profile?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
