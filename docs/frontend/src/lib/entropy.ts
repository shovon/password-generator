/**
 *
 * @param str The string for which to calculate the shannon entropy
 * @returns A number representing the total entropy
 */
function entropy(str: string) {
	const len = str.length;

	const frequencies = new Map<string, number>();
	for (const c of str.split("")) {
		frequencies.set(c, (frequencies.get(c) ?? 0) + 1);
	}

	// Sum the frequency of each character.
	return [...frequencies].reduce(
		(sum, [_, f]) => sum - (f / len) * Math.log2(f / len),
		0
	);
}
