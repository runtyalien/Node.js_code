const Sib = require("sib-api-v3-sdk");

require("dotenv").config();

async function forgotpass(req, res) {
  const client = Sib.ApiClient.instance;

  const apiKey = client.authentications["api-key"];
  apiKey.apiKey =
    "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";

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "omgadkar@gmail.com",
  };

  const receivers = [
    {
      email: "akankshaabhi17@gmail.com",
    },
  ];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "You forgot your password",
      textContent: `You forgot your password.`,
    })
    .then(console.log)
    .catch(console.log);
}

module.exports ={ 
    forgotpass
}
