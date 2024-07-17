document.addEventListener("DOMContentLoaded", async () => {
	const { publishableKey } = await fetch("http://localhost:3000/config").then(
		(r) => r.json()
	);
	const stripe = Stripe(publishableKey);

	const url = new URL(window.location);
	const clientSecret = url.searchParams.get("payment_intent_client_secret");

	const { error, paymentIntent } = await stripe.retrievePaymentIntent(
		clientSecret
	);

	const storedUserInfo = localStorage.getItem("userInfo");
	const userInfo = JSON.parse(storedUserInfo);
	userInfo["stripeID"] = paymentIntent.id;

	fetch("https://x8ki-letl-twmt.n7.xano.io/api:U3VA1EPF/Signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userInfo),
	})
		.then((response) => response.json())
		.then((data) => {
			const authToken = data.func1.authToken;
			const bookID = data.upcomingQuestion.bookID;
			const upquiz = data.upcomingQuestion.id;
			const sendDate = data.upcomingQuestion.created_at;
			const userID = data.upcomingQuestion.userID;
			const receiverEmail = data.receiverEmail;

			localStorage.setItem("upquiz", upquiz);
			localStorage.setItem("sendDate", sendDate);
			localStorage.setItem("userID", userID);
			localStorage.setItem("authToken", authToken);
			localStorage.setItem("bookID", bookID);
			localStorage.setItem("receiverEmail", receiverEmail);

			fetch(
				"https://x8ki-letl-twmt.n7.xano.io/api:U3VA1EPF/auth/me_books",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${authToken}`,
						"Content-Type": "application/json",
					},
				}
			)
				.then((response) => response.json())
				.then((data) => {
					const senderName = data.result1.firstName;
					const receiverName = data.Books1[0].receiverName;
					localStorage.setItem("sender", senderName);
					localStorage.setItem("receiver", receiverName);

					window.location.replace("guide.html");
				});
		});
});
