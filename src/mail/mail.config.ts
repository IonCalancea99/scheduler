import { registerAs } from "@nestjs/config";

export default registerAs("mail", () => ({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: (process.env.MAIL_PORT && parseInt(process.env.MAIL_PORT, 10)) || 587,
  secure: process.env.MAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  from: {
    email: process.env.MAIL_FROM || "noreply@example.com",
    name: process.env.MAIL_FROM_NAME || "App Name",
  },
}));
