// mail.service.ts — fix the invalid From header on sendWelcomeVerification
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { welcomeTemplate } from './templates/welcome';
import { courseJoinedTemplate } from './templates/course-joined';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const port = Number(this.configService.get('SMTP_PORT')) || 587;
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  private get fromAddress() {
    // Was previously `from: 'Arena by DeskMate'` with no email address —
    // invalid RFC 5322 syntax, several SMTP providers reject or silently
    // rewrite it. Always pass "Display Name <email>".
    return `"Arena" <${this.configService.get<string>('SMTP_USER')}>`;
  }

  async sendWelcomeVerification(email: string, username: string, token: string) {
    try {
      const appUrl = this.configService.get<string>('ARENA_FRONTEND_URL') || 'https://arena-community-phi.vercel.app';
      const verifyLink = `${appUrl}/verify-email?token=${token}`;
      const html = welcomeTemplate(username, verifyLink);

      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject: '⚔️ WELCOME TO THE ARENA — Verify Your Entry',
        html,
      });

      this.logger.log(`Sent welcome verification email to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
    }
  }

  async sendCourseJoined(email: string, username: string, courseCode: string) {
    try {
      const html = courseJoinedTemplate(username, courseCode);

      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject: '⚔️ SYSTEM MESSAGE // NEW BATTLEFIELD DETECTED',
        html,
      });

      this.logger.log(`Sent course joined email to ${email} for course ${courseCode}`);
    } catch (error) {
      this.logger.error(`Failed to send course joined email to ${email}`, error);
    }
  }
}