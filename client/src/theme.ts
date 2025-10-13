// Sophisticated, mature theme for professional Blackjack UI

export const colors = {
	// Refined dark backgrounds
	bgPrimary: "from-[#0a0e17] via-[#121621] to-[#0a0e17]",
	bgSecondary: "from-slate-900/40 via-slate-800/40 to-slate-900/40",

	// Elegant glass surfaces
	glassSurface: "bg-slate-900/60 backdrop-blur-2xl border border-slate-700/30",
	glassHover: "bg-slate-800/70 border-slate-600/40",

	// Realistic card styling
	cardBg: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
	cardHidden: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
	cardShadow: "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]",

	// Professional button styling
	btnDeal: "bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600",
	btnHit: "bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600",
	btnStand: "bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600",

	// Subtle status colors
	success: "text-emerald-500",
	error: "text-red-500",
	warning: "text-amber-500",
	info: "text-blue-400",

	// Realistic suit colors
	redSuit: "#DC2626",
	blackSuit: "#1F2937",
};

export const animations = {
	cardDeal: "animate-[slideIn_0.3s_ease-out]",
	cardFlip: "animate-[flipIn_0.4s_ease-out]",
	buttonPress: "active:scale-95 transition-transform duration-150",
	float: "animate-[float_4s_ease-in-out_infinite]",
};

export const spacing = {
	cardGap: "gap-2 md:gap-4",
	containerPadding: "p-4 md:p-6 lg:p-8",
	buttonHeight: "h-12 md:h-14",
};
