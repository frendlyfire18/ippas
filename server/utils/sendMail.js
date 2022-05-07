"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// async..await is not allowed in global scope, must use a wrapper
function sendMail(sendinfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let testAccount = yield nodemailer_1.default.createTestAccount();
        console.log(testAccount);
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: 'nrafopmnyl5oyj57@ethereal.email',
                pass: 'PuS1ZYn983guYsTf94', // generated ethereal password
            },
        });
        // send mail with defined transport object
        let info = yield transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: sendinfo.to,
            subject: "Link for change password",
            html: sendinfo.text, // html body
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
    });
}
exports.sendMail = sendMail;
