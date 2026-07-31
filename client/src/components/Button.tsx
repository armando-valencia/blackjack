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

const BUTTON_BASE_CLASSES = `
	px-5 py-2.5 md:px-7 md:py-3
	rounded-md
	font-semibold text-sm md:text-base
	text-table-text
	border border-table-border/40
	transition-colors duration-200
	relative
	min-h-11 w-full sm:w-auto touch-manipulation select-none
	min-w-[124px] md:min-w-[140px]
	disabled:opacity-50 disabled:cursor-not-allowed
`;
const BUTTON_VARIANT_CLASSES = {
	[BUTTON_VARIANT.DEAL]: "bg-table-active text-table-page-start hover:bg-[#f6d676]",
	[BUTTON_VARIANT.HIT]: "bg-table-active-bot text-table-page-start hover:bg-[#cde5d7]",
	[BUTTON_VARIANT.STAND]: "bg-table-surface-raised text-table-text hover:bg-table-surface",
};

const Button: React.FC<ButtonProps> = ({
	onClick,
	children,
	variant = BUTTON_VARIANT.DEAL,
	className = "",
	disabled = false,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			aria-busy={disabled}
			className={`${BUTTON_BASE_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
		>
			<div aria-hidden="true" className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
			<span className="relative z-10">{children}</span>
		</button>
	);
};

export default Button;
