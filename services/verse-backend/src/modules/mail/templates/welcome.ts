// templates/welcome.ts
export const welcomeTemplate = (username: string, verifyLink: string) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Welcome to the Arena</title>
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
  /* Best-effort only — everything below is ALSO applied inline via
     bgcolor/style attributes, since Gmail web, Outlook desktop, and
     several other clients discard this block on render. That stripping
     is what caused the white-on-white bug in the original version. */
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
                ⚔️ WELCOME TO THE ARENA
              </h1>

              <p style="margin:0 0 15px;color:#f8fafc;"><strong>Wait… you actually made it here?</strong></p>
              <p style="margin:0 0 15px;color:#f8fafc;">Interesting. 🤨</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="rgba(255,255,255,0.05)" style="background-color:rgba(255,255,255,0.05);border-left:3px solid #10b981;margin:20px 0;">
                <tr>
                  <td style="padding:15px;font-family:'Courier New',Courier,monospace;font-size:14px;color:#f8fafc;">
                    <p style="margin:5px 0;">PLAYER: <span style="color:#10b981;font-weight:bold;">${username}</span></p>
                    <p style="margin:5px 0;">STATUS: <span style="color:#10b981;font-weight:bold;">UNRANKED</span></p>
                    <p style="margin:5px 0;">THREAT LEVEL: <span style="color:#10b981;font-weight:bold;">UNKNOWN</span></p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 15px;color:#f8fafc;">I don't know whether you joined the Arena intentionally, got dragged here by a friend, or simply clicked something you probably shouldn't have.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">But you're here now.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">And since you've crossed the gates, there's only one thing left to say:</p>

              <p style="margin:0 0 15px;color:#10b981;font-weight:bold;">Welcome, my newest rival. 🫡</p>

              <p style="margin:0 0 15px;color:#f8fafc;">Just don't get too comfortable.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">The Arena isn't built for spectators.<br>
              It's built for <strong>challengers.</strong></p>

              <p style="margin:0 0 15px;color:#f8fafc;">Here, you'll face questions that make you question everything you thought you knew.<br>
              You'll meet rivals who won't hesitate to take your spot on the leaderboard.<br>
              You'll encounter <strong>S-Rank bosses</strong> who seem to have memorized the entire syllabus. 💀</p>

              <p style="margin:0 0 15px;color:#f8fafc;">And yes...</p>

              <p style="margin:0 0 15px;color:#10b981;font-weight:bold;">Somewhere in this Arena, someone is already preparing to humble you.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">So, before we officially recognize you as a challenger, there's one little thing left to prove:</p>

              <h3 style="margin:24px 0 12px;color:#f8fafc;font-family:'Courier New',Courier,monospace;font-size:16px;">
                🔐 Prove that you actually intend to stay.
              </h3>

              <p style="margin:0 0 15px;color:#f8fafc;">Use the verification link below to confirm your entry into the Arena.</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:40px auto;">
                <tr>
                  <td align="center" bgcolor="#000000" style="background-color:#000000;border:1px solid #10b981;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${verifyLink}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="0%" fillcolor="#000000" strokecolor="#10b981">
                    <center style="color:#10b981;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;letter-spacing:2px;">[ VERIFY MY ENTRY ]</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${verifyLink}" target="_blank" style="display:inline-block;padding:15px 30px;font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:bold;letter-spacing:2px;color:#10b981;text-decoration:none;text-transform:uppercase;">
                      [ VERIFY MY ENTRY ]
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 15px;color:#f8fafc;">Once you've verified, the gates will open.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">Your rivals are waiting.<br>
              The leaderboard is waiting.<br>
              Your first challenge is waiting.</p>

              <p style="margin:0 0 15px;color:#10b981;font-weight:bold;">Welcome to the Arena, Challenger.</p>

              <p style="margin:0 0 15px;color:#f8fafc;">May your answers be correct,<br>
              your streak remain unbroken,<br>
              and your rank survive the week.</p>

              <p style="margin:0 0 15px;color:#f8fafc;"><strong>⚔️ LET THE BATTLE BEGIN.</strong></p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:50px;border-top:1px solid rgba(255,255,255,0.1);">
                <tr>
                  <td style="padding-top:20px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#64748b;">
                    <p style="margin:0;">If you did not request to join the Arena, you can safely ignore this transmission.</p>
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