import Card from '../components/Card.jsx'

export default function About() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card label="Dev 1" style={{ minHeight: 120 }} />
        <Card label="Dev 2" style={{ minHeight: 120 }} />
        <Card label="Goals & Intentions" style={{ minHeight: 320 }} />
        <Card label="Roadmap" style={{ minHeight: 320 }} />
      </div>
    </div>
  )
}
