const FABRICS = ["Pure Silk", "Silk Cotton", "Fine Cotton", "Cotton", "Silk"];

const STATES = [
	"Andhra Pradesh",
	"Telangana",
	"Tamil Nadu",
	"Karnataka",
	"Maharashtra",
	"Madhya Pradesh",
	"Uttar Pradesh",
];

export function extractConstraints(query) {
	const normalizedQuery = query.toLowerCase();

	const constraints = {};

	const fabric = FABRICS.find((value) =>
		normalizedQuery.includes(value.toLowerCase()),
	);

	if (fabric) {
		constraints.fabric = fabric;
	}

	const state = STATES.find((value) =>
		normalizedQuery.includes(value.toLowerCase()),
	);

	if (state) {
		constraints.state = state;
	}

	return constraints;
}
