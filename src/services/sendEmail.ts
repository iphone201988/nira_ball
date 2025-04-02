import nodemailer from "nodemailer";
// Create a transporter object
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    pool: true, // Enable connection pooling for better performance
    maxConnections: 5, // Limit number of simultaneous connections
    maxMessages: 100, // Maximum number of messages per connection
  });

// Define email templates
const emailTemplates = {
    registerOtpSendEmail: {
        subject: "Verify Your Registration with OTP - Nira ball",
        text: `Welcome to Your Service Name! Your one-time password (OTP) for registration is {{OTP}}. Please enter it to complete your signup. This OTP expires in 10 minutes. If you didn’t request this, you can safely ignore this email. For support, contact us at techwin363@gmail.com. © 2025 Nira ball , 123 main road, new york, usa .`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">Welcome to Your Service Name!</h2>
                <p>Thank you for registering with us. To complete your registration, please use the OTP below:</p>
                <h3 style="color: #4CAF50; font-size: 24px; text-align: center;">{{OTP}}</h3>
                <p style="font-size: 14px;">This OTP expires in 10 minutes.</p>
                <p>If you didn’t initiate this request, you can safely ignore this email.</p>
                <hr style="border: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777;">
                    Need help? Contact us at <a href="mailto:techwin363@gmail.com">techwin363@gmail.com</a>.<br />
                    © 2025 Nira ball , 123 main road, new york, usa .<br />.
                </p>
            </div>
        `,
    },
    resendRegistrationOtp: {
        subject: "Resent Registration OTP - Nira ball",
        text: `Hi! We’ve resent your OTP for Your Service Name registration: {{OTP}}. Please use it to complete your signup. This OTP expires in 10 minutes. If you didn’t request this, ignore this email. For support, contact techwin363@gmail.com. © 2025 Nira ball , 123 main road, new york, usa .`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FFA500;">OTP Resent</h2>
                <p>We received a request to resend your registration OTP for Your Service Name. Here it is:</p>
                <h3 style="color: #FFA500; font-size: 24px; text-align: center;">{{OTP}}</h3>
                <p style="font-size: 14px;">This OTP expires in 10 minutes.</p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="border: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777;">
                    Need help? Contact us at <a href="mailto:techwin363@gmail.com">techwin363@gmail.com</a>.<br />
                    © 2025 Nira ball , 123 main road, new york, usa .<br />.
                </p>
            </div>
        `,
    },
    ForgetSendEmail: {
        subject: "Reset Your Password OTP - Nira ball",
        text: `Your OTP to reset your Your Service Name password is {{OTP}}. Use it to proceed with your reset. This OTP expires in 10 minutes. If you didn’t request this, ignore this email. For support, contact techwin363@gmail.com. © 2025 Nira ball , 123 main road, new york, usa .`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #E91E63;">Password Reset Request</h2>
                <p>We received a password reset request for your Your Service Name account. Use the OTP below:</p>
                <h3 style="color: #E91E63; font-size: 24px; text-align: center;">{{OTP}}</h3>
                <p style="font-size: 14px;">This OTP expires in 10 minutes.</p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="border: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777;">
                    Need help? Contact us at <a href="mailto:techwin363@gmail.com">techwin363@gmail.com</a>.<br />
                    © 2025 Nira ball , 123 main road, new york, usa .<br />.
                </p>
            </div>
        `,
    },
    forgotReSendEmail: {
        subject: "Resent Password Reset OTP - Nira ball",
        text: `We’ve resent your OTP for resetting your Your Service Name password: {{OTP}}. Use it to proceed. This OTP expires in 10 minutes. If you didn’t request this, ignore this email. For support, contact techwin363@gmail.com. © 2025 Nira ball , 123 main road, new york, usa .`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF5722;">Resent Password Reset OTP</h2>
                <p>We received a request to resend your password reset OTP for Your Service Name. Here it is:</p>
                <h3 style="color: #FF5722; font-size: 24px; text-align: center;">{{OTP}}</h3>
                <p style="font-size: 14px;">This OTP expires in 10 minutes.</p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="border: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777;">
                    Need help? Contact us at <a href="mailto:techwin363@gmail.com">techwin363@gmail.com</a>.<br />
                    © 2025 Nira ball , 123 main road, new york, usa .<br />.                  
                </p>
            </div>
        `,
    },
    changeEmail: {
        subject: "Verify Your Email Change OTP - Nira ball",
        text: `Your OTP to change your email address for Your Service Name is {{OTP}}. Use it to confirm the change. This OTP expires in 10 minutes. If you didn’t request this, ignore this email. For support, contact techwin363@gmail.com. © 2025 Nira ball , 123 main road, new york, usa .`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF5722;">Change Email OTP</h2>
                <p>We received a request to change the email address linked to your Your Service Name account. Use the OTP below to confirm:</p>
                <h3 style="color: #FF5722; font-size: 24px; text-align: center;">{{OTP}}</h3>
                <p style="font-size: 14px;">This OTP expires in 10 minutes.</p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="border: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777;">
                    Need help? Contact us at <a href="mailto:techwin363@gmail.com">techwin363@gmail.com</a>.<br />
                    © 2025 Nira ball , 123 main road, new york, usa .<br />
                   
                </p>
            </div>
        `,
    },
};

// Generate email body based on type
function generateEmailBody(type: number, otp: string) {
    let template:any;
    switch (type) {
        case 1:
            template = emailTemplates.registerOtpSendEmail;
            break;
        case 2:
            template = emailTemplates.resendRegistrationOtp;
            break;
        case 3:
            template = emailTemplates.ForgetSendEmail;
            break;
        case 4:
            template = emailTemplates.forgotReSendEmail;
            break;
        case 5:
            template = emailTemplates.changeEmail;
            break;
        default:
            throw new Error("Invalid email type");
    }

    // Replace {{OTP}} placeholder with the actual OTP
    const textWithOtp = template.text.replace("{{OTP}}", otp);
    const htmlWithOtp = template.html.replace("{{OTP}}", otp);
    return { subject: template.subject, text: textWithOtp, html: htmlWithOtp };
}

// Send an email
export async function sendEmail(to: string, type: number, otp: string) {
    try {
        const { subject, text, html } = generateEmailBody(type, otp);

        await transport.sendMail({
            from: `"Nira ball" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
            html,
            headers: {
                "X-Entity-Ref-ID": `otp-${Date.now()}`, 
            },
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
        throw error; 
    } 
}
export const sendFeedback = async (
    userEmail: string,
    name: string,
    subject: string,
    feedback: string
): Promise<void> => {
    const text = `Hi Nira ball,\n\nWe have received new feedback from ${name}.\n\nFeedback:\n${feedback}\n\nThanks,`;
    
    const html = `
        <div style="margin: 30px; padding: 30px; border: 1px solid black; border-radius: 20px 10px; font-family: Arial, sans-serif;">
            <h3 style="color: #333;"><strong>Hi Nira ball,</strong></h3>
            <h4 style="color: #555;"><strong>We have received new feedback from:</strong></h4>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Feedback:</strong></p>
            <p style="margin-left: 20px; padding: 10px; border-left: 3px solid #ccc; background-color: #f9f9f9;">${feedback}</p>
            <p>Thanks,</p>
        </div>
    `;
    try {
        await transport.sendMail({
            from: `"Loockbox" <${process.env.SMTP_EMAIL}>`,
            to: "help@Nira ball.ca",
            subject,
            text,
            html,
            headers: {
                "X-Entity-Ref-ID": `otp-${Date.now()}`, 
            },
        });
        console.log('Feedback email sent successfully');
    } catch (error) {
        console.error('Failed to send feedback email', error);
    }
}
