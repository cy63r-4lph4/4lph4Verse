// templates/shared.ts

export const BRAND = {
  bgOuter: '#050505',
  bgCard: '#0B0A10',
  bgPanel: 'rgba(255,255,255,0.04)',
  border: '#232131',
  textPrimary: '#F5F5F7',
  textMuted: '#8B8798',
  violet: '#6D5EF9',
  cyan: '#22D3EE',
  danger: '#EF4444',
  amber: '#F59E0B',
};

/**
 * Bulletproof button — table-based with an MSO/VML fallback for Outlook
 * desktop, which ignores <a> padding/background entirely without it.
 */
function ctaButton(label: string, href: string) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 8px;">
    <tr>
      <td align="center" bgcolor="${BRAND.violet}" style="border-radius:10px;">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="18%" fillcolor="${BRAND.violet}" stroke="f">
        <center style="color:#050505;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;">${label}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="${href}" target="_blank" style="display:inline-block;padding:15px 32px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;color:#050505;text-decoration:none;text-transform:uppercase;">
          ${label}
        </a>
        <!--<![endif]-->
      </td>
    </tr>
  </table>`;
}

/**
 * Full email shell — every color is set via inline style AND a matching
 * bgcolor attribute (belt-and-suspenders: bgcolor survives clients that
 * strip <style>/CSS entirely, inline style covers everything else). This
 * is the fix for the white-on-white bug: the previous version relied on a
 * <head><style> block for body/.container background, which most inbox
 * providers (Gmail web, Outlook desktop) discard on render.
 */
export function buildEmailShell(opts: {
  eyebrow: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
  accent?: string; // defaults to violet; pass BRAND.danger / BRAND.amber for a different flavor
  preheader?: string;
}) {
  const accent = opts.accent ?? BRAND.violet;

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${opts.title}</title>
<!--[if mso]>
<noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
</noscript>
<![endif]-->
<style>
  /* Best-effort only — every rule below is ALSO applied inline on the
     elements themselves, since many clients ignore this block entirely. */
  body, table, td { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; display:block; }
  a { text-decoration:none; }
  @media (max-width:620px) {
    .arena-card { width:100% !important; }
    .arena-px { padding-left:20px !important; padding-right:20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bgOuter};" bgcolor="${BRAND.bgOuter}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${opts.preheader ?? ''}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.bgOuter}" style="background-color:${BRAND.bgOuter};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" class="arena-card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.bgCard}" style="background-color:${BRAND.bgCard};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">

          <!-- two-tone accent bar (violet -> cyan) -->
          <tr>
            <td style="line-height:0;font-size:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" height="4" bgcolor="${BRAND.violet}" style="background-color:${BRAND.violet};line-height:4px;font-size:4px;">&nbsp;</td>
                  <td width="50%" height="4" bgcolor="${BRAND.cyan}" style="background-color:${BRAND.cyan};line-height:4px;font-size:4px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- wordmark -->
          <tr>
            <td align="center" style="padding:32px 24px 8px;">
              <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:5px;color:${accent};text-transform:uppercase;">
                ${opts.eyebrow}
              </span>
              <div style="margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:6px;color:${BRAND.textPrimary};text-transform:uppercase;">
                ARENA
              </div>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td class="arena-px" style="padding:16px 40px 8px;font-family:'Courier New',Courier,monospace;font-size:14px;line-height:1.7;color:${BRAND.textPrimary};">
              ${opts.bodyHtml}
            </td>
          </tr>

          ${opts.ctaLabel && opts.ctaHref ? `<tr><td class="arena-px" style="padding:8px 40px 24px;">${ctaButton(opts.ctaLabel, opts.ctaHref)}</td></tr>` : ''}

          <!-- footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid ${BRAND.border};">
              <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:${BRAND.textMuted};">
                This is an automated transmission from Arena. Do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}