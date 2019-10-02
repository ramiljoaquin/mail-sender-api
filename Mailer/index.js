'use strict';

const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function Mailer(mail) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_HOST = process.env.SMTP_HOST;

    const SMTP_USERNAME = process.env.SMTP_USERNAME;
    const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: SMTP_USERNAME, // smtp auth username
            pass: SMTP_PASSWORD // smtp auth password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    const USER_ADMIN_NAME = process.env.USER_ADMIN_NAME;
    const USER_ADMIN_EMAIL = process.env.USER_ADMIN_EMAIL;

    const RECEIVER_EMAILS = 'admin@digitalcreation.io, jared.f.church@gmail.com, ramiljoaquin@gmail.com, rodtsan.dev3@gmail.com';
    const SUBJECT = 'Digital Creation - Contact Us';

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"${USER_ADMIN_NAME}" <${USER_ADMIN_EMAIL}>`, // sender address
        to: RECEIVER_EMAILS, // list of receivers
        subject: SUBJECT, // Subject line
        // text: 'Hello world?', // plain text body
        html: mail.html // html body
    });
    

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
