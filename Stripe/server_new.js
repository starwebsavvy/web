const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripe_secret_key);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/config", (req, res) => {
	res.send({
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
	});
});

// Payment initialize.
app.post("/create-payment-intent", async (req, res) => {
	const { amount } = req.body;

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: "usd",
			automatic_payment_methods: {
				enabled: true,
			},
		});

		res.send({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

app.listen(3000, () => console.log("Server running on port 3000"));
