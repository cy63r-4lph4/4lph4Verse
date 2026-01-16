import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            :root {
                --neon-blue: #00f2ff;
                --bg-dark: #0a0b10;
                --card-bg: #161b22;
            }
            body {
                background-color: var(--bg-dark);
                color: white;
                font-family: 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                overflow: hidden;
            }
            .dashboard {
                border: 1px solid var(--neon-blue);
                padding: 2rem;
                border-radius: 12px;
                background: var(--card-bg);
                box-shadow: 0 0 20px rgba(0, 242, 255, 0.2);
                text-align: center;
                max-width: 500px;
            }
            .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                background-color: #39ff14;
                border-radius: 50%;
                margin-right: 8px;
                box-shadow: 0 0 10px #39ff14;
            }
            h1 { letter-spacing: 4px; text-transform: uppercase; color: var(--neon-blue); }
            .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
            .stat-box { background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px; font-size: 0.9rem; }
            .stat-label { color: #888; display: block; margin-bottom: 5px; }
        </style>
    </head>
    <body>
        <div class="dashboard">
            <h1>4lph4Verse</h1>
            <p><span class="status-indicator"></span> ARENA BACKEND: ONLINE</p>
            <hr style="border: 0.5px solid #333; margin: 20px 0;">
            <div class="stats">
                <div class="stat-box">
                    <span class="stat-label">Latency</span>
                    <strong>12ms</strong>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Active Nodes</span>
                    <strong>1,024</strong>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Engine</span>
                    <strong>v1.0.0</strong>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Security</span>
                    <strong>Encrypted</strong>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}