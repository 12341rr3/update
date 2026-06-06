const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  "https://navisthaa.com",
  "https://www.navisthaa.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // 👈 debug
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ Email Route
app.post("/send-email", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const { name, email, phone, message } = req.body;

    // ✅ Validate input (VERY IMPORTANT)
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // ✅ Check ENV variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("ENV VARIABLES MISSING");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    // ✅ Transporter
   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000, // 10 sec
  greetingTimeout: 10000
});

    // ✅ Verify transporter (helps debug)
    await transporter.verify();

    // ✅ Mail Options
    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      bcc: "shreyash.jadhav@mldc.edu.in",
      replyTo: email,
      subject: "New Inquiry Received",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    // ✅ Send Email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent:", info.response); // 👈 debug success

    res.status(200).json({
      success: true,
      message: "Email sent successfully ✅"
    });

  } catch (error) {
    console.error("FULL ERROR:", error); // 👈 THIS will tell exact issue

    res.status(500).json({
      success: false,
      message: "Failed to send email ❌",
      error: error.message // 👈 helps debugging frontend too
    });
  }
});

// ✅ PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
