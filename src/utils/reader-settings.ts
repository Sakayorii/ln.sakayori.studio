/* reader-settings.ts — single source of truth for the reading experience.
   Every component reads through here; nobody touches the DOM directly. */

export interface ReaderSettings {
  bg: 'hako' | 'cream' | 'gray' | 'dark';
  font: 'serif' | 'sans';
  size: number;   // px, 15..24
  lh: number;     // 1.5 | 1.8 | 2.1
  width: number;  // 650 | 750 | 900
}

export const PRESETS: Record<ReaderSettings['bg'], { bg: string; fg: string; label: string }> = {
  hako:  { bg: '#f4ecd8', fg: '#3d3428', label: 'Vàng giấy' },
  cream: { bg: '#faf7ef', fg: '#2c2c2c', label: 'Kem sáng' },
  gray:  { bg: '#d8d8d8', fg: '#333333', label: 'Xám dịu' },
  dark:  { bg: '#18181b', fg: '#d4d4d8', label: 'Đêm' },
};

export const DEFAULTS: ReaderSettings = { bg: 'hako', font: 'serif', size: 18, lh: 1.8, width: 750 };
const KEY = 'ln-reader-settings';

function sanitize(raw: unknown): ReaderSettings {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<ReaderSettings>;
  return {
    bg: r.bg && r.bg in PRESETS ? r.bg : DEFAULTS.bg,
    font: r.font === 'sans' ? 'sans' : 'serif',
    size: typeof r.size === 'number' ? Math.min(24, Math.max(15, Math.round(r.size))) : DEFAULTS.size,
    lh: [1.5, 1.8, 2.1].includes(r.lh as number) ? (r.lh as number) : DEFAULTS.lh,
    width: [650, 750, 900].includes(r.width as number) ? (r.width as number) : DEFAULTS.width,
  };
}

export function loadSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(KEY);
    return sanitize(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(s: ReaderSettings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ }
}

export function applySettings(s: ReaderSettings): void {
  const root = document.documentElement;
  const p = PRESETS[s.bg];
  root.style.setProperty('--read-bg', p.bg);
  root.style.setProperty('--read-fg', p.fg);
  root.style.setProperty('--read-font', s.font === 'sans'
    ? "'Be Vietnam Pro','Noto Sans',system-ui,sans-serif"
    : "'Noto Serif',Georgia,serif");
  root.style.setProperty('--read-size', `${s.size}px`);
  root.style.setProperty('--read-lh', String(s.lh));
  root.style.setProperty('--read-width', `${s.width}px`);
}

/** Resume-reading helpers (homepage "Đọc tiếp" card). */
export interface ResumeState { novel: string; novelTitle: string; arc: number; chapter: number; chapterTitle: string; url: string; scrollY: number }
const RKEY = 'ln-resume-reading';
export function saveResume(r: ResumeState): void {
  try { localStorage.setItem(RKEY, JSON.stringify(r)); } catch { /* ignore */ }
}
export function loadResume(): ResumeState | null {
  try {
    const raw = localStorage.getItem(RKEY);
    return raw ? (JSON.parse(raw) as ResumeState) : null;
  } catch { return null; }
}

export function showToast(msg: string): void {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  window.clearTimeout((el as unknown as { _t?: number })._t);
  (el as unknown as { _t?: number })._t = window.setTimeout(() => el!.classList.remove('show'), 2200);
}
