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
		table-button
		relative
		min-w-[140px] md:min-w-[160px]
	`;

	const variantStyles = {
		[BUTTON_VARIANT.DEAL]: "table-button--deal",
		[BUTTON_VARIANT.HIT]: "table-button--hit",
		[BUTTON_VARIANT.STAND]: "table-button--stand",
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
