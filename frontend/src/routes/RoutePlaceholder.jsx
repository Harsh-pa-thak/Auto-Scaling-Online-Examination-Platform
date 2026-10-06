import { useLocation, useParams, Link } from 'react-router-dom'
import { Card, Badge, Button } from '../components/common'
import { Clock, ArrowRight } from 'lucide-react'

export default function RoutePlaceholder({ title, description, role = 'student' }) {
  const location = useLocation()
  const params = useParams()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {description || 'Module route registered and connected to application layout.'}
          </p>
        </div>
        <Badge variant={role === 'admin' ? 'primary' : 'info'} dot>
          Path: {location.pathname}
        </Badge>
      </div>

      <Card padding="p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
          <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 border border-primary-100 shadow-sm">
            <Clock size={22} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            {title} Module Stub
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Layout and route architecture for <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700">{location.pathname}</code> are configured. Full module UI and interactions will be built in the upcoming phase.
          </p>

          {Object.keys(params).length > 0 && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-left w-full">
              <span className="font-semibold text-slate-700">Route Parameters:</span>
              <pre className="mt-1 text-slate-600 font-mono text-[11px]">
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
