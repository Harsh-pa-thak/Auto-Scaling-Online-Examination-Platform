import { useLocation, useParams, Link } from 'react-router-dom'
import { Card, Badge, Button } from '../components/common'
import { Clock, ArrowRight } from 'lucide-react'

export default function RoutePlaceholder({ title, description, role = 'student' }) {
  const location = useLocation()
  const params = useParams()

  return (
    <div className="space-y-6 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
            {title}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {description || 'Module route registered and connected to application layout.'}
          </p>
        </div>
        <Badge variant="primary" dot>
          Path: {location.pathname}
        </Badge>
      </div>

      <Card padding="p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
          <div className="h-12 w-12 rounded-2xl bg-zinc-800 text-amber-400 flex items-center justify-center mb-4 border border-zinc-700/60">
            <Clock size={22} />
          </div>
          <h3 className="text-base font-semibold text-zinc-100">
            {title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Layout and route architecture for <code className="px-1.5 py-0.5 rounded bg-zinc-800 tabular-nums text-zinc-300">{location.pathname}</code> are configured.
          </p>

          {Object.keys(params).length > 0 && (
            <div className="mt-4 p-3 rounded-lg border border-zinc-800 text-xs text-left w-full">
              <span className="font-semibold text-zinc-300">Route Parameters:</span>
              <pre className="mt-1 text-zinc-400 tabular-nums text-xs">
                {JSON.stringify(params, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}>
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={14} />}>
                Go to {role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
