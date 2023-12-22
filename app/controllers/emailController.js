const nodemailer = require("nodemailer");

module.exports = {
  async sendTransactionDataByEmail(email, htmlData) {
    // Konfigurasi transporter Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "backendproject010101@gmail.com",
        pass: "fzkeehrkmvvsaaao",
      },
    });

    // Buat opsi email
    const mailOptions = {
      from: "backendproject010101@gmail.com",
      to: email,
      subject: "Transaction Data",
      html: htmlData,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);
  },
};
