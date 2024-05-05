import "server-only";

import { render } from "@react-email/render";
import { env } from "@/env";

import { createTransport, type TransportOptions } from "nodemailer";
import type { ComponentProps } from "react";
import { EmailVerificationTemplate } from "./templates/email-verification";
import { ResetPasswordTemplate } from "./templates/reset-password";

export enum EmailTemplate {
  EmailVerification = "EmailVerification",
  PasswordReset = "PasswordReset",
}

const EMAIL_SENDER = ""
export type PropsMap = {
  [EmailTemplate.EmailVerification]: ComponentProps<typeof EmailVerificationTemplate>;
  [EmailTemplate.PasswordReset]: ComponentProps<typeof ResetPasswordTemplate>;
};

const getEmailTemplate = <T extends EmailTemplate>(template: T, props: PropsMap[NoInfer<T>]) => {
  switch (template) {
    case EmailTemplate.EmailVerification:
      return {
        subject: "Verify your email address",
        body: render(
          <EmailVerificationTemplate {...(props as PropsMap[EmailTemplate.EmailVerification])} />,
        ),
      };
    case EmailTemplate.PasswordReset:
      return {
        subject: "Reset your password",
        body: render(
          <ResetPasswordTemplate {...(props as PropsMap[EmailTemplate.PasswordReset])} />,
        ),
      };
    default:
      throw new Error("Invalid email template");
  }
};

const smtpConfig = {
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASS,
  },
};

const transporter = createTransport(smtpConfig as TransportOptions);

export const sendMail = async <T extends EmailTemplate>(
  to: string,
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  if (env.NODE_ENV !== "production") {
    console.log("📨 Email sent to:", to, "with template:", template, "and props:", props);
    return;
  }

  const { subject, body } = getEmailTemplate(template, props);

  return transporter.sendMail({ from: EMAIL_SENDER, to, subject, html: body });
};