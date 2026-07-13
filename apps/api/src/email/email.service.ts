import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.transporter
      .sendMail({
        from: process.env.EMAIL_FROM || 'noreply@mantis.com',
        to,
        subject: 'Welcome to MANTIS — Stop guessing, start talking.',
        html: `
          <div style="background:#09090b;color:#fafafa;font-family:Inter,sans-serif;padding:40px;max-width:600px;margin:0 auto;border-radius:12px;">
            <h1 style="background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Welcome to MANTIS, ${name}!</h1>
            <p style="color:#a1a1aa;line-height:1.7;">Your journey to better mentorship starts now. Connect with vetted industry veterans and get the 1-on-1 guidance you need.</p>
            <a href="${process.env.FRONTEND_URL}/en/dashboard" style="background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-top:20px;">Go to Dashboard →</a>
          </div>
        `,
      })
      .catch((err) => this.logger.error('Failed to send welcome email', err));
  }

  async sendSessionConfirmation(to: string, expertName: string, sessionTime: string) {
    await this.transporter
      .sendMail({
        from: process.env.EMAIL_FROM || 'noreply@mantis.com',
        to,
        subject: `Session Confirmed with ${expertName} — MANTIS`,
        html: `
          <div style="background:#09090b;color:#fafafa;font-family:Inter,sans-serif;padding:40px;max-width:600px;margin:0 auto;border-radius:12px;">
            <h1 style="color:#6366f1;">Session Confirmed! ✓</h1>
            <p style="color:#a1a1aa;">Your session with <strong style="color:#fafafa;">${expertName}</strong> is scheduled for <strong style="color:#fafafa;">${sessionTime}</strong>.</p>
            <p style="color:#71717a;font-size:14px;">Payment is securely held in escrow and will be released to your mentor after the session.</p>
          </div>
        `,
      })
      .catch((err) => this.logger.error('Failed to send confirmation email', err));
  }
}
