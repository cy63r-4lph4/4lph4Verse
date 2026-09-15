// templates/duel-challenge.ts
import { buildEmailShell, BRAND } from './shared';

export const duelChallengeTemplate = (
  challengerName: string,
  targetName: string,
  arenaCode: string,
  acceptLink: string,
) =>
  buildEmailShell({
    eyebrow: '⚔️ SYSTEM ALERT',
    title: 'Duel Challenge Issued',
    accent: BRAND.danger,
    preheader: `${challengerName} has challenged you to a duel in Arena #${arenaCode}. Do you accept?`,
    bodyHtml: `
      <h2 style="margin:0 0 20px;font-size:20px;letter-spacing:3px;text-transform:uppercase;color:${BRAND.danger};">
        INCOMING DUEL CHALLENGE
      </h2>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};"><strong>INCOMING CHALLENGE DETECTED.</strong></p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.bgPanel}" style="background-color:${BRAND.bgPanel};border-left:3px solid ${BRAND.danger};margin:20px 0;border-radius:0 8px 8px 0;">
        <tr>
          <td style="padding:15px;font-family:'Courier New',Courier,monospace;font-size:14px;color:${BRAND.textPrimary};">
            <p style="margin:5px 0;">CHALLENGER: <span style="color:${BRAND.danger};font-weight:bold;">${challengerName}</span></p>
            <p style="margin:5px 0;">TARGET: <span style="color:${BRAND.danger};font-weight:bold;">${targetName}</span></p>
            <p style="margin:5px 0;">BATTLEFIELD: <span style="color:${BRAND.danger};font-weight:bold;">Arena #${arenaCode}</span></p>
            <p style="margin:5px 0;">THREAT LEVEL: <span style="color:${BRAND.danger};font-weight:bold;">UNKNOWN</span></p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};">Someone has decided that you're worth challenging.</p>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};">Bold move. 🫡</p>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};">Your opponent has entered the Arena, issued the challenge, and is now waiting for your response.</p>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};">
        Maybe they think they can take your rank.<br>
        Maybe they think you're an easy target.<br>
        Or maybe...
      </p>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};">they have absolutely no idea what they're getting themselves into. 💀</p>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};">Either way, the challenge has been issued.</p>

      <h3 style="margin:24px 0 12px;color:${BRAND.textPrimary};font-family:'Courier New',Courier,monospace;font-size:16px;">
        🗡️ THE QUESTION IS...
      </h3>

      <p style="margin:0 0 15px;color:${BRAND.textPrimary};">Will you accept?</p>

      <p style="margin:8px 0 0;font-size:12px;color:${BRAND.amber};font-style:italic;">⚠️ Warning: Accepting this duel may negatively affect your ego. 💀</p>
    `,
    ctaLabel: '⚔️  ACCEPT DUEL',
    ctaHref: acceptLink,
  });
