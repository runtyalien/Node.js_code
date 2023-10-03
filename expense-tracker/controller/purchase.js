const Razorpay = require("razorpay");
const Order = require("../model/orders");
const User = require("../model/user");

async function buymembership(req, res){
    try {
      var rzp = new Razorpay({
        key_id: 'rzp_test_NgSvjK0wZJZoOU',
        key_secret: 'OjmOCbvC4W6frLQk5wbj1gWn',
      });
      const amount = 25000;
      console.log('User ID:', req.userId);
      
      rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
        if (err) {
          res.status(500).json({ message: "Something went wrong " });
        } else {
          await Order.create({ 
            orderid: order.id,
            status: "PENDING",
            paymentid: order.amount_paid,
            userId: req.userId,
          });
          res.status(201).json({ order, key_id: rzp.key_id });
        }
        console.log(order.status);
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Something went wrong " });
    }
  }

  async function updatetransaction(req, res){
    try {
      const { payment_id, order_id } = req.body;
      
      // Assuming you have a Sequelize User model
      const userId = req.userId;  // Assuming userId is extracted by your middleware

      if (!userId) {
        return res.status(400).json({ error: 'User ID is missing' });
      }

      // Update the user's premium status
      await User.update({ isPremiumUser: true }, { where: { id: userId } });

      const order = await Order.findOne({ orderid: order_id });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update the order status
      await order.update({ payment_id: payment_id, status: "Successful" });

      res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    }
}


module.exports = { buymembership, updatetransaction };