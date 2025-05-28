export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, pdfData, calculationData } = req.body;

    if (!email || !pdfData) {
      return res.status(400).json({ message: 'Email and PDF data are required' });
    }

    // Use Resend for email sending (you'll need to add this to package.json)
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #F97115; padding: 30px; text-align: center;">
          <img src="https://i.imgur.com/5rZ46ei.png" alt="Scratchie Logo" style="width: 50%; max-width: 300px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank you for using the Scratchie ROI Calculator!</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <p style="font-size: 16px; line-height: 1.6; color: #4A5568;">Hi there,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4A5568;">Thank you for taking the time to explore how Scratchie can benefit your organization. Your personalized ROI summary is attached to this email.</p>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #F97115; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #F97115; margin-top: 0; font-size: 18px;">📊 Your ROI Summary Highlights:</h3>
            <ul style="color: #4A5568; font-size: 15px; line-height: 1.8;">
              <li><strong>Total Investment:</strong> ${calculationData?.totalImplementationCost || 'N/A'}</li>
              <li><strong>Total Benefits:</strong> ${calculationData?.totalBenefits || 'N/A'}</li>
              <li><strong>ROI:</strong> ${calculationData?.roi || 'N/A'}%</li>
              <li><strong>Payback Period:</strong> ${calculationData?.paybackPeriod || 'N/A'} months</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4A5568;">We'd love to discuss these results with you and explore how we can tailor Scratchie to your specific needs.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="mailto:james@scratchie.com?subject=ROI Calculator Follow-up" 
               style="background-color: #F97115; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              📅 Schedule a Discussion
            </a>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4A5568;">
              Best regards,<br>
              <strong style="color: #F97115;">James Kell</strong><br>
              <span style="color: #718096;">Scratchie Team</span><br>
              📧 <a href="mailto:james@scratchie.com" style="color: #F97115;">james@scratchie.com</a><br>
              📱 0410 133 600
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #718096; text-align: center; line-height: 1.4;">
            This email was sent because you used our ROI Calculator. If you have any questions, please don't hesitate to reach out.
          </p>
        </div>
      </div>
    `;

    // Convert base64 PDF data to buffer
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    const { data, error } = await resend.emails.send({
      from: 'Scratchie ROI Calculator <noreply@scratchie.com>',
      to: [email],
      cc: ['garry@scratchie.com'],
      subject: 'Your Scratchie ROI Business Case Summary',
      html: emailContent,
      attachments: [
        {
          filename: `Scratchie_ROI_Summary_${calculationData?.country || 'Report'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('Email sending error:', error);
      return res.status(500).json({ message: 'Failed to send email', error: error.message });
    }

    return res.status(200).json({ message: 'Email sent successfully', emailId: data.id });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 