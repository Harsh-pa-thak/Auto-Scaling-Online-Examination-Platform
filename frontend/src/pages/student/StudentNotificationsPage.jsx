import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Calendar,
  Clock,
  Award,
  CheckCheck,
  ArrowRight,
  RotateCcw,
  Info,
} from 'lucide-react'
import { Button, EmptyState } from '../../components/common'
import { mockNotifications } from '../../data/mockData'

// Format date helper
function formatNotificationDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

// Label + icon per notification type
const TYPE_CONFIG = {
  exam_scheduled:     { label: 'Exam scheduled',     icon: Calendar },
  exam_starting_soon: { label: 'Starting soon',      icon: Clock },
  result_published:   { label: 'Result published',   icon: Award },
  system:             { label: 'System',             icon: Info },
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'unread' | 'exam_scheduled' | 'exam_starting_soon' | 'result_published' | 'system'

  // Counts
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      exam_scheduled: notifications.filter((n) => n.type === 'exam_scheduled').length,
      exam_starting_soon: notifications.filter((n) => n.type === 'exam_starting_soon').length,
      result_published: notifications.filter((n) => n.type === 'result_published').length,
      system: notifications.filter((n) => n.type === 'system').length,
    }
  }, [notifications])

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'unread') return !item.read
      return item.type === activeFilter
    })
  }, [notifications, activeFilter])

  // Handlers
  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const FILTER_TABS = [
    { id: 'all',                label: 'All',            count: counts.all },
    { id: 'unread',             label: 'Unread',         count: counts.unread },
    { id: 'exam_scheduled',     label: 'Scheduled',      count: counts.exam_scheduled },
    { id: 'exam_starting_soon', label: 'Starting soon',  count: counts.exam_starting_soon },
    { id: 'result_published',   label: 'Results',        count: counts.result_published },
    { id: 'system',             label: 'System',         count: counts.system },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      {/* ── Page Header ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Exam schedules, reminders, result releases, and platform notices.
            {counts.unread > 0 && (
              <span className="text-zinc-200"> {counts.unread} unread.</span>
            )}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={counts.unread === 0}
          onClick={handleMarkAllAsRead}
          leftIcon={<CheckCheck size={16} />}
        >
          Mark all as read
        </Button>
      </header>

      <div className="space-y-4">
        {/* ── Category Tabs ── */}
        <nav aria-label="Notification type" className="flex gap-6 overflow-x-auto border-b border-zinc-800">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-amber-500 text-zinc-50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {tab.label}
                <span className="tabular-nums text-zinc-500">{tab.count}</span>
              </button>
            )
          })}
        </nav>

        {/* ── List or Empty State ── */}
        {filteredNotifications.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Bell size={28} />}
              title="No notifications"
              message={
                activeFilter === 'unread'
                  ? 'You are all caught up.'
                  : 'Nothing matches this filter.'
              }
              action={
                activeFilter !== 'all' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                    leftIcon={<RotateCcw size={14} />}
                  >
                    Show all
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <ul className="card divide-y divide-zinc-800">
            {filteredNotifications.map((item) => {
              const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.system
              const Icon = config.icon

              return (
                <li key={item.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
                  <Icon
                    size={18}
                    className={`mt-0.5 flex-shrink-0 ${item.read ? 'text-zinc-600' : 'text-zinc-400'}`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-amber-500" aria-label="Unread" />
                      )}
                      <span>{config.label}</span>
                      <span>·</span>
                      <span>{formatNotificationDate(item.createdAt)}</span>
                    </p>
                    <h2
                      className={`mt-1 text-sm ${
                        item.read ? 'font-medium text-zinc-300' : 'font-semibold text-zinc-50'
                      }`}
                    >
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">{item.message}</p>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2">
                    {item.link && (
                      <Link to={item.link}>
                        <Button variant="secondary" size="xs" rightIcon={<ArrowRight size={12} />}>
                          View
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="xs" onClick={() => handleToggleRead(item.id)}>
                      {item.read ? 'Mark unread' : 'Mark read'}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
