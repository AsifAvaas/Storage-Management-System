const nodemailer = require('nodemailer')

user = process.env.MAILER
password = process.env.MAIL_PASSWORD


const sendMail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: user,
                pass: 'tlluehuamhqxrmnv',
            }
        })
        await transporter.sendMail({
            from: 'asif13.aak@gmail.com',
            to: email,
            subject: subject,
            text: text

        })
    } catch (error) {
        console.log("Could not send Messege")
        console.log(error)

    }
}

module.exports = sendMail