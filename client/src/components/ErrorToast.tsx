import React from "react";

interface ErrorToastProps {
	message: string | null;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
	if (!message) return null;

	return (
		<div className="absolute top-20 left-1/2 w-[calc(100vw-2rem)] max-w-xl transform -translate-x-1/2 z-50 animate-[slideIn_0.3s_ease-out]">
			<div className="px-4 sm:px-6 py-3 glass border-red-400/50 rounded-xl shadow-[0_8px_32px_0_rgba(239,68,68,0.4)]">
				<p className="text-red-400 text-sm md:text-base break-words">
					{message}
				</p>
			</div>
		</div>
	);
};

export default ErrorToast;
