const fs = require('fs');
const b64 = fs.readFileSync('/tmp/logo-b64.txt', 'utf8').trim();
const targetPath = 'packages/providers/VerseWalletConnector.ts';
let content = fs.readFileSync(targetPath, 'utf8');
content = content.replace('iconUrl: "/logo.png"', 'iconUrl: "data:image/png;base64,' + b64 + '"');
fs.writeFileSync(targetPath, content);
