const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== [1/4] Packaging Electron App with electron-packager ===');
execSync('npx electron-packager . Exametra --platform=win32 --arch=x64 --out=dist-electron --overwrite', { stdio: 'inherit' });

console.log('=== [2/4] Archiving packaged app into zip payload ===');
const zipPath = path.resolve('public/Exametra-Setup.zip');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}
execSync('tar -a -c -f public/Exametra-Setup.zip -C dist-electron/Exametra-win32-x64 .', { stdio: 'inherit' });

console.log('=== [3/4] Compiling Windows Installer Stub ===');
const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
const installerCs = path.resolve('scripts/Installer.cs');
const stubExe = path.resolve('SetupStub.tmp.exe');

execSync(`"${cscPath}" /target:winexe /r:System.IO.Compression.dll /r:System.IO.Compression.FileSystem.dll /r:System.Windows.Forms.dll /r:System.Drawing.dll /out:"${stubExe}" "${installerCs}"`, { stdio: 'inherit' });

console.log('=== [4/4] Generating Single-File Installer public/Exametra-Setup.exe ===');
const stub = fs.readFileSync(stubExe);
const zip = fs.readFileSync(zipPath);

const lenBuf = Buffer.alloc(8);
lenBuf.writeBigInt64LE(BigInt(zip.length), 0);

const targetExe = path.resolve('public/Exametra-Setup.exe');
const out = fs.createWriteStream(targetExe);
out.write(stub);
out.write(zip);
out.write(lenBuf);
out.end(() => {
  if (fs.existsSync(stubExe)) {
    fs.unlinkSync(stubExe);
  }
  console.log(`\n🎉 Success! New installer generated at: ${targetExe}`);
  console.log(`File size: ${(fs.statSync(targetExe).size / (1024 * 1024)).toFixed(2)} MB`);
});
