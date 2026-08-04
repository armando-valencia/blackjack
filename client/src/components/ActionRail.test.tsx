import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GAME_STATUS } from "../constants";
import ActionRail from "./ActionRail";

afterEach(() => cleanup());

const createActionRailProps = () => ({
	gameStatus: GAME_STATUS.WAITING,
	currentPlayerName: null,
	onDeal: vi.fn(),
	onHit: vi.fn(),
	onStand: vi.fn(),
	isHumanTurn: false,
	isActionPending: false,
});

describe("ActionRail", () => {
	it("offers a new hand while waiting", () => {
		const props = createActionRailProps();

		render(<ActionRail {...props} />);
		fireEvent.click(screen.getByRole("button", { name: "Deal New Hand" }));

		expect(props.onDeal).toHaveBeenCalledOnce();
	});

	it("offers hit and stand during the human turn", () => {
		const props = {
			...createActionRailProps(),
			gameStatus: GAME_STATUS.PLAYING,
			isHumanTurn: true,
		};

		render(<ActionRail {...props} />);
		fireEvent.click(screen.getByRole("button", { name: "Hit" }));
		fireEvent.click(screen.getByRole("button", { name: "Stand" }));

		expect(props.onHit).toHaveBeenCalledOnce();
		expect(props.onStand).toHaveBeenCalledOnce();
	});

	it("explains when another player is taking their turn", () => {
		const props = {
			...createActionRailProps(),
			gameStatus: GAME_STATUS.PLAYING,
			currentPlayerName: "Ivy",
		};

		render(<ActionRail {...props} />);

		expect(screen.getAllByText("Waiting for Ivy to act.")).toHaveLength(2);
	});
});
