// const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_AUTH_EMAIL,
        pass: process.env.GMAIL_PASS,
    },
});

export const sendPasswordResetEmail = async ({
    emailTo,
    resetURL,
}: {
    emailTo: string;
    resetURL: string;
}) => {
    const mailOptions = {
        from: process.env.GMAIL_AUTH_EMAIL,
        to: emailTo,
        subject: 'Password reset email.',
        html: `
        <div style="text-align: center;">
            <h1>Follow this link to reset your password</h1>
            <a href="${resetURL}" target='_blank'>Reset password</a>
            <strong>Your password reset token is valid for 10 minutes!</strong>
        </div>

        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
