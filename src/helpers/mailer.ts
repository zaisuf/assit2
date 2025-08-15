import { Resend } from 'resend'
import User from '@/models/userModel'

const resend = new Resend(process.env.RESEND_API_KEY)

const createEmailTemplate = (content: string) => `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body { margin: 0; padding: 0; background-color: #f6f9fc; }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                }
                .header {
                    background: linear-gradient(135deg, #4f46e5, #6366f1);
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                    text-align: center;
                }
                .header img {
                    width: 150px;
                    height: auto;
                }
                .content {
                    padding: 30px;
                    color: #374151;
                    line-height: 1.6;
                }
                .otp-box {
                    background-color: #f3f4f6;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 20px 0;
                    font-size: 24px;
                    letter-spacing: 2px;
                    color: #4f46e5;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #4f46e5;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #6b7280;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="color: white; margin: 0;">Assistlore</h1>
                </div>
                <div class="content">
                    ${content}
                </div>
                <div class="footer">
                    © ${new Date().getFullYear()} Assistlore.com. All rights reserved.
                </div>
            </div>
        </body>
    </html>
`;

export const sendEmail = async ({ email, emailType, userId, otp }: any) => {
    try {
        const userIdStr = userId ? userId.toString() : "";

        const otpContent = `
            <h2 style="color: #1f2937; margin-bottom: 20px;">Verification Code</h2>
            <p>Here's your verification code:</p>
            <div class="otp-box">${otp}</div>
            <p>This code will expire in 5 minutes.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        `;

        const verificationContent = `
            <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email</h2>
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            <a href="${process.env.DOMAIN}/verifyemail?token=${userIdStr}" class="button">Verify Email</a>
            <p style="color: #6b7280; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
        `;

        const mailOptions = {
            from: 'support@Assistlore.co',
            to: email,
            subject: emailType === "OTP" ? "Your Verification Code" : "Verify Your Email",
            html: createEmailTemplate(emailType === "OTP" ? otpContent : verificationContent)
        }

        const mailResponse = await resend.emails.send(mailOptions);
        return mailResponse;

    } catch (error: any) {
        console.error("Error sending email:", error.message);
        throw new Error(error.message);
    }
}
