import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generatePdf(
    markdown: string,
    title: string,
    codename: string,
  ): Promise<Buffer> {
    const htmlContent = await marked(markdown);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            :root {
              --primary: #00ffcc;
              --bg: #050505;
              --text: #e0e0e0;
            }
            body {
              background-color: var(--bg);
              color: var(--text);
              font-family: 'Courier New', Courier, monospace;
              padding: 40px;
              position: relative;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 150px;
              color: rgba(255, 255, 255, 0.03);
              font-weight: bold;
              z-index: -1;
              white-space: nowrap;
              pointer-events: none;
            }
            h1, h2, h3 {
              color: var(--primary);
              text-transform: uppercase;
              border-bottom: 1px solid rgba(0, 255, 204, 0.2);
              padding-bottom: 10px;
            }
            a {
              color: var(--primary);
              text-decoration: none;
            }
            code {
              background-color: rgba(255,255,255,0.1);
              padding: 2px 4px;
              border-radius: 4px;
            }
            pre {
              background-color: rgba(0,0,0,0.5);
              border: 1px solid rgba(0, 255, 204, 0.2);
              padding: 15px;
              overflow-x: auto;
            }
            .header {
              text-align: right;
              font-size: 10px;
              color: rgba(255,255,255,0.3);
              text-transform: uppercase;
              margin-bottom: 30px;
              border-bottom: 1px solid rgba(255,255,255,0.1);
              padding-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="watermark">ARENA CLASSIFIED</div>
          <div class="header">Codex Entry: ${title} | Operator: ${codename}</div>
          ${htmlContent}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        displayHeaderFooter: true,
        footerTemplate: `
          <div style="font-size:8px; color:rgba(255,255,255,0.4); width:100%; text-align:center; font-family:'Courier New', monospace;">
            PROPERTY OF 4LPH4VERSE ARENA | SECURE DATAPAD | LICENSED TO: ${codename}
          </div>
        `,
        headerTemplate: '<span></span>', // Empty header, handled in HTML body
      });

      return Buffer.from(pdfBuffer);
    } catch (err) {
      this.logger.error('Failed to generate PDF', err);
      throw err;
    } finally {
      await browser.close();
    }
  }
}
