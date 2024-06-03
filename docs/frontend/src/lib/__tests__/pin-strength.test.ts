import { calculateStrength } from "../pin-strength";

describe("Entropy checker", () => {
	it('should classify weak PINs as weak, good as "good" and "strong" as strong', () => {
		expect(calculateStrength("1111")).toEqual("WEAK");
		expect(calculateStrength("8068")).toEqual("GOOD");
		expect(calculateStrength("11111")).toEqual("GOOD");
	});
});
