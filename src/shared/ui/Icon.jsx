import React from 'react';
export default function Icon({
  name,
  ...props
}) {
  const drawings = {
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7m4 0v-7m0 3c0-4 6-4 6 0v4" /><circle cx="7" cy="7" r=".8" fill="currentColor" stroke="none" /></>,
    arrow: <><path d="M4 12h15m-6-6 6 6-6 6" /></>,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    back: <path d="M20 12H5m6-6-6 6 6 6" />,
    help: <><circle cx="12" cy="12" r="9" fill="var(--peach)" /><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3v.1" /></>,
    settings: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="var(--peach)" /><circle cx="16" cy="12" r="2" fill="var(--peach)" /><circle cx="10" cy="18" r="2" fill="var(--peach)" /></>,
    qubit: <><circle cx="12" cy="12" r="8" fill="var(--peach)" /><ellipse cx="12" cy="12" rx="4" ry="9" transform="rotate(40 12 12)" /><circle cx="12" cy="12" r="2" fill="currentColor" /></>,
    measure: <><path d="M4 18a9 9 0 1 1 16 0Z" fill="var(--peach)" /><path d="m12 14 5-6M6 11l1 1m10 0 1-1M12 6v2" /><circle cx="12" cy="14" r="1.5" fill="currentColor" /></>,
    gate: <><rect x="4" y="3" width="16" height="18" rx="4" fill="var(--peach)" /><path d="M8 7v10m8-10v10m-8-5h8" /></>,
    cnot: <><path d="M3 6h18M3 18h18M12 6v12" /><circle cx="12" cy="6" r="3" fill="currentColor" /><circle cx="12" cy="18" r="4" fill="var(--peach)" /><path d="M12 15v6m-3-3h6" /></>,
    bell: <><ellipse cx="9" cy="12" rx="5" ry="8" transform="rotate(35 9 12)" fill="var(--peach)" /><ellipse cx="15" cy="12" rx="5" ry="8" transform="rotate(35 15 12)" /><path d="m9 14 6-4" /></>
  };
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        {drawings[name] || (name === 'check' ? <path d="m5 12 4 4L19 6" /> : name === 'flag' ? <><path d="M5 22V3m0 1c5-5 9 5 15 0v11c-6 5-10-5-15 0" /><path d="M10 3v5l5 1v6M5 9l5-1v6m5-5 5-1" /></> : <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />)}
    </svg>;
}
