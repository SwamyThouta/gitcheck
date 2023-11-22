const nodemailer = require("nodemailer");
const ejs = require("ejs");
const myemail = "your email";
async function sendMail(emailDetails) {
  
    let mailTransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: myemail,
            pass: 'your password'
        },
        tls: {
            rejectUnauthorized: false,
        },
    });   
    const data = await ejs.renderFile(__dirname + "/email-template.ejs", emailDetails);
    let mailDetails = {
        from: myemail,
        to: emailDetails.email,
        subject: emailDetails.subject,
        html: data
    };
    mailTransporter.sendMail(mailDetails, function (err, info) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Mail sent: ' + info.response);
        }
    });
}
module.exports = { sendMail }
