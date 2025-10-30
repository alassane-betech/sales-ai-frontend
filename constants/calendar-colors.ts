/**
 * Configuration des couleurs pour la page calendrier d'événement
 * Ce fichier centralise toutes les couleurs utilisées dans la page calendrier
 * pour faciliter la maintenance et les modifications futures
 */

export const calendarColors = {
  // Couleurs principales
  primary: {
    background: "#18181B",
    backgroundSecondary: "#202023",
    accent: "#007953",
    accentLight: "#00a86b",
  },

  // Couleurs de texte
  text: {
    primary: "#FFFFFF",
    secondary: "#9D9DA8",
    muted: "#6B7280",
  },

  // Couleurs d'arrière-plan avec transparence
  background: {
    main: "bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023]",
    card: "bg-[#202023]/50",
    cardHover: "bg-[#202023]/80",
    calendarContainer: "bg-[#18181B]/50",
    infoSection: "bg-[#18181B]/50",
  },

  // Couleurs de bordure
  border: {
    primary: "border-[#007953]/20",
    accent: "border-[#007953]/30",
    divider: "border-[#007953]/20",
  },

  // Couleurs d'effet
  effects: {
    shadow: "shadow-2xl",
    ring: "ring-4 ring-[#007953]/20",
    blur: "backdrop-blur-sm",
    gradient: {
      avatar: "bg-gradient-to-br from-[#007953] to-[#00a86b]",
      text: "bg-gradient-to-r from-white to-[#9D9DA8] bg-clip-text text-transparent",
      textDesktop:
        "bg-gradient-to-r from-white via-[#9D9DA8] to-white bg-clip-text text-transparent",
    },
  },

  // Couleurs de décoration d'arrière-plan
  decoration: {
    primary: "bg-[#007953]/5",
    secondary: "bg-[#007953]/10",
    blur: {
      large: "blur-3xl",
      medium: "blur-2xl",
    },
  },

  // Classes Tailwind prédéfinies pour le calendrier
  calendar: {
    root: "w-full",
    months: "w-full",
    month: "w-full",
    nav: "text-white mb-4 md:mb-6",
    button: {
      previous:
        "text-white hover:bg-[#007953] hover:text-white rounded-lg transition-all duration-200 h-8 w-8",
      next: "text-white hover:bg-[#007953] hover:text-white rounded-lg transition-all duration-200 h-8 w-8",
      size: "w-8 h-8",
    },
    caption: "text-white font-bold text-lg md:text-xl",
    weekday: "text-[#9D9DA8] text-sm font-medium",
    week: "mb-2 md:mb-3",
    day: "text-white hover:bg-[#007953] hover:text-white rounded-lg transition-all duration-200 font-medium h-8 w-8 flex items-center justify-center",
    today: "bg-[#007953] text-white font-bold ring-2 ring-[#007953]/50",
    selected: "bg-[#007953] text-white font-bold shadow-lg",
    outside: "text-[#9D9DA8] opacity-30",
  },

  // Classes pour les sections d'information
  info: {
    container: "rounded-2xl p-6 md:p-12",
    avatar: {
      mobile: "w-14 h-14",
      desktop: "w-20 h-20",
    },
    title: {
      mobile: "text-3xl font-bold",
      desktop: "text-5xl font-bold",
    },
    subtitle: {
      mobile: "text-lg font-semibold",
      desktop: "text-2xl font-bold",
    },
    duration: {
      mobile: "text-lg font-medium",
      desktop: "text-xl font-medium",
    },
    description: {
      mobile: "text-base leading-relaxed",
      desktop: "text-xl leading-relaxed max-w-lg",
    },
  },

  // Classes pour les cartes
  card: {
    base: "rounded-2xl p-6 border shadow-2xl backdrop-blur-sm",
    mobile: "bg-[#202023]/50",
    desktop: "bg-[#202023]/90",
    calendar:
      "bg-[#18181B]/50 rounded-2xl p-6 border border-[#007953]/20 shadow-2xl",
  },
} as const;

// Types pour TypeScript
export type CalendarColors = typeof calendarColors;
export type BackgroundKey = keyof typeof calendarColors.background;
export type TextKey = keyof typeof calendarColors.text;
export type EffectKey = keyof typeof calendarColors.effects;
