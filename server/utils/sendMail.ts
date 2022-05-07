import nodemailer from "nodemailer";
interface sendMailInterface{
    to:string;
    text:string;
}
// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(sendinfo:sendMailInterface) {
    let testAccount = await nodemailer.createTestAccount();
    console.log(testAccount);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'nrafopmnyl5oyj57@ethereal.email', // generated ethereal user
            pass: 'PuS1ZYn983guYsTf94', // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: sendinfo.to, // list of receivers
        subject: "Link for change password", // Subject line
        html: sendinfo.text, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
