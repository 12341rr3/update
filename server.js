const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express(); // ✅ MISSING LINE FIXED

const corsOptions = {
  origin: ["https://www.navisthaa.com", "https://navisthaa.com"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// ✅ EMAIL ROUTE
app.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("User Data:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "shreyrj2205@gmail.com",
        pass: "gfhe opkm shiq sitk"
      }
    });

    const mailOptions = {
      from: "shreyrj2205@gmail.com", // ✅ better to keep same sender
      to: "shreyrj2205@gmail.com",
      bcc: "shreyash.jadhav@mldc.edu.in",
      replyTo: email,
      subject: "New Inquiry Received",
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Contact:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully ✅" });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Failed to send email ❌" });
  }
});

// ✅ PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
