const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");
const { convert } = require("html-to-text");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.email.split("@")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  // #initTransport() - experemental JS privat method syntax
  _initTransport() {
    if (process.env.NODE_ENV === "production") {
      // use SendGrid
      }
      
    // use MailTrap for tests
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async _send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, "..", "views", "emails", `${template}.pug`),
      {
        name: this.name,
        url: this.url,
        subject,
      }
    );
    const emailConfig = {
      from: this.from,
      to: this.to,
        subject,
      html,
      text: convert(html),
      };
    
      await this._initTransport().sendMail(emailConfig);
    }
    
    async sendHello() {
        await this._send('hello', 'Welcome mail!');
    }

    async sendRestorePassword() {
        await this._send('password', 'Password reset instruction')
    }
}

module.exports = Email;
