import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGitHub } from '../lib/api.js'

export default function Login() {
  const navigate = useNavigate()
  const [signingIn, setSigningIn] = useState(false)

  async function handleSignIn() {
    setSigningIn(true)
    try {
      await signInWithGitHub()
      navigate('/')
    } catch (error) {
      console.error(error)
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F7F8FA" }}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm"
        style={{ padding: "48px 40px" }}
      >
        {/* Wordmark + tagline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-2">
            {"{"}
            <span style={{ color: "var(--accent-color)" }}>B</span>yte
            <span style={{ color: "var(--accent-color)" }}>B</span>oard{"}"}
          </h1>
          <p className="text-sm text-gray-500 font-normal whitespace-nowrap text-center w-full">
            {"< "}Your focused space for studying, tasks, and progress.{" />"}
          </p>
        </div>

        {/* Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            disabled={signingIn}
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg font-medium text-sm text-white transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
            style={{
              backgroundColor: "#24292F",
              padding: "11px 20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1a1e22"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#24292F"
            }}
          >
            <GitHubMark className="w-4 h-4 text-white" />
            {signingIn ? "Signing in..." : "Sign in with GitHub"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

function GitHubMark({ className }) {
  return (
    <svg
      viewBox="0 0 98 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  )
}
