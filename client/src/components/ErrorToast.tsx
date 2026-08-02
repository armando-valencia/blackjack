import React from "react";

interface ErrorToastProps {
	message: string | null;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
	if (!message) return null;

	return (
		<div role="alert" aria-live="assertive" className="pointer-events-none absolute left-1/2 top-16 z-50 max-h-[30vh] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-y-auto animate-[slideIn_0.3s_ease-out] sm:top-20">
			<div className="rounded-md border border-table-loss/70 bg-table-surface px-4 py-3 shadow-lg sm:px-6">
				<p className="break-words text-sm text-table-loss md:text-base">
					{message}
				</p>
			</div>
		</div>
	);
};

export default ErrorToast;
