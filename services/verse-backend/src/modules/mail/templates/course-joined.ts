// templates/course-joined.ts
export const courseJoinedTemplate = (username: string, courseCode: string) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>New Battlefield Detected</title>
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
  /* Best-effort only — everything below is ALSO applied inline on the
     elements themselves via bgcolor/style attributes, since Gmail web,
     Outlook desktop, and several other clients discard this block on
     render. That stripping is what caused the white-on-white bug. */
  body, table, td { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  a { text-decoration:none; }
  @media (max-width:620px) {
    .arena-card { width:100% !important; }
    .arena-px { padding-left:20px !important; padding-right:20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#020617;" bgcolor="#020617">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#020617" style="background-color:#020617;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" class="arena-card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000;border:1px solid rgba(255,255,255,0.1);">
          <tr>
            <td class="arena-px" style="padding:40px 20px;font-family:'Courier New',Courier,monospace;color:#f8fafc;">

              <h1 style="margin:0 0 30px;color:#ef4444;font-size:24px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(239,68,68,0.3);padding-bottom:10px;font-family:'Courier New',Courier,monospace;">
                ⚔️ SYSTEM MESSAGE // NEW BATTLEFIELD DETECTED
              </h1>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="rgba(255,255,255,0.05)" style="background-color:rgba(255,255,255,0.05);border-left:3px solid #ef4444;margin:20px 0;">
                <tr>
                  <td style="padding:15px;font-family:'Courier New',Courier,monospace;font-size:14px;color:#f8fafc;">
                    <p style="margin:5px 0;">PLAYER: <span style="color:#ef4444;font-weight:bold;">${username}</span></p>
                    <p style="margin:5px 0;">STATUS: <span style="color:#ef4444;font-weight:bold;">UNRANKED</span></p>
                    <p style="margin:5px 0;">THREAT LEVEL: <span style="color:#ef4444;font-weight:bold;">UNKNOWN</span></p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 15px;color:#f8fafc;">You've entered <strong style="color:#ef4444;">Arena #${courseCode}</strong>.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">Interesting...</p>

              <p style="margin:0 0 15px;color:#f8fafc;">You survived one battlefield and decided you wanted another.<br>
              Either you're getting confident, or you haven't learned your lesson yet. 💀</p>

              <p style="margin:0 0 15px;color:#f8fafc;">The system has no idea whether you're a genius, a lucky guesser, or someone who has absolutely no idea what they've gotten themselves into.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">Either way...</p>

              <p style="margin:0 0 15px;color:#ef4444;font-weight:bold;">Welcome back, Challenger.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">Your rivals have been notified. 🗡️</p>

              <p style="margin:0 0 15px;color:#f8fafc;">Your leaderboard position is currently <strong>unclaimed.</strong></p>

              <p style="margin:0 0 15px;color:#f8fafc;">Your first challenge is waiting.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">And remember:</p>

              <p style="margin:0 0 15px;color:#ef4444;font-weight:bold;">There is no blaming the system for your rank. 💀</p>

              <p style="margin:0 0 15px;color:#f8fafc;"><strong>⚔️ ENTER THE BATTLEFIELD.</strong></p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:50px;border-top:1px solid rgba(255,255,255,0.1);">
                <tr>
                  <td style="padding-top:20px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#64748b;">
                    <p style="margin:0;">This is an automated system transmission. Do not reply.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;