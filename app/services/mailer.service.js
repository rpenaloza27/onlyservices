const config = require("../../config/mail.config");
const nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: config.HOST,
    port: config.port,
    secure: true, // true for 465, false for other ports
    auth: {
        user: config.USER, // generated ethereal user
        pass: config.PASSWORD, // generated ethereal password
    },
});
exports.verified = async () => {
    transporter.verify().then(()=>{
        console.log("Ready to send message")
    });
    
}

exports.sendEmail=async (sendInformation)=>{
  const {from,to,subject, text, html} = sendInformation
    // send mail with defined transport object
  let info = await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
  return info;
}



