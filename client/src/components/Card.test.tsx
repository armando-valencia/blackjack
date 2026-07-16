import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CARD_SUITS, HIDDEN_CARD } from "../constants";
import Card from "./Card";

afterEach(() => cleanup());

const ACE_OF_HEARTS = `A${CARD_SUITS.HEARTS}`;

describe("Card", () => {
	it("announces a visible card with its rank and suit", () => {
		render(<Card card={ACE_OF_HEARTS} />);

		expect(screen.getByRole("img", { name: "A of hearts" })).toBeTruthy();
	});

	it("identifies a dealer hole card as hidden", () => {
		render(<Card card={HIDDEN_CARD} isDealerHoleCard />);

		expect(screen.getByRole("img", { name: "Dealer hole card hidden" })).toBeTruthy();
	});
});
