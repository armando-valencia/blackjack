import React from "react";
import { BUTTON_VARIANT } from "../constants";
import type { ButtonVariant } from "../interfaces/game_interfaces";

interface ButtonProps {
	onClick: () => void;
	children: React.ReactNode;
	variant?: ButtonVariant;
	className?: string;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	onClick,
	children,
	variant = BUTTON_VARIANT.DEAL,
	className = "",
	disabled = false,
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
		disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
	`;

	const variantStyles = {
		[BUTTON_VARIANT.DEAL]: "bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600",
		[BUTTON_VARIANT.HIT]: "bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600",
		[BUTTON_VARIANT.STAND]: "bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600",
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			aria-busy={disabled}
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
		>
			<div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
			<span className="relative z-10">{children}</span>
		</button>
	);
};

export default Button;
