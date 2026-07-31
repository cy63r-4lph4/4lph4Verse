export const welcomeTemplate = (username: string, verifyLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Arena</title>
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
      color: #10b981; /* Emerald 500 */
      font-size: 24px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 30px;
      border-bottom: 1px solid rgba(16, 185, 129, 0.3);
      padding-bottom: 10px;
    }
    .status-block {
      background-color: rgba(255, 255, 255, 0.05);
      border-left: 3px solid #10b981;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    .status-block p { margin: 5px 0; }
    .status-value { color: #10b981; font-weight: bold; }
    p { margin-bottom: 15px; }
    .emphasis {
      color: #10b981;
      font-weight: bold;
    }
    .btn-container {
      text-align: center;
      margin: 40px 0;
    }
    .btn {
      display: inline-block;
      background-color: transparent;
      color: #10b981;
      text-decoration: none;
      padding: 15px 30px;
      border: 1px solid #10b981;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      transition: all 0.3s ease;
    }
    .btn:hover {
      background-color: rgba(16, 185, 129, 0.1);
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
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
    <h1>⚔️ WELCOME TO THE ARENA</h1>

    <p><strong>Wait… you actually made it here?</strong></p>
    <p>Interesting. 🤨</p>

    <div class="status-block">
      <p>PLAYER: <span class="status-value">${username}</span></p>
      <p>STATUS: <span class="status-value">UNRANKED</span></p>
      <p>THREAT LEVEL: <span class="status-value">UNKNOWN</span></p>
    </div>

    <p>I don't know whether you joined the Arena intentionally, got dragged here by a friend, or simply clicked something you probably shouldn't have.</p>
    
    <p>But you're here now.</p>
    
    <p>And since you've crossed the gates, there's only one thing left to say:</p>
    
    <p class="emphasis">Welcome, my newest rival. 🫡</p>
    
    <p>Just don't get too comfortable.</p>
    
    <p>The Arena isn't built for spectators.<br>
    It's built for <strong>challengers.</strong></p>
    
    <p>Here, you'll face questions that make you question everything you thought you knew.<br>
    You'll meet rivals who won't hesitate to take your spot on the leaderboard.<br>
    You'll encounter <strong>S-Rank bosses</strong> who seem to have memorized the entire syllabus. 💀</p>
    
    <p>And yes...</p>
    
    <p class="emphasis">Somewhere in this Arena, someone is already preparing to humble you.</p>
    
    <p>So, before we officially recognize you as a challenger, there's one little thing left to prove:</p>
    
    <h3>🔐 Prove that you actually intend to stay.</h3>
    
    <p>Use the verification link below to confirm your entry into the Arena.</p>

    <div class="btn-container">
      <a href="${verifyLink}" class="btn">[ VERIFY MY ENTRY ]</a>
    </div>

    <p>Once you've verified, the gates will open.</p>
    
    <p>Your rivals are waiting.<br>
    The leaderboard is waiting.<br>
    Your first challenge is waiting.</p>
    
    <p class="emphasis">Welcome to the Arena, Challenger.</p>
    
    <p>May your answers be correct,<br>
    your streak remain unbroken,<br>
    and your rank survive the week.</p>
    
    <p><strong>⚔️ LET THE BATTLE BEGIN.</strong></p>
    
    <div class="footer">
      <p>If you did not request to join the Arena, you can safely ignore this transmission.</p>
    </div>
  </div>
</body>
</html>
`;
