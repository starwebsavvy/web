document.addEventListener("DOMContentLoaded", async () => {
	const { publishableKey } = await fetch("http://localhost:3000/config").then(
		(r) => r.json()
	);
	const stripe = Stripe(publishableKey);
	let elements, paymentElement;
	let amount = 9900;
	let clientSecretID = "";
	let isPaymentElementComplete = false;

	// Function to create payment intent
	async function createPaymentIntent(amount) {
		const response = await fetch(
			"http://localhost:3000/create-payment-intent",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ amount: amount }),
			}
		);

		const { clientSecret } = await response.json();
		clientSecretID = clientSecret;

		const appearance = { theme: "stripe" };
		elements = stripe.elements({ appearance, clientSecret });
		const paymentElementOptions = { layout: "tabs" };
		paymentElement = elements.create("payment", paymentElementOptions);
		paymentElement.mount("#payment-element");
	}

	// Create initial payment intent on page load with a default amount
	await createPaymentIntent(amount); // Default amount in cents (e.g., $10.00)

	// Add an event listener to the Payment Element to track changes
	paymentElement.on("change", function (event) {
		if (event.complete) {
			// Payment element validation was successful
			isPaymentElementComplete = true;
			console.log("Payment element validation successful");
		} else if (event.error) {
			// Payment element validation failed
			isPaymentElementComplete = false;
			console.log(
				"Payment element validation error:",
				event.error.message
			);
		} else {
			// Payment element is not complete but no validation errors
			isPaymentElementComplete = false;
			console.log("Payment element not complete");
		}
	});
	// Handle form submission
	const form = document.getElementById("payment-form");
	form.addEventListener("submit", async (event) => {
		event.preventDefault(); // Prevent the default form submission.

		if (isPaymentElementComplete) {
			const senderFullname = $("#sender_fullname").val().split(" ");
			const userInfo = {
				senderFirst: senderFullname[0],
				senderLast: senderFullname[1],
				senderEmail: $("#sender_email").val(),
				receiverFirst: $("#receiver_first").val(),
				receiverLast: $("#receiver_last").val(),
				receiverEmail: $("#receiver_email").val(),
				booksOrdered: $("#sel1").val(),
				date: $("#date").val(),
				newsletterCheckmark: $("#newsletter").is(":checked"),
				from: $("#from").val(),
				message: $("#message").val(),
			};
			localStorage.setItem("userInfo", JSON.stringify(userInfo));
			// Show the loader
			const loader = document.getElementById("loader");
			loader.classList.add("active");

			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/story/return.html`,
				},
			});
		} else {
			console.log("Payment details are incomplete");
		}
	});

	/* Function except for Stripe Element */

	// Setting default price
	$("input#total_price").val(99);
	$(document).on("click", ".gift button", function () {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!$("#receiver_first").val()) {
			$.toast({
				heading: "Storyworth",
				text: "Sorry, Please enter recipient's first name.",
				icon: "error",
				position: "top-right",
				hideAfter: 3000,
				class: "toast-font",
			});
			return;
		}
		if (!$("#receiver_last").val()) {
			$.toast({
				heading: "Storyworth",
				text: "Sorry, Please enter recipient's last name.",
				icon: "error",
				position: "top-right",
				hideAfter: 3000,
				class: "toast-font",
			});
			return;
		}

		if (!$("#receiver_email").val()) {
			$.toast({
				heading: "Storyworth",
				text: "Sorry, Please enter recipient's email.",
				icon: "error",
				position: "top-right",
				hideAfter: 3000,
				class: "toast-font",
			});
			return;
		} else {
			if (!regex.test($("#receiver_email").val())) {
				$.toast({
					heading: "Log in to Storyworth",
					text: "Sorry, Invalid email address.",
					icon: "error",
					position: "top-right",
					hideAfter: 3000,
				});
				return;
			}
		}

		if (!$("#date").val()) {
			$.toast({
				heading: "Storyworth",
				text: "Sorry, Please select date.",
				icon: "error",
				position: "top-right",
				hideAfter: 3000,
				class: "toast-font",
			});
			return;
		}
		if (!$("#from").val()) {
			$.toast({
				heading: "Storyworth",
				text: "Sorry, Please fill from field.",
				icon: "error",
				position: "top-right",
				hideAfter: 3000,
				class: "toast-font",
			});
			return;
		}
		if (!$("#message").val()) {
			$.toast({
				heading: "Storyworth",
				text: "Sorry, Please enter message.",
				icon: "error",
				position: "top-right",
				hideAfter: 3000,
				class: "toast-font",
			});
			return;
		}
		$(".purchase").show();
		$(".gift").hide();
	});

	$(document).on("change", "#sel1", function () {
		// Get the selected option.
		var selOption = $(this).find("option:selected");
		var selNumber = selOption.val();
		var totalPrice = 99 + 30 * (selNumber - 1);
		$("#total_price").val(totalPrice);
		$("#payment-form button").text(`PURCHASE FOR \$${totalPrice}`);
		$(".purchase .sub-total").text(`Total: \$${totalPrice}`);

		// Call Stripe.
		createPaymentIntent(totalPrice * 100);
	});
});
