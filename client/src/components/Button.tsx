import React from "react";

interface ButtonProps {
	onClick: () => void;
	children: React.ReactNode;
	variant?: "deal" | "hit" | "stand";
	className?: string;
}

const Button: React.FC<ButtonProps> = ({
	onClick,
	children,
	variant = "deal",
	className = "",
}) => {
	const baseStyles = `
		px-8 py-3 md:px-10 md:py-4
		rounded-lg
		font-semibold text-base md:text-lg
		text-white
		shadow-[0_4px_14px_0_rgba(0,0,0,0.4)]
		border border-black/20
		transform active:scale-95
		transition-all duration-200
		hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.5)]
		hover:-translate-y-0.5
		relative
		min-w-[140px] md:min-w-[160px]
	`;

	const variantStyles = {
		deal: "bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600",
		hit: "bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600",
		stand: "bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600",
	};

	return (
		<button onClick={onClick} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
			<div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
			<span className="relative z-10">{children}</span>
		</button>
	);
};

export default Button;
