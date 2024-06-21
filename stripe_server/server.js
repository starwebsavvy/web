const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

const stripe = require('stripe')(stripe_secret_key);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/charge', async (req, res) => {
	
	const token = req.body.stripeToken;
	const price = req.body.price;
	const zip = req.body.zip;
	const country = req.body.country;

	const charge = await stripe.charges.create({
		amount: price * 100, // Amount in cents
		currency: 'usd',
		description: 'Storyworth',
		source: token,
		shipping: {
			name: 'Buyer',
			address: {
				country: country,
				postal_code: zip
			}
		}
	});
	console.log('Payment:', charge);
	res.json({status: 'success'});
});

app.listen(3000, () => console.log('Server running on port 3000'));
