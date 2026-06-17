const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// ✅ CORS (keep simple)
app.use(cors({
  origin: [
    "https://navisthaa.com",
    "https://www.navisthaa.com"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// ✅ Email Route
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("Incoming Data:", req.body);

    // ✅ Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // ✅ Send email to YOU (company inbox)
    const response1 = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: ["shreyrj2205@gmail.com"],
  subject: "New Inquiry Received",
  html: `<h3>New Contact Form Submission</h3>
  <p><b>Name:</b> ${name}</p>
  <p><b>Email:</b> ${email}</p>
  <p><b>Phone:</b> ${phone || "N/A"}</p>
  <p><b>Message:</b> ${message}</p>`
});

console.log("Admin Mail:", response1);

const response2 = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: [email],
  subject: "We received your inquiry",
  html: `<h3>New Contact Form Submission</h3>
  <p><b>Name:</b> ${name}</p>
  <p><b>Email:</b> ${email}</p>
  <p><b>Phone:</b> ${phone || "N/A"}</p>
  <p><b>Message:</b> ${message}</p>`
});

console.log("User Mail:", response2);    return res.status(200).json({
      success: true,
      message: "Email sent successfully ✅"
    });

  } catch (error) {
    console.error("RESEND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email ❌",
      error: error.message
    });
  }
});

// ✅ PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
