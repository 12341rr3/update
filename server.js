const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: [
    "https://www.navisthaa.com",
    "https://navisthaa.com"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.options("*", cors());

// ✅ EMAIL ROUTE
app.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("User Data:", req.body); // Debug

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "shreyrj2205@gmail.com",     // your company Gmail
        pass: "gfhe opkm shiq sitk"           // app password
      },
       tls: {
    rejectUnauthorized: false   // ✅ FIX
  }
    });

    const mailOptions = {
      from: "ravi032519@gmail.com",
      to: 
        "shreyrj2205@gmail.com",
      bcc: "shreyash.jadhav@mldc.edu.in",
            // company mail (where you receive)
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
