import nodemailer from "nodemailer";

const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

export const sendEmail = async ({ to, subject, html }) => {
  await getTransporter().sendMail({
    from: `Government Benefit Recommender <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
