// controllers/contactController.js
import mailSender from '../../Config/mailSender.js'; 

const sendContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    const mailBody = `
      <h2>Customer Inquiry Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

    const result = await mailSender("oaassesment@gmail.com", `Contact: ${subject}`, mailBody);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while sending email.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send message.',
    });
  }
};

export default sendContactForm;