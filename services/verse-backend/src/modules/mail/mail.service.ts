import { Injectable, Logger } from '@nestjs/common'; // TS Server refresh
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { welcomeTemplate } from './templates/welcome';
import { courseJoinedTemplate } from './templates/course-joined';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: false, 
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendWelcomeVerification(email: string, username: string, token: string) {
    try {
      const appUrl = this.configService.get<string>('ARENA_FRONTEND_URL') || 'https://arena-community-phi.vercel.app';
      const verifyLink = `${appUrl}/verify-email?token=${token}`;
      
      const html = welcomeTemplate(username, verifyLink);
      
      await this.transporter.sendMail({
        from: `Arena by DeskMate`,
        to: email,
        subject: '⚔️ WELCOME TO THE ARENA - Verify Your Entry',
        html: html,
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
        from: `"Arena DeskMate" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: '⚔️ SYSTEM MESSAGE // NEW BATTLEFIELD DETECTED',
        html: html,
      });
      
      this.logger.log(`Sent course joined email to ${email} for course ${courseCode}`);
    } catch (error) {
      this.logger.error(`Failed to send course joined email to ${email}`, error);
    }
  }
}
