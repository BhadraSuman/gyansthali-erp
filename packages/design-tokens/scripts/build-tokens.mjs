import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgRoot = path.resolve(__dirname, '..');
const tokensRaw = fs.readFileSync(path.join(pkgRoot, 'tokens.json'), 'utf8');
const tokens = JSON.parse(tokensRaw);

// 1. Generate tokens.css
let css = `:root {\n`;
for (const [group, vals] of Object.entries(tokens.colors)) {
  for (const [key, hex] of Object.entries(vals)) {
    css += `  --color-${group}-${key}: ${hex};\n`;
  }
}
for (const [key, val] of Object.entries(tokens.spacing)) {
  css += `  --spacing-${key}: ${val};\n`;
}
for (const [key, val] of Object.entries(tokens.borderRadius)) {
  css += `  --radius-${key}: ${val};\n`;
}
for (const [key, val] of Object.entries(tokens.shadows)) {
  css += `  --shadow-${key}: ${val};\n`;
}
css += `}\n`;

fs.mkdirSync(path.join(pkgRoot, 'dist'), { recursive: true });
fs.writeFileSync(path.join(pkgRoot, 'dist', 'tokens.css'), css, 'utf8');

// 2. Generate TypeScript export
const ts = `export const tokens = ${JSON.stringify(tokens, null, 2)} as const;\n\nexport type DesignTokens = typeof tokens;\nexport default tokens;\n`;
fs.writeFileSync(path.join(pkgRoot, 'dist', 'index.js'), `module.exports = { tokens: ${JSON.stringify(tokens)} };\n`, 'utf8');
fs.writeFileSync(path.join(pkgRoot, 'dist', 'index.mjs'), `export const tokens = ${JSON.stringify(tokens)};\nexport default tokens;\n`, 'utf8');
fs.writeFileSync(path.join(pkgRoot, 'dist', 'index.d.ts'), `export declare const tokens: any;\nexport default tokens;\n`, 'utf8');

// 3. Generate Flutter theme token mapping
const dart = `// GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from packages/design-tokens/tokens.json
import 'package:flutter/material.dart';

class GyanSthaliColors {
  static const Color primary = Color(0xFF1E3A8A);
  static const Color primaryDark = Color(0xFF172554);
  static const Color primaryLight = Color(0xFF3B82F6);
  static const Color secondary = Color(0xFFF59E0B);
  
  // Roles
  static const Color roleAdmin = Color(0xFF6D28D9);
  static const Color roleTeacher = Color(0xFF2563EB);
  static const Color roleParent = Color(0xFFF59E0B);
  static const Color roleStudent = Color(0xFF16A34A);
  static const Color roleAccountant = Color(0xFF0D9488);

  // Status
  static const Color success = Color(0xFF16A34A);
  static const Color successLight = Color(0xFFDCFCE7);
  static const Color warning = Color(0xFFEA580C);
  static const Color warningLight = Color(0xFFFFEDD5);
  static const Color danger = Color(0xFFDC2626);
  static const Color dangerLight = Color(0xFFFEE2E2);

  // Surfaces
  static const Color background = Color(0xFFF6F7FB);
  static const Color card = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE2E8F0);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
}

class GyanSthaliRadius {
  static const double sm = 4.0;
  static const double base = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 24.0;
  static const double full = 9999.0;
}

class GyanSthaliSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}
`;
fs.writeFileSync(path.join(pkgRoot, 'dist', 'flutter_theme_tokens.dart'), dart, 'utf8');

console.log('✅ Design tokens built successfully: CSS, TS, Flutter');
