// mail.service.ts — fix the invalid From header on sendWelcomeVerification
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { welcomeTemplate } from './templates/welcome';
import { courseJoinedTemplate } from './templates/course-joined';
import { duelChallengeTemplate } from './templates/duel-challenge';
import { passwordRecoveryTemplate } from './templates/password-recovery';

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

  async sendWelcomeVerification(
    email: string,
    username: string,
    token: string,
  ) {
    try {
      const appUrl =
        this.configService.get<string>('ARENA_FRONTEND_URL') ||
        'https://arena-community-phi.vercel.app';
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

      this.logger.log(
        `Sent course joined email to ${email} for course ${courseCode}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send course joined email to ${email}`,
        error,
      );
    }
  }

  async sendDuelChallenge(
    email: string,
    targetUsername: string,
    challengerUsername: string,
    courseCode: string,
    acceptLink: string,
  ) {
    try {
      const html = duelChallengeTemplate(
        challengerUsername,
        targetUsername,
        courseCode,
        acceptLink,
      );

      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject: `⚔️ DUEL CHALLENGE // ${challengerUsername.toUpperCase()} wants to fight`,
        html,
      });

      this.logger.log(
        `Sent duel challenge email to ${email} (challenger: ${challengerUsername})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send duel challenge email to ${email}`,
        error,
      );
    }
  }

  async sendPasswordRecovery(email: string, username: string, code: string) {
    try {
      const html = passwordRecoveryTemplate(username, code);

      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject: '⚔️ SYSTEM MESSAGE // SECURE ACCESS OVERRIDE',
        html,
        text: `Player: ${username}\nStatus: LOCKED OUT\n\nWe received a request to override the security protocols for your account.\n\nUse the following recovery code to regain entry into the Arena:\n\n${code}\n\nThis code will self-destruct in 15 minutes.\n\nIf you did not request this override, you can safely ignore this transmission.`,
      });

      this.logger.log(`Sent password recovery email to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password recovery email to ${email}`,
        error,
      );
    }
  }
}
