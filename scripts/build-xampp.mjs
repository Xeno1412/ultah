/**
 * Paket deploy XAMPP.
 *
 * Jalankan `npm run build:xampp`. Script ini memakai hasil `vite build` di
 * folder dist/ lalu menyalinnya bersama api/, data/, dan .htaccess ke
 * xampp/birthday/ supaya bisa langsung dicopy ke C:\xampp\htdocs\birthday.
 */
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const outputDir = path.join(root, 'xampp', 'birthday');

if (!existsSync(distDir)) {
  console.error('[build:xampp] Folder dist/ belum ada. Jalankan `vite build` dulu.');
  process.exit(1);
}

async function copyDirectoryContents(source, destination) {
  await mkdir(destination, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    await cp(path.join(source, entry.name), path.join(destination, entry.name), {
      recursive: true,
      force: true
    });
  }
}

async function countFiles(directory) {
  let total = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      total += await countFiles(path.join(directory, entry.name));
    } else {
      total += 1;
    }
  }
  return total;
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

// 1. Hasil build React/Vite (index.html + assets/)
await copyDirectoryContents(distDir, outputDir);

// 2. API PHP untuk Apache/XAMPP
await copyDirectoryContents(path.join(root, 'api'), path.join(outputDir, 'api'));

// 3. Data konten & inbox (disertakan agar langsung siap pakai)
await copyDirectoryContents(path.join(root, 'data'), path.join(outputDir, 'data'));

// 4. Konfigurasi Apache
await cp(path.join(root, '.htaccess'), path.join(outputDir, '.htaccess'));

// 5. Helper tunnel di samping folder situs
const tunnelScript = path.join(root, 'start-cloudflare-tunnel.bat');
if (existsSync(tunnelScript)) {
  await cp(tunnelScript, path.join(root, 'xampp', 'start-cloudflare-tunnel.bat'));
}

const files = await countFiles(outputDir);
const size = await stat(outputDir);

console.log('');
console.log('[build:xampp] Paket XAMPP siap.');
console.log(`  Folder : ${path.relative(root, outputDir)}`);
console.log(`  File   : ${files}`);
console.log('');
console.log('Langkah selanjutnya:');
console.log('  1. Copy isi folder tersebut ke C:\\xampp\\htdocs\\birthday');
console.log('  2. Start Apache di XAMPP Control Panel');
console.log('  3. Buka http://localhost/birthday/');
console.log('  4. Untuk link publik: jalankan xampp\\start-cloudflare-tunnel.bat');
console.log('');
