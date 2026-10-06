import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Clock,
  ShieldAlert,
  Monitor,
  Wifi,
} from 'lucide-react'

const defaultInstructions = [
  {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    title: 'Careful Reading',
    description: 'Read each question carefully before submitting your response. Multiple-choice questions have single or multiple correct options as stated.',
  },
  {
    icon: RefreshCw,
    color: 'text-amber-500',
    title: 'Do Not Refresh',
    description: 'Do not reload or refresh your browser during the test. Navigating away or closing tabs may trigger an automated integrity warning.',
  },
  {
    icon: Save,
    color: 'text-blue-500',
    title: 'Autosave Protection',
    description: 'Your answers are continuously autosaved to the cluster every few seconds. In case of network interruption, your progress is preserved.',
  },
  {
    icon: Clock,
    color: 'text-primary-500',
    title: 'Automatic Submission',
    description: 'The examination will automatically submit when the allocated timer expires. Keep an eye on the persistent on-screen countdown timer.',
  },
]

/**
 * ExamInstructions component
 *
 * @param {Array} customInstructions - Optional array of custom instruction strings
 */
export default function ExamInstructions({ customInstructions = [] }) {
  return (
    <div className="space-y-6">
      {/* Primary Guidelines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {defaultInstructions.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70"
            >
              <div className="mt-0.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs flex-shrink-0">
                <Icon size={18} className={item.color} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Course Specific Rules if provided */}
      {customInstructions.length > 0 && (
        <div className="rounded-xl border border-primary-200 bg-primary-50/40 p-4 space-y-2">
          <h4 className="text-xs font-bold text-primary-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-primary-600" />
            Course Specific Guidelines
          </h4>
          <ul className="space-y-1.5 text-xs text-primary-950">
            {customInstructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* System Technical Checklist */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          System Requirements & Environment
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Monitor size={15} className="text-slate-500" />
            <span>Desktop / Laptop Recommended</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Wifi size={15} className="text-emerald-500" />
            <span>Stable Internet Connection</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <AlertTriangle size={15} className="text-amber-500" />
            <span>Close Unrelated Tabs & Apps</span>
          </div>
        </div>
      </div>
    </div>
  )
}
