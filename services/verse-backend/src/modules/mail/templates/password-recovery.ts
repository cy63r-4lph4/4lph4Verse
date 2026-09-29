export const passwordRecoveryTemplate = (username: string, code: string) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Arena Password Recovery</title>
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

              <h1 style="margin:0 0 30px;color:#10b981;font-size:24px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(16,185,129,0.3);padding-bottom:10px;font-family:'Courier New',Courier,monospace;">
                ⚔️ SECURE ACCESS OVERRIDE
              </h1>

              <p style="margin:0 0 15px;color:#f8fafc;"><strong>Forgot your access codes, Challenger?</strong></p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="rgba(255,255,255,0.05)" style="background-color:rgba(255,255,255,0.05);border-left:3px solid #10b981;margin:20px 0;">
                <tr>
                  <td style="padding:15px;font-family:'Courier New',Courier,monospace;font-size:14px;color:#f8fafc;">
                    <p style="margin:5px 0;">PLAYER: <span style="color:#10b981;font-weight:bold;">${username}</span></p>
                    <p style="margin:5px 0;">STATUS: <span style="color:#10b981;font-weight:bold;">LOCKED OUT</span></p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 15px;color:#f8fafc;">We received a request to override the security protocols for your account.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">Use the following recovery code to regain entry into the Arena:</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:40px auto;">
                <tr>
                  <td align="center" bgcolor="#000000" style="background-color:#000000;border:1px solid #10b981;padding:15px 30px;">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:bold;letter-spacing:6px;color:#10b981;">
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 15px;color:#f8fafc;">This code will self-destruct in 15 minutes.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">If you did not request this override, someone else might be trying to breach your account. Ensure your defenses are up.</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:50px;border-top:1px solid rgba(255,255,255,0.1);">
                <tr>
                  <td style="padding-top:20px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#64748b;">
                    <p style="margin:0;">If you did not request this code, you can safely ignore this transmission.</p>
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
