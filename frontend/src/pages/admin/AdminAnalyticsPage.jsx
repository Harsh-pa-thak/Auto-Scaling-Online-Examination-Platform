import { useEffect, useState } from 'react'
import { StatsCard } from '../../components/common'
import { api } from '../../lib/api'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({ students: 0, exams: 0, attempts: 0, averageScore: 0 })
  useEffect(() => { api('/admin/analytics').then(setAnalytics).catch(() => {}) }, [])
  return <div className="space-y-8">
    <header><h1 className="page-title">Analytics</h1><p className="page-subtitle">Aggregated metrics from the examination database.</p></header>
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Students" value={analytics.students} description="Registered students" />
      <StatsCard title="Exams" value={analytics.exams} description="Created examinations" />
      <StatsCard title="Attempts" value={analytics.attempts} description="Submitted attempts" />
      <StatsCard title="Average score" value={`${Number(analytics.averageScore).toFixed(1)}%`} description="Across submitted attempts" />
    </section>
  </div>
}
