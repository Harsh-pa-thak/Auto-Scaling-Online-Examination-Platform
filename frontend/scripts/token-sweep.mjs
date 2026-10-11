/**
 * One-off codemod: translate the old dark-theme palette (zinc + colored-500/400
 * utilities) onto the semantic token layer defined in tailwind.config.js.
 *
 * Only touches class-name color tokens; layout, logic and structure untouched.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = 'src'

// Shade order matters: longer shades first so `zinc-50` never eats `zinc-500`.
const SHADES = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50]

const NEUTRAL_FAMILIES = ['zinc', 'slate', 'gray', 'stone', 'neutral']

// prefix -> { shade -> token }
const NEUTRAL_MAP = {
  text: { 950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink-2', 600: 'ink-2', 500: 'ink-3', 400: 'ink-3', 300: 'ink-2', 200: 'ink-2', 100: 'ink', 50: 'ink' },
  bg:   { 950: 'canvas', 900: 'surface', 800: 'sunken', 700: 'sunken', 600: 'sunken', 500: 'sunken', 400: 'sunken', 300: 'sunken', 200: 'sunken', 100: 'sunken', 50: 'sunken' },
  border: { 950: 'line', 900: 'line', 800: 'line', 700: 'line-strong', 600: 'line-strong', 500: 'line-strong', 400: 'line', 300: 'line', 200: 'line', 100: 'line', 50: 'line' },
  divide: { 950: 'line', 900: 'line', 800: 'line', 700: 'line', 600: 'line', 500: 'line', 400: 'line', 300: 'line', 200: 'line', 100: 'line', 50: 'line' },
  ring:   { 950: 'canvas', 900: 'line', 800: 'line-strong', 700: 'line-strong', 600: 'line-strong', 500: 'accent', 400: 'accent', 300: 'accent', 200: 'line', 100: 'line', 50: 'line' },
  from:   { 950: 'canvas', 900: 'surface', 800: 'sunken', 700: 'sunken', 600: 'sunken', 500: 'sunken', 400: 'sunken', 300: 'sunken', 200: 'sunken', 100: 'sunken', 50: 'sunken' },
  via:    { 950: 'canvas', 900: 'surface', 800: 'sunken', 700: 'sunken', 600: 'sunken', 500: 'sunken', 400: 'sunken', 300: 'sunken', 200: 'sunken', 100: 'sunken', 50: 'sunken' },
  to:     { 950: 'canvas', 900: 'surface', 800: 'sunken', 700: 'sunken', 600: 'sunken', 500: 'sunken', 400: 'sunken', 300: 'sunken', 200: 'sunken', 100: 'sunken', 50: 'sunken' },
}

const COLOR_MAP = {
  amber:   { text: 'accent-strong', bg: 'accent', bgSoft: 'accent-soft', border: 'accent', from: 'accent', to: 'accent', via: 'accent', ring: 'accent' },
  emerald: { text: 'success', bg: 'success', bgSoft: 'success-soft', border: 'success', from: 'success', to: 'success', via: 'success', ring: 'success' },
  green:   { text: 'success', bg: 'success', bgSoft: 'success-soft', border: 'success', from: 'success', to: 'success', via: 'success', ring: 'success' },
  red:     { text: 'danger', bg: 'danger', bgSoft: 'danger-soft', border: 'danger', from: 'danger', to: 'danger', via: 'danger', ring: 'danger' },
  rose:    { text: 'danger', bg: 'danger', bgSoft: 'danger-soft', border: 'danger', from: 'danger', to: 'danger', via: 'danger', ring: 'danger' },
  blue:    { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  sky:     { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  indigo:  { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  violet:  { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  purple:  { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  fuchsia: { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  pink:    { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  cyan:    { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  teal:    { text: 'info', bg: 'info', bgSoft: 'info-soft', border: 'info', from: 'info', to: 'info', via: 'info', ring: 'info' },
  yellow:  { text: 'warning', bg: 'warning', bgSoft: 'warning-soft', border: 'warning', from: 'warning', to: 'warning', via: 'warning', ring: 'warning' },
  orange:  { text: 'warning', bg: 'warning', bgSoft: 'warning-soft', border: 'warning', from: 'warning', to: 'warning', via: 'warning', ring: 'warning' },
}

function buildReplacements() {
  const pairs = []

  // 1. Explicit prefixes that must be matched before the generic families.
  for (const [prefix, table] of Object.entries(NEUTRAL_MAP)) {
    for (const family of NEUTRAL_FAMILIES) {
      for (const shade of SHADES) {
        const token = table[shade]
        if (token) pairs.push([`${prefix}-${family}-${shade}`, `${prefix}-${token}`])
      }
    }
  }

  // 2. Colored families: full-opacity swatches and /10-/30 tints.
  for (const [family, map] of Object.entries(COLOR_MAP)) {
    for (const shade of [900, 800, 700, 600, 500, 400, 300, 200, 100]) {
      for (const [prefix, token] of Object.entries(map)) {
        if (prefix === 'bgSoft') continue
        pairs.push([`${prefix}-${family}-${shade}`, `${prefix}-${token}`])
      }
    }
    // Tinted backgrounds & borders used for soft surfaces.
    pairs.push([`bg-${family}-500/10`, `bg-${map.bgSoft}`])
    pairs.push([`bg-${family}-500/15`, `bg-${map.bgSoft}`])
    pairs.push([`bg-${family}-500/20`, `bg-${map.bgSoft}`])
    pairs.push([`bg-${family}-950/40`, `bg-${map.bgSoft}`])
    pairs.push([`bg-${family}-950/60`, `bg-${map.bgSoft}`])
    pairs.push([`bg-${family}-900/40`, `bg-${map.bgSoft}`])
    pairs.push([`border-${family}-500/30`, `border-${map.border}/30`])
    pairs.push([`border-${family}-500/20`, `border-${map.border}/20`])
    pairs.push([`border-${family}-500/40`, `border-${map.border}/40`])
    pairs.push([`border-${family}-500/50`, `border-${map.border}/50`])
    pairs.push([`divide-${family}-500/30`, `divide-${map.border}/30`])
    pairs.push([`ring-${family}-500/30`, `ring-${map.ring}/30`])
    pairs.push([`shadow-${family}-500/20`, `shadow-${map.ring}/20`])
    pairs.push([`shadow-${family}-500/30`, `shadow-${map.ring}/30`])
  }

  // 3. White / black overlays.
  for (const op of [95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5]) {
    pairs.push([`text-white/${op}`, op >= 90 ? 'text-ink' : op >= 60 || op >= 50 ? 'text-ink-2' : 'text-ink-3'])
    pairs.push([`bg-white/${op}`, 'bg-sunken'])
    pairs.push([`hover:bg-white/${op}`, 'hover:bg-sunken'])
    pairs.push([`border-white/${op}`, 'border-line'])
    pairs.push([`divide-white/${op}`, 'divide-line'])
    pairs.push([`ring-white/${op}`, 'ring-line'])
    pairs.push([`bg-black/${op}`, op >= 70 ? 'bg-ink/30' : 'bg-ink/20'])
    pairs.push([`shadow-black/${op}`, 'shadow-ink/10'])
  }
  pairs.push(['text-white', 'text-ink'])
  pairs.push(['bg-white', 'bg-surface'])
  pairs.push(['bg-black', 'bg-ink'])
  pairs.push(['ring-offset-zinc-950', 'ring-offset-canvas'])

  // 4. Longest source tokens first so nothing is partially consumed.
  pairs.sort((a, b) => b[0].length - a[0].length)
  return pairs
}

const REPLACEMENTS = buildReplacements()

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return walk(full)
    return ['.jsx', '.js'].includes(extname(full)) ? [full] : []
  })
}

const files = walk(ROOT)
let changed = 0
for (const file of files) {
  const before = readFileSync(file, 'utf8')
  let after = before
  for (const [from, to] of REPLACEMENTS) {
    if (after.includes(from)) after = after.split(from).join(to)
  }
  if (after !== before) {
    writeFileSync(file, after)
    changed += 1
    console.log(`updated ${file}`)
  }
}
console.log(`\n${changed} file(s) updated.`)
