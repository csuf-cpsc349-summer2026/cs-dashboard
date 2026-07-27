import { useState } from 'react'
import { useCachedFetch } from '../../hooks/useCachedFetch.js'
import { getDailyAlgoChallenge, runCode } from '../../lib/api.js'

const DIFFICULTY_COLORS = {
  Easy: { bg: '#E4F5F1', text: '#0F6E56' },
  Medium: { bg: '#FBE7DF', text: '#D85A30' },
  Hard: { bg: '#FDE8E8', text: '#C0392B' },
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
]

const STARTER_CODE = {
  javascript: '// Write your solution, then log the result\nconsole.log()\n',
  python: '# Write your solution, then print the result\nprint()\n',
  java: 'public class Main {\n  public static void main(String[] args) {\n    // Write your solution, then print the result\n    System.out.println();\n  }\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your solution, then print the result\n  cout << endl;\n}\n',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  // Write your solution, then print the result\n  fmt.Println()\n}\n',
  ruby: '# Write your solution, then print the result\nputs\n',
}

const WANDBOX_COMPILERS = {
  javascript: 'nodejs-20.17.0',
  python: 'cpython-3.14.0',
  java: 'openjdk-jdk-21+35',
  cpp: 'gcc-13.2.0',
  go: 'go-1.22.8',
  ruby: 'ruby-3.4.9',
}

export default function AlgoChallengeCard() {
  const { data: challenge, loading, error } = useCachedFetch('daily-algo', getDailyAlgoChallenge)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(STARTER_CODE.javascript)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [expectedOutput, setExpectedOutput] = useState('')

  function handleLanguageChange(newLanguage) {
    setLanguage(newLanguage)
    setCode(STARTER_CODE[newLanguage])
    setResult(null)
  }

  async function handleRun() {
  setRunning(true)
  setResult(null)
  try {
    const output = await runCode(WANDBOX_COMPILERS[language], code)
    setResult(output)
  } catch (err) {
    setResult({ stderr: err.message, stdout: '' })
  } finally {
    setRunning(false)
  }
}

  if (loading) {
    return <p className="text-xs text-gray-400 mt-2">Loading...</p>
  }

  if (error || !challenge) {
    return <p className="text-xs text-gray-400 mt-2">Couldn't load today's challenge.</p>
  }

  const colors = DIFFICULTY_COLORS[challenge.difficulty] ?? DIFFICULTY_COLORS.Medium

  return (
    <div className="flex-1 min-h-0 flex flex-col mt-2 gap-3">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {challenge.difficulty}
          </span>
          {challenge.source === 'mock' && (
            <span className="text-[11px] text-gray-400">Sample challenge</span>
          )}
        </div>

        <a
          href={challenge.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gray-800 hover:text-gray-900 leading-snug"
          style={{ fontSize: 'clamp(1.125rem, 5cqh, 1.75rem)' }}
        >
          {challenge.title}
        </a>

        <p
          className="text-gray-500 mt-2"
          style={{ fontSize: 'clamp(0.8rem, 3cqh, 1rem)', lineHeight: 1.6 }}
        >
          {challenge.description}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none"
          >
            {LANGUAGES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="text-xs font-semibold text-white rounded-lg px-4 py-1.5 disabled:opacity-60"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            {running ? 'Running...' : 'Run Code'}
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={12}
          className="w-full text-xs font-mono text-gray-800 bg-gray-50 border border-gray-200 rounded-lg p-3 resize-y focus:outline-none"
        />

        <input
          type="text"
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          placeholder="Expected output (optional, e.g. 12)"
          className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none"
        />

        {result && (
          <div className="flex flex-col gap-2">
            <pre className="text-xs font-mono text-gray-100 bg-gray-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
              {result.stderr ? result.stderr : (result.stdout || '(no output)')}
            </pre>
            {!result.stderr && expectedOutput.trim() !== '' && (
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full self-start"
                style={
                  result.stdout.trim() === expectedOutput.trim()
                    ? { backgroundColor: '#E4F5F1', color: '#0F6E56' }
                    : { backgroundColor: '#FDE8E8', color: '#C0392B' }
                }
              >
                {result.stdout.trim() === expectedOutput.trim() ? 'Correct ✓' : 'Incorrect ✗'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}