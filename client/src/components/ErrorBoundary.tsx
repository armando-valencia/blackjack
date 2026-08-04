import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("The game interface failed to render.", error, errorInfo);
	}

	private handleReload = () => {
		window.location.reload();
	};

	render() {
		if (!this.state.hasError) return this.props.children;

		return (
			<div className="flex min-h-dvh items-center justify-center bg-table-page-start px-4 py-6">
				<section role="alert" aria-labelledby="game-error-title" className="w-full max-w-md rounded-xl border-2 border-table-border bg-table-surface p-6 text-center shadow-xl sm:p-8">
					<p className="text-table-active text-xs font-semibold uppercase tracking-[0.2em]">Table unavailable</p>
					<h1 id="game-error-title" className="mt-2 font-serif text-3xl font-semibold text-table-text">
						Something went wrong
					</h1>
					<p className="mt-3 text-sm text-table-muted">
						The game could not finish loading. Reload the table to try again.
					</p>
					<button
						type="button"
						onClick={this.handleReload}
						className="mt-6 min-h-11 rounded-md bg-table-active px-5 py-2.5 font-semibold text-table-page-start transition-colors hover:bg-[#f6d676]"
					>
						Reload Table
					</button>
				</section>
			</div>
		);
	}
}

export default ErrorBoundary;
