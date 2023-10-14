
const Sib = require("sib-api-v3-sdk");
const Forgot = require("../model/forgotpasswordrequests");
const User = require("../model/user");
const sequelize = require("../utils/database");
const bcrypt = require("bcrypt");
const uuid = require('uuid');


async function resetpass (req, res) {
  const t = await sequelize.transaction();
  const { email } = req.body;

  try {

    const users = await User.findOne({ where: { email }});
    if (!users) {
      return res.status(400).json({ message: "email not found" });
    }
    console.log(users);
    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications['api-key']
    apiKey.apiKey = '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';

  const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "omgadkar@gmail.com",
    };

    const recievers = [
      {
        email: users.email,
      },
    ];

    const userId = uuid.v4(); 
    console.log(userId);

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: recievers,
        subject: "Forget Password",
        textContent: "We have requested to reset your password from expense tracker click on the below link to reset http://localhost:3000/password/resetpassword/" +
        userId,
      })
      .then(console.log)
      .catch(console.log);

      const done = await Forgot.create({
        id: userId,
        isactive: true,
        UserId: users.id,
      });

      if (done) {
        res.status(200).json({ message: "Mail has been sent successfully!" });
      } else {
        res.status(404).json({ message: "Email not found" });
      }
  } catch (err) {
    console.error("Error in forgot password route:", err);
    res.status(400).json({ message: "an error occurred!", error_msg: err.message });
  }
}

async function updatepassword(req, res) {
  try {
    const { id } = req.params;
    const { newpassword } = req.query;
    console.log('ID:', id);
    console.log('New Password:', newpassword);

    // Find the user in the Forgot table by id
    const forgotUser = await Forgot.findOne({ where: { id } });

    if (!forgotUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get the UserId from the Forgot table
    const userId = forgotUser.UserId;

    // Find the user in the User table by UserId
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in User table' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    console.log(hashedPassword);

    // Update the password in the User table
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    res.status(200).json({ success: true, message: 'Successfully updated the password' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
}




module.exports = {
  resetpass,
  updatepassword,
}