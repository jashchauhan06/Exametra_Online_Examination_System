using System;
using System.IO;
using System.IO.Compression;
using System.Diagnostics;
using System.Windows.Forms;
using System.Drawing;
using System.Threading;

namespace ExametraInstaller {
    static class Program {
        [STAThread]
        static void Main() {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }

    public class InstallerForm : Form {
        private ProgressBar progressBar;
        private Label statusLabel;
        private Button installBtn;
        private string installPath;

        public InstallerForm() {
            this.Text = "Exametra Lockdown Browser Setup";
            this.Size = new Size(500, 270);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(248, 249, 250);

            Label titleLabel = new Label() {
                Text = "Install Exametra Lockdown Browser",
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                Location = new Point(24, 20),
                AutoSize = true,
                ForeColor = Color.FromArgb(30, 41, 59)
            };

            Label descLabel = new Label() {
                Text = "This setup will install Exametra into your local application directory and automatically launch it.",
                Font = new Font("Segoe UI", 9),
                Location = new Point(25, 55),
                Size = new Size(440, 40),
                ForeColor = Color.FromArgb(100, 116, 139)
            };

            installPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "Exametra");

            statusLabel = new Label() {
                Text = "Ready to install to: " + installPath,
                Font = new Font("Segoe UI", 8),
                Location = new Point(25, 105),
                Size = new Size(440, 30),
                ForeColor = Color.FromArgb(71, 85, 105)
            };

            progressBar = new ProgressBar() {
                Location = new Point(25, 140),
                Size = new Size(435, 24),
                Style = ProgressBarStyle.Continuous,
                Value = 0
            };

            installBtn = new Button() {
                Text = "Install and Launch",
                Font = new Font("Segoe UI", 9, FontStyle.Bold),
                Location = new Point(280, 180),
                Size = new Size(180, 34),
                BackColor = Color.FromArgb(79, 70, 229),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat
            };
            installBtn.FlatAppearance.BorderSize = 0;
            installBtn.Click += InstallBtn_Click;

            this.Controls.Add(titleLabel);
            this.Controls.Add(descLabel);
            this.Controls.Add(statusLabel);
            this.Controls.Add(progressBar);
            this.Controls.Add(installBtn);
        }

        private void InstallBtn_Click(object sender, EventArgs e) {
            installBtn.Enabled = false;
            statusLabel.Text = "Extracting app files... Please wait.";
            progressBar.Style = ProgressBarStyle.Marquee;

            Thread worker = new Thread(() => {
                try {
                    string exePath = Process.GetCurrentProcess().MainModule.FileName;
                    using (FileStream fs = new FileStream(exePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    using (BinaryReader br = new BinaryReader(fs)) {
                        fs.Seek(-8, SeekOrigin.End);
                        long zipLen = br.ReadInt64();
                        fs.Seek(-(8 + zipLen), SeekOrigin.End);

                        if (Directory.Exists(installPath)) {
                            try {
                                foreach (var p in Process.GetProcessesByName("Exametra")) {
                                    p.Kill();
                                    p.WaitForExit(2000);
                                }
                            } catch {}
                        }
                        Directory.CreateDirectory(installPath);

                        byte[] zipBytes = br.ReadBytes((int)zipLen);
                        using (MemoryStream ms = new MemoryStream(zipBytes))
                        using (ZipArchive archive = new ZipArchive(ms)) {
                            foreach (var entry in archive.Entries) {
                                string target = Path.Combine(installPath, entry.FullName);
                                if (string.IsNullOrEmpty(entry.Name)) {
                                    Directory.CreateDirectory(target);
                                } else {
                                    Directory.CreateDirectory(Path.GetDirectoryName(target));
                                    entry.ExtractToFile(target, true);
                                }
                            }
                        }
                    }

                    // Create Desktop Shortcut
                    try {
                        string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                        string shortcutPath = Path.Combine(desktopPath, "Exametra.lnk");
                        Type t = Type.GetTypeFromProgID("WScript.Shell");
                        if (t != null) {
                            dynamic shell = Activator.CreateInstance(t);
                            dynamic shortcut = shell.CreateShortcut(shortcutPath);
                            shortcut.TargetPath = Path.Combine(installPath, "Exametra.exe");
                            shortcut.WorkingDirectory = installPath;
                            shortcut.Description = "Exametra Lockdown Browser";
                            shortcut.Save();
                        }
                    } catch {}

                    this.Invoke((MethodInvoker)delegate {
                        progressBar.Style = ProgressBarStyle.Continuous;
                        progressBar.Value = 100;
                        statusLabel.Text = "Installation complete! Launching Exametra...";
                    });

                    Thread.Sleep(800);

                    Process.Start(new ProcessStartInfo() {
                        FileName = Path.Combine(installPath, "Exametra.exe"),
                        WorkingDirectory = installPath
                    });

                    Application.Exit();
                } catch (Exception ex) {
                    this.Invoke((MethodInvoker)delegate {
                        progressBar.Style = ProgressBarStyle.Continuous;
                        statusLabel.Text = "Error: " + ex.Message;
                        MessageBox.Show("Failed to install: " + ex.Message, "Installation Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        installBtn.Enabled = true;
                    });
                }
            });
            worker.IsBackground = true;
            worker.Start();
        }
    }
}
