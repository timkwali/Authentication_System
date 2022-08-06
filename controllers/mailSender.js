require('dotenv').config()
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const port = process.env.PORT
const emailService = process.env.EMAIL_SERVICE

const sendMail = (from, to) => {
    let transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            pass: process.env.PASS,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENTSECRET,
            refreshToken: process.env.OAUTH_REFRESHTOKEN
        }
    })
    
    //2. Create MailOptions object
    let mailOptions = {
        from: from,
        to: to,
        subject: 'Authentication System',
        text: 'Please use this link to reset your password'
    }

    //3. Use Transporter.sendMail
    transporter.sendMail(mailOptions, (err, data) => {
        if(err) {
            console.log(`Error ${err}`)
        } else {
            console.log("Email sent successfully")
        }
    })
}

module.exports = sendMail