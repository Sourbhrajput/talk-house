const { log } = require('console');
const crypto = require('crypto');
require('dotenv').config();
const twilio = require('twilio');
const nodemailer = require('nodemailer');
require("dotenv").config();

class Services {

    generateOtp() {
        return crypto.randomInt(1000, 9999);
    }

    hashOtp({ data, otp, time }) {
        const dataString = `${otp}.${data}.${time}`;
        return crypto.createHmac('sha256', process.env.HASH_SECRET_KEY).update(dataString).digest('hex');
    }

    checkOtp({ data, otp, time, hashOtp }) {

        return this.hashOtp({ data, otp, time }) == hashOtp;

    }

    getMessage(otp) {
        return `This is auto generated message from Talk House. Your otp is ${otp}`
    }

    async sendOtp({ otp, data, check }) {
        try {

            if (check == "phone") {
                const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTO_TOKEN);
                return await client.messages.create({
                    body: this.getMessage(otp),
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: "+91" + data
                });
            }
            else {
                const transporter = nodemailer.createTransport({
                    service: gmail,
                    auth: {
                        pass: process.env.GMAILPASS,
                        user: process.env.GMAILID
                    }
                })

                const options = {
                    from:process.env.GMAILID,
                    to:data,
                    subject: "Talk house otp",
                    html: `<h3>Talk house otp :${otp}</h3>
                      `,
                }

                return await transporter.sendMail(options);
            }


        }

        catch (err) {
            if (err) {
                console.log("Error during Otp sending:"+err);
            }
        }
    }
}

module.exports = new Services();