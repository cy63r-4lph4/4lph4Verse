export const courseJoinedTemplate = (username: string, courseCode: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Battlefield Detected</title>
  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      background-color: #020617; /* Slate 950 */
      color: #f8fafc; /* Slate 50 */
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #000000;
    }
    h1 {
      color: #ef4444; /* Red 500 */
      font-size: 24px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 30px;
      border-bottom: 1px solid rgba(239, 68, 68, 0.3);
      padding-bottom: 10px;
    }
    .status-block {
      background-color: rgba(255, 255, 255, 0.05);
      border-left: 3px solid #ef4444;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    .status-block p { margin: 5px 0; }
    .status-value { color: #ef4444; font-weight: bold; }
    p { margin-bottom: 15px; }
    .emphasis {
      color: #ef4444;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚔️ SYSTEM MESSAGE // NEW BATTLEFIELD DETECTED</h1>

    <div class="status-block">
      <p>PLAYER: <span class="status-value">${username}</span></p>
      <p>STATUS: <span class="status-value">UNRANKED</span></p>
      <p>THREAT LEVEL: <span class="status-value">UNKNOWN</span></p>
    </div>

    <p>You've entered <strong style="color:#ef4444">Arena #${courseCode}</strong>.</p>
    
    <p>Interesting...</p>
    
    <p>You survived one battlefield and decided you wanted another.<br>
    Either you're getting confident, or you haven't learned your lesson yet. 💀</p>
    
    <p>The system has no idea whether you're a genius, a lucky guesser, or someone who has absolutely no idea what they've gotten themselves into.</p>
    
    <p>Either way...</p>
    
    <p class="emphasis">Welcome back, Challenger.</p>
    
    <p>Your rivals have been notified. 🗡️</p>
    
    <p>Your leaderboard position is currently <strong>unclaimed.</strong></p>
    
    <p>Your first challenge is waiting.</p>
    
    <p>And remember:</p>
    
    <p class="emphasis">There is no blaming the system for your rank. 💀</p>
    
    <p><strong>⚔️ ENTER THE BATTLEFIELD.</strong></p>
    
    <div class="footer">
      <p>This is an automated system transmission. Do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
