import { razorpay } from "../Configs/razorpay.js";
import Billing from "../Models/billing.model.js";
import crypto from "crypto";
import User from "../Models/user.model.js";


export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.userId;

        if (plan !== "pro") {
            return res.status(400).json({
                success: false,
                message: "Invalid plan",
            });
        }

        // Set plan amount
        const amount = 699;

        // Creating order from instance of Razorpay
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        })

        // Save billing record
        await Billing.create({
            userId,
            amount,
            plan,
            orderId: order.id,
        })

        // Send order details to frontend
        return res.json({
            success: true,
            order
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Order creation failed"
        })
    }
}


// Verify Billing Controller
export const verifyBilling = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature } = req.body;

        // Get authenticated user ID
        const userId = req.userId;

        // Generate expected payment signature
        const sign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        // Check payment signature
        if (sign !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            })
        }

        // Mark billing as paid
        await Billing.findOneAndUpdate({ orderId: razorpay_order_id, userId }, {
            paymentId: razorpay_payment_id,
            status: "paid"
        })

        // Upgrade user to Pro plan
        const user = await User.findByIdAndUpdate(userId, {
            plan: "pro",
            proExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        }, { new: true })

        // Send updated user data
        return res.json({
            success: true,
            user,
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        })
    }
}