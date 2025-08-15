import { Resend } from 'resend'
import User from '@/models/userModel'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({email, emailType, userId} :any) => {
    try {
        const hashedToken = userId.toString()

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        }else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        const mailOptions = {
            from: 'support@Assistlore.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .header {
                            background-color: #2563eb;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 0 0 8px 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 32px;
                            background-color: #2563eb;
                            color: #ffffff !important;
                            text-decoration: none;
                            border-radius: 8px;
                            margin: 25px 0;
                            font-weight: 600;
                            font-size: 16px;
                            text-align: center;
                            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
                            transition: all 0.3s ease;
                            border: 2px solid #2563eb;
                        }
                        .button:hover {
                            background-color: #1d4ed8;
                            box-shadow: 0 6px 8px rgba(37, 99, 235, 0.4);
                            transform: translateY(-1px);
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h2>Assistlore.com</h2>
                        </div>
                        <div class="content">
                            <h3>Hello!</h3>
                            <p>You recently requested to ${emailType === "VERIFY" ? "verify your email address" : "reset your password"} for your Assistlore.com account.</p>
                            <p>Please click the button below to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}:</p>
                            <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "passwordreset"}?token=${hashedToken}" class="button">
                                ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
                            </a>
                            <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                            <p style="word-break: break-all; color: #666; font-size: 14px;">
                                ${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "passwordreset"}?token=${hashedToken}
                            </p>
                            <p>If you didn't request this, you can safely ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Assistlore.com. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        }

        const mailResponse = await resend.emails.send(mailOptions)
        return mailResponse

    } catch (error: any) {
        throw new Error(error.message)      
    }
}

