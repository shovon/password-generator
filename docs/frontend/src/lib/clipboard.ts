export function select(element: HTMLInputElement | HTMLTextAreaElement) {
	// Select the text field
	element.select();
	element.setSelectionRange(0, 99999); // For mobile devices

	// Copy the text inside the text field
	navigator.clipboard.writeText(element.value);
}
