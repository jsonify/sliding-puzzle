interface MenuIconProps {
  className?: string;
}

export function ClassicMenuIcon({ className = "w-6 h-6" }: MenuIconProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function ColorMenuIcon({ className = "w-6 h-6" }: MenuIconProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="8" strokeWidth="3" />
      <line x1="12" y1="16" x2="12" y2="22" strokeWidth="3" transform="rotate(60 12 12)" />
      <line x1="12" y1="16" x2="12" y2="22" strokeWidth="3" transform="rotate(120 12 12)" />
      <line x1="12" y1="16" x2="12" y2="22" strokeWidth="3" transform="rotate(180 12 12)" />
      <line x1="12" y1="16" x2="12" y2="22" strokeWidth="3" transform="rotate(240 12 12)" />
      <line x1="12" y1="16" x2="12" y2="22" strokeWidth="3" transform="rotate(300 12 12)" />
    </svg>
  );
}