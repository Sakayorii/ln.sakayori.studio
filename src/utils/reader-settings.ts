export interface ReaderSettings {
  bg: 'hako' | 'cream' | 'gray' | 'dark';
  font: 'serif' | 'sans';
  size: number;
  lh: number;
  width: number;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  bg: 'hako',
  font: 'serif',
  size: 18,
  lh: 1.8,
  width: 750,
};

export const BG_PRESETS: Record<ReaderSettings['bg'], { bg: string; fg: string; name: string }> = {
  hako: { bg: '#f4ecd8', fg: '#3d3428', name: 'Vàng giấy Hako' },
  cream: { bg: '#faf7ef', fg: '#2c2c2c', name: 'Kem sáng' },
  gray: { bg: '#d8d8d8', fg: '#333333', name: 'Xám dịu' },
  dark: { bg: '#18181b', fg: '#d4d4d8', name: 'Đêm' },
};

const SETTINGS_KEY = 'ln-reader-settings';
const RESUME_KEY = 'ln-resume-progress';

export function getSettings(): ReaderSettings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      bg: BG_PRESETS[parsed.bg as ReaderSettings['bg']] ? parsed.bg : DEFAULT_SETTINGS.bg,
      font: parsed.font === 'sans' ? 'sans' : 'serif',
      size: typeof parsed.size === 'number' ? Math.min(24, Math.max(15, parsed.size)) : DEFAULT_SETTINGS.size,
      lh: typeof parsed.lh === 'number' ? parsed.lh : DEFAULT_SETTINGS.lh,
      width: typeof parsed.width === 'number' ? parsed.width : DEFAULT_SETTINGS.width,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Partial<ReaderSettings>): ReaderSettings {
  const cur = getSettings();
  const next: ReaderSettings = { ...cur, ...s };
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {}
  }
  applySettings(next);
  return next;
}

export function applySettings(s: ReaderSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const preset = BG_PRESETS[s.bg] || BG_PRESETS.hako;
  root.style.setProperty('--read-bg', preset.bg);
  root.style.setProperty('--read-fg', preset.fg);
  root.style.setProperty(
    '--read-font',
    s.font === 'sans'
      ? "'Be Vietnam Pro', system-ui, -apple-system, sans-serif"
      : "'Noto Serif', Georgia, serif"
  );
  root.style.setProperty('--read-size', `${s.size}px`);
  root.style.setProperty('--read-lh', `${s.lh}`);
  root.style.setProperty('--read-width', `${s.width}px`);
}

export interface ResumeData {
  novel: string;
  novelTitle: string;
  arc: number;
  chapter: number;
  chapterTitle: string;
  url: string;
  scrollY: number;
  time: number;
}

export function saveResume(data: Omit<ResumeData, 'time'>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify({ ...data, time: Date.now() }));
  } catch {}
}

export function loadResume(): ResumeData | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function showToast(message: string): void {
  if (typeof document === 'undefined') return;
  let toast = document.getElementById('ln-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ln-toast';
    toast.className = 'ln-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout((toast as any)._timer);
  (toast as any)._timer = setTimeout(() => {
    toast?.classList.remove('show');
  }, 2800);
}
