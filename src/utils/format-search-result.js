export function formatSearchResult(saree) {
	return {
		id: saree.id,
		name: saree.name,
		origin: saree.origin,
		state: saree.state,
		fabric: saree.fabric,
		color: saree.color,
		occasion: saree.occasion,
		style: saree.style,
		price: saree.price,
		description: saree.description,
	};
}
