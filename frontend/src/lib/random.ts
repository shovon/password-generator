export function getRandomInt(min: number, max: number) {
	const crypto = window.crypto;
	const array = new Uint32Array(1);
	crypto.getRandomValues(array);

	// Convert the random value to the desired range
	const range = max - min + 1;
	return min + (array[0] % range);
}
