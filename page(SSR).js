async function getData() {
	// const res = await fetch("https://api.example.com/...");
	const res = [
		{ id: 1, name: "Nest" },
		{ id: 2, name: "Express" },
	];

	return res;
}

export default async function Page() {
	const data = await getData();

	return (
		<main>
			{data.map((item, index) => (
				<h1>{item.name}</h1>
			))}
		</main>
	);
}
