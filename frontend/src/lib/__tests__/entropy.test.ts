import { entropy } from "../entropy";

describe("Entropy checker", () => {
	it("should give a good entropy guess", () => {
		expect(Math.round(entropy("sweet"))).toEqual(2);
	});
});
