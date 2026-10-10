import { useEffect, useState } from 'react'
import { Badge, Card, EmptyState, SearchBar, Table } from '../../components/common'
import { api } from '../../lib/api'

export default function AdminResultsPage() {
  const [results, setResults] = useState([])
  const [search, setSearch] = useState('')
  useEffect(() => { api('/admin/results').then(setResults).catch(() => {}) }, [])
  const filtered = results.filter((result) => {
    const query = search.toLowerCase()
    return !query || result.student?.name?.toLowerCase().includes(query) || result.exam?.title?.toLowerCase().includes(query)
  })
  const columns = [
    { key: 'student', label: 'Student', render: (_, row) => <div><p className="font-medium text-zinc-100">{row.student?.name}</p><p className="text-xs text-zinc-500">{row.student?.email}</p></div> },
    { key: 'exam', label: 'Exam', render: (_, row) => row.exam?.title },
    { key: 'score', label: 'Score', render: (_, row) => `${row.score ?? 0} / ${row.exam?.totalMarks ?? 0}` },
    { key: 'status', label: 'Status', render: (_, row) => <Badge variant={row.score >= (row.exam?.passingMarks || 0) ? 'success' : 'danger'}>{row.score >= (row.exam?.passingMarks || 0) ? 'Passed' : 'Failed'}</Badge> },
    { key: 'submittedAt', label: 'Submitted', render: (value) => value ? new Date(value).toLocaleString() : '-' },
  ]
  return <div className="space-y-8">
    <header className="page-header"><div><h1 className="page-title">Results</h1><p className="page-subtitle">Live results from submitted examination attempts.</p></div></header>
    <SearchBar value={search} onChange={setSearch} placeholder="Search student or examination" />
    <Card>{filtered.length ? <Table columns={columns} data={filtered} /> : <EmptyState title="No results found" description="Submitted attempts will appear here." />}</Card>
  </div>
}
