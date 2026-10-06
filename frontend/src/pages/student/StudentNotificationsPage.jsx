import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Calendar,
  Clock,
  Award,
  ShieldAlert,
  CheckCircle2,
  CheckCheck,
  Check,
  ExternalLink,
  RotateCcw,
  Info,
  AlertTriangle,
} from 'lucide-react'
import {
  Badge,
  Button,
  EmptyState,
} from '../../components/common'
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

// Config per notification type
const TYPE_CONFIG = {
  exam_scheduled: {
    label: 'Exam Scheduled',
    icon: Calendar,
    badgeVariant: 'warning',
    accentColor: 'text-amber-400',
    borderColor: 'border-l-amber-500',
  },
  exam_starting_soon: {
    label: 'Exam Starting Soon',
    icon: Clock,
    badgeVariant: 'danger',
    accentColor: 'text-red-400',
    borderColor: 'border-l-red-500',
  },
  result_published: {
    label: 'Result Published',
    icon: Award,
    badgeVariant: 'success',
    accentColor: 'text-emerald-400',
    borderColor: 'border-l-emerald-500',
  },
  system: {
    label: 'System Notification',
    icon: Info,
    badgeVariant: 'default',
    accentColor: 'text-zinc-400',
    borderColor: 'border-l-zinc-500',
  },
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
    { id: 'exam_starting_soon', label: 'Starting Soon',  count: counts.exam_starting_soon },
    { id: 'result_published',   label: 'Results',        count: counts.result_published },
    { id: 'system',             label: 'System',         count: counts.system },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Notifications
            </h1>
            {counts.unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/60">
                {counts.unread} unread
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Exam schedules, starting-soon session reminders, score releases, and platform notices.
          </p>
        </div>

        {/* Mark All As Read Button */}
        <Button
          variant="secondary"
          size="sm"
          disabled={counts.unread === 0}
          onClick={handleMarkAllAsRead}
          leftIcon={<CheckCheck size={15} />}
        >
          Mark all as read
        </Button>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-800 text-amber-400 border border-zinc-700/80 shadow-xs'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-amber-950/70 text-amber-300'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Notifications List or Empty State ── */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <EmptyState
            icon={<Bell size={30} className="text-zinc-500" />}
            title="No notifications found"
            message={
              activeFilter === 'unread'
                ? 'All notifications have been marked as read.'
                : 'There are no notifications matching your current filter selection.'
            }
            action={
              activeFilter !== 'all' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                  leftIcon={<RotateCcw size={13} />}
                >
                  View All Notifications
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.system
            const Icon = config.icon

            return (
              <div
                key={item.id}
                className={[
                  'rounded-xl p-5 border transition-all duration-150',
                  item.read
                    ? 'bg-zinc-900/60 border-zinc-800/80'
                    : `bg-zinc-900 border-zinc-800 border-l-4 ${config.borderColor} shadow-sm`,
                ].join(' ')}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Icon, Type Badge, Title, Message */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 mt-0.5 ${
                        item.read
                          ? 'bg-zinc-800 text-zinc-500'
                          : 'bg-zinc-850 border border-zinc-700/60 ' + config.accentColor
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={config.badgeVariant} size="sm">
                          {config.label}
                        </Badge>
                        {!item.read && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            New
                          </span>
                        )}
                        <span className="text-zinc-500 text-[11px]">
                          {formatNotificationDate(item.createdAt)}
                        </span>
                      </div>

                      <h2
                        className={`text-sm font-semibold tracking-tight ${
                          item.read ? 'text-zinc-300' : 'text-zinc-100 font-bold'
                        }`}
                      >
                        {item.title}
                      </h2>

                      <p className="text-xs text-zinc-400 leading-relaxed pr-2">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0 pt-2 sm:pt-0">
                    {item.link && (
                      <Link to={item.link}>
                        <Button
                          variant="secondary"
                          size="xs"
                          rightIcon={<ExternalLink size={12} />}
                        >
                          View
                        </Button>
                      </Link>
                    )}

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleToggleRead(item.id)}
                    >
                      {item.read ? 'Mark unread' : 'Mark read'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
