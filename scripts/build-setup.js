const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== [1/4] Packaging Electron App from the installed runtime ===');
const electronDist = path.resolve('node_modules/electron/dist');
const packagedApp = path.resolve('dist-electron/Exametra-win32-x64');
const packagedResources = path.join(packagedApp, 'resources');
const packagedSource = path.join(packagedResources, 'app');
const electronExe = path.join(electronDist, 'electron.exe');

if (!fs.existsSync(electronExe)) {
  throw new Error('Electron runtime is missing. Install dependencies before building the installer.');
}

fs.rmSync(packagedApp, { recursive: true, force: true });
fs.mkdirSync(path.dirname(packagedApp), { recursive: true });
fs.cpSync(electronDist, packagedApp, { recursive: true });
fs.renameSync(path.join(packagedApp, 'electron.exe'), path.join(packagedApp, 'Exametra.exe'));
fs.mkdirSync(packagedSource, { recursive: true });
fs.copyFileSync(path.resolve('main.js'), path.join(packagedSource, 'main.js'));

const appPackage = require(path.resolve('package.json'));
fs.writeFileSync(path.join(packagedSource, 'package.json'), JSON.stringify({
  name: appPackage.name,
  version: appPackage.version,
  description: appPackage.description,
  main: 'main.js',
}, null, 2));

const packagedExe = path.join(packagedApp, 'Exametra.exe');
fs.copyFileSync(packagedExe, path.resolve('public/Exametra.exe'));

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
