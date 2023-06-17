const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())
app.get('/', (req, res) => {
    res.json("I'm from server")
})
app.post("/payment", cors(), async (req, res) => {
    let { total } = req.body;
   
    
    try {
        const payment = await stripe.paymentIntents.create({
            amount: total*100,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({
            clientSecret: payment.client_secret,
            message: "Payment successful",
            success: true
        })
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})

app.listen(process.env.PORT || 4000, () => {
    console.log(`Sever is listening on port ${process.env.PORT}`)
})
