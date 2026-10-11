import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Clock,
  Monitor,
  Wifi,
} from 'lucide-react'

const defaultInstructions = [
  {
    icon: CheckCircle2,
    title: 'Read carefully',
    description: 'Read each question carefully before submitting your response. Multiple-choice questions have single or multiple correct options as stated.',
  },
  {
    icon: RefreshCw,
    title: 'Do not refresh',
    description: 'Do not reload or refresh your browser during the test. Navigating away or closing tabs may trigger an automated integrity warning.',
  },
  {
    icon: Save,
    title: 'Autosave',
    description: 'Your answers are saved every few seconds. If your connection drops, your progress is preserved.',
  },
  {
    icon: Clock,
    title: 'Automatic submission',
    description: 'The examination submits automatically when the timer reaches zero. Keep an eye on the countdown at the top of the screen.',
  },
]

const requirements = [
  { icon: Monitor,       label: 'Desktop or laptop recommended' },
  { icon: Wifi,          label: 'Stable internet connection' },
  { icon: AlertTriangle, label: 'Close unrelated tabs and apps' },
]

/**
 * ExamInstructions component
 *
 * @param {Array} customInstructions - Optional array of custom instruction strings
 */
export default function ExamInstructions({ customInstructions = [] }) {
  return (
    <div className="space-y-6">
      {/* General rules */}
      <ul className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {defaultInstructions.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-start gap-3">
            <Icon size={18} className="mt-0.5 flex-shrink-0 text-ink-3" />
            <div>
              <h4 className="text-sm font-semibold text-ink">{title}</h4>
              <p className="mt-1 text-sm text-ink-3">{description}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Course-specific rules */}
      {customInstructions.length > 0 && (
        <div className="border-t border-line pt-6">
          <h4 className="text-sm font-semibold text-ink">Course-specific guidelines</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2 marker:text-ink-2">
            {customInstructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>
      )}

      {/* System requirements */}
      <div className="border-t border-line pt-6">
        <h4 className="text-sm font-semibold text-ink">System requirements</h4>
        <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-ink-2 sm:grid-cols-3">
          {requirements.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon size={16} className="flex-shrink-0 text-ink-3" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
