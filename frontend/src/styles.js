// Shared Tailwind class strings so every page keeps the same dark,
// violet-accented look without repeating long class lists everywhere.

export const page = "min-h-screen bg-[#0a0a0f] text-white font-sans px-6 py-8";

export const card =
  "bg-[#13131a] border border-[#1e1e2a] rounded-2xl p-6 shadow-2xl shadow-black/60";

export const inputClass =
  "w-full bg-[#0d0d14] text-white text-sm px-4 py-3 rounded-xl outline-none placeholder-[#35353f] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] focus:shadow-[0_0_0_1.5px_rgba(139,92,246,0.7)] transition-all duration-200";

export const label =
  "block text-[#9191a1] text-xs font-medium mb-2 tracking-wide uppercase";

export const buttonPrimary =
  "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] shadow-lg shadow-violet-900/40";

export const buttonDanger =
  "px-4 py-2 rounded-lg text-xs font-semibold transition-colors bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20";

export const buttonGhost =
  "px-4 py-2 rounded-lg text-xs font-semibold transition-colors bg-white/5 border border-white/10 text-[#c8c8d4] hover:bg-white/10";

export const errorBox =
  "bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg";

export const successBox =
  "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg";

export const badge = (color) =>
  `inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-500/10 text-${color}-400 border border-${color}-500/30`;

export const table = "w-full text-sm text-left border-collapse";
export const th =
  "text-[#6b6b7a] text-xs uppercase tracking-wide font-medium pb-3 pr-4 border-b border-[#1e1e2a]";
export const td = "py-3 pr-4 border-b border-[#1e1e2a]/60 text-[#d4d4dc]";
