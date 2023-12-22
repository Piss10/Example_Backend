const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");
const { v4: uuid } = require("uuid");
const nodemailer = require("nodemailer");
const { findEmail } = require("./emailVerification");
const salt = 10;

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, encryptedPassword) => {
      if (!!err) {
        reject(err);
        return;
      }
      resolve(encryptedPassword);
    });
  });
}

function checkPassword(encryptedPassword, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
      if (!!err) {
        reject(err);
        return;
      }
      resolve(isPasswordCorrect);
    });
  });
}

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
}

// Generate OTP
function generateOTP() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

module.exports = {
  async sendOTPByEmail(email, otp) {
    try {
      // configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 465,
        // secure: true,
        service: "gmail",
        auth: {
          user: "backendproject010101@gmail.com",
          pass: "fzkeehrkmvvsaaao",
        },
      });

      // compose email message
      const mailOptions = {
        from: "backendproject010101@gmail.com",
        to: email,
        subject: "OTP Verification",
        html: ` 
        <div style: "justify-content: center;">
        <img src="https://i.ibb.co/vw7bv7j/Untitled-design-8-removebg-preview.png" style= "height: 150px;">
        </div>
        <center>
        <h1 style="text-align: center; font-family: Arial, sans-serif; background-color: #DEC9FF;">Verification Code</h1>
        <p style="font-size: 17px; text-align: left; font-family: Arial, sans-serif";">To verify your account, enter this code below:</p>
        <p style="font-size: 26px; font-weight: bold; text-align: center; font-family: Arial, sans-serif;">${otp}</p>
        </center>`,
      };

      // send email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
    }
  },

  async verifyUser(req, res) {
    try {
      const { otp } = req.body;
      if (!otp) {
        return res.status(400).json({
          status: "error",
          message: "OTP is required",
        });
      }

      const findUser = await user.findOne({
        where: {
          otp: otp,
        },
      });

      if (!findUser) {
        return res.status(404).json({
          status: "error",
          message: "Invalid OTP",
        });
      }

      // check if OTP has expired
      const currentDateTime = new Date();
      const otpExpiration = new Date(findUser.otpExpiration);

      if (currentDateTime > otpExpiration) {
        res.status(400).json({
          status: "error",
          message: "OTP has expired",
        });
      }

      findUser.verified = true;
      await findUser.save();

      res.status(200).json({
        status: "Success",
        message: "User verified successfully",
        data: findUser,
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },

  async register(req, res) {
    try {
      const password = await encryptPassword(req.body.password);
      const { name, email, phone } = req.body;

      // check email and password is not empty
      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Email and password is required",
        });
      }

      // validator email format using regex
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Email format is invalid",
        });
      }

      // check if email already exist
      const emailUser = await findEmail(email);
      if (emailUser) {
        return res.status(400).json({
          status: "Error",
          message: "Email already Exist",
          data: {},
        });
      }

      // Function to resend OTP every 60 seconds
      // const resendOTPEvery60Seconds = (email) => {
      //   setTimeout(async () => {
      //     // Check if the user is already verified
      //     const user = await findEmail(email);
      //     if (user && user.verified) {
      //       return;
      //     }

      //     const otp = generateOTP();
      //     module.exports.sendOTPByEmail(email, otp);

      //     // Update OTP and OTP expiration in the database
      //     await user.update({
      //       otp,
      //       otpExpiration: otpExpiration.toISOString(),
      //     });

      //     await user.save();
      //     resendOTPEvery60Seconds(email);
      //   }, 60000);
      // };

      // Generate otp
      const otp = generateOTP();
      const otpExpirationValidity = 5; // Menentukan validitas kedaluwarsa OTP dalam menit
      const otpExpiration = new Date();
      otpExpiration.setMinutes(
        otpExpiration.getMinutes() + otpExpirationValidity
      ); // Menambahkan waktu kedaluwarsa OTP dalam menit

      const userForm = await user.create({
        id: uuid(),
        name: name,
        password: password,
        email: email,
        phone: phone,
        otp,
        otpExpiration: otpExpiration.toISOString(), // Mengubah format tanggal dan waktu menjadi ISO 8601
        verified: false,
        image_profile:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      });

      // Send OTP to user's email
      module.exports.sendOTPByEmail(userForm.email, userForm.otp);

      // Mulai mengirim ulang OTP setiap 60 detik
      // resendOTPEvery60Seconds(userForm.email, userForm.otp);

      res.status(201).json({
        status: "Success",
        message: "Verification Link Sent, please check email!",
        data: userForm,
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const userLogin = await user.findOne({
        where: { email },
      });

      if (!userLogin) {
        return res.status(400).json({
          status: "error",
          message: "Email not found",
        });
      }

      const isPasswordCorrect = await checkPassword(
        userLogin.password,
        password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          status: "error",
          message: "Pasword salah!",
        });
      }

      const token = createToken({
        id: userLogin.id,
        email: userLogin.email,
        createdAt: userLogin.createdAt,
        updatedAt: userLogin.updatedAt,
      });
      res.status(201).json({
        status: "Success",
        token: token,
        name: userLogin.name,
        createdAt: userLogin.createdAt,
        updatedAt: userLogin.updatedAt,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Login Failed",
        error: error.message,
      });
    }
  },
  async whoAmI(req, res) {
    res.status(200).json(req.user);
  },
  async authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );
      req.user = await user.findByPk(tokenPayload.id);
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  },

  async updateUserWithToken(req, res) {
    try {
      // mendapatkan token dari URL
      const token = req.headers.authorization.split(" ")[1];

      // verifikasi token
      const decodedUser = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      // // fungsi untuk mencari user berdasarkan ID
      // const findUserById = async (id) => {
      //   return await user.findOne({
      //     where: { id: id },
      //   });
      // };

      // Mendapatkan data user berdasarkan ID yang terdekripsi dari token

      const userData = await user.findByPk(decodedUser.id);

      // Memeriksa apakah data user ditemukan
      if (!userData) {
        res.status(400).send({
          status: "Error",
          message: "Token not found",
        });
      }

      // melakukan update pada data user
      userData.name = req.body.name;
      userData.phone = req.body.phone;
      // userData.email = req.body.email;

      await userData.save();

      return res.status(200).json({
        status: "Success",
        message: "User update successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
};
