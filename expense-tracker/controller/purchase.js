const Razorpay = require("razorpay");
const Order = require("../models/order");
const USERS = require("../models/user");

async function buymembership(req, res) {
  try {
    var rzp = new Razorpay({
      key_id: 'rzp_test_NgSvjK0wZJZoOU',
      key_secret: 'OjmOCbvC4W6frLQk5wbj1gWn',
    });
    const amount = 25000;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong " });
      } else {
        await Order.create({ 
          orderid: order.id,
          status: "PENDING",
          paymentid:order.amount_paid,
          userId:req.user._id,
         });
        res.status(201).json({ order, key_id: rzp.key_id });
      }
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong " });
  }
}
async function updatetransaction(req, res) {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ orderid: order_id });
    await order.updateOne(
      { payment_id: payment_id, status: "Successfull" }
    );
    await USERS.findOneAndUpdate({_id:req.user._id},{ isPremiumUser: true });
    res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    console.log(err)

    res.status(500).json({ message: "Something went wrong " });
  }
}
module.exports = { buymembership, updatetransaction };