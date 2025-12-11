import fs from "fs";
import path from "path";

// Match both ./ and ../, single-quoted or double-quoted, any depth
const importRegex = /from\s+['"](\.+\/[^'"]+)['"]/g;

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
      continue;
    }

    if (!file.endsWith(".js")) continue;

    let content = fs.readFileSync(fullPath, "utf8");

    // Replace relative imports that don't already end with .js
    content = content.replace(importRegex, (match, p1) => {
      if (p1.endsWith(".js")) return match;
      return match.replace(p1, `${p1}.js`);
    });

    fs.writeFileSync(fullPath, content, "utf8");
  }
}

fixImports("dist");
console.log("✅ All relative imports fixed with .js extensions");
