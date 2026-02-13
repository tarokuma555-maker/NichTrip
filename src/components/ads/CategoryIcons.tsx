export function IconHotel({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 21h18M3 7v14M21 7v14M6 7V4a1 1 0 011-1h10a1 1 0 011 1v3M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </svg>
  );
}

export function IconTour({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4V7z" />
      <path d="M9 3v14M15 7v14" />
    </svg>
  );
}

export function IconRentalCar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  );
}

export function IconTransport({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16M4 7h16" />
      <circle cx="7.5" cy="15.5" r="1.5" /><circle cx="16.5" cy="15.5" r="1.5" />
    </svg>
  );
}

export function IconActivity({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function IconMixed({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 2L4 7v4l8-3 8 3V7l-8-5zM4 11l8 3 8-3M4 11v4l8 5 8-5v-4" />
    </svg>
  );
}

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  switch (category) {
    case "hotel": return <IconHotel className={className} />;
    case "tour": return <IconTour className={className} />;
    case "rental_car": return <IconRentalCar className={className} />;
    case "transport": return <IconTransport className={className} />;
    case "activity": return <IconActivity className={className} />;
    default: return <IconMixed className={className} />;
  }
}

export const CATEGORY_COLORS: Record<string, string> = {
  hotel: "text-red-400 border-red-500/30 hover:bg-red-500/10",
  tour: "text-orange-400 border-orange-500/30 hover:bg-orange-500/10",
  rental_car: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10",
  transport: "text-purple-400 border-purple-500/30 hover:bg-purple-500/10",
  activity: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10",
  mixed: "text-red-400 border-red-500/30 hover:bg-red-500/10",
};
