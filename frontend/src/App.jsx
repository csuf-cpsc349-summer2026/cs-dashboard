import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import Layout from './layouts/Layout.jsx'
import Login from './pages/Login.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Home from './pages/Home.jsx'
import Study from './pages/Study.jsx'
import Coder from './pages/Coder.jsx'
import Settings from './pages/Settings.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarding={false}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path="/coder" element={<Coder />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}
