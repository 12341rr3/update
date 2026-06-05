const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// ✅ Proper CORS Configuration
const allowedOrigins = [
  "https://navisthaa.com",
  "https://www.navisthaa.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors());

app.use(express.json());

// ✅ Test route (important for checking server)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ Email Route
app.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("Incoming Data:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      bcc: "shreyash.jadhav@mldc.edu.in",
      replyTo: email,
      subject: "New Inquiry Received",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent ✅" });

  } catch (error) {
    console.error("EMAIL ERROR:", error); // 🔥 check this in Render logs
    res.status(500).json({ success: false, message: "Failed to send email ❌" });
  }
});

// ✅ PORT (Render uses dynamic port)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
