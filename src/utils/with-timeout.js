export function withTimeout(promise, ms, error) {
	let timeoutId;

	const timeoutPromise = new Promise((_, reject) => {
		timeoutId = setTimeout(() => {
			reject(error);
		}, ms);
	});

	return Promise.race([
		promise.finally(() => clearTimeout(timeoutId)),
		timeoutPromise,
	]);
}
