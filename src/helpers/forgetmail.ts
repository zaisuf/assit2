
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
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser
            <br>
            ${emailType === "VERIFY" ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}` : `${process.env.DOMAIN}/passwordreset?token=${hashedToken}`}
            </p>`
        }

        const mailResponse = await resend.emails.send(mailOptions)
        return mailResponse

    } catch (error: any) {
        throw new Error(error.message)      
    }
}

//in this user easily can forgot his password create seperate maler