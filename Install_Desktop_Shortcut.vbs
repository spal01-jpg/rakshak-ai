Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShellLink = WshShell.CreateShortcut(strDesktop & "\Rakshak AI.lnk")
strCurrentDir = WshShell.CurrentDirectory

oShellLink.TargetPath = strCurrentDir & "\Rakshak_AI.exe"
oShellLink.WorkingDirectory = strCurrentDir
oShellLink.WindowStyle = 1
oShellLink.Description = "Rakshak AI - Tactical Mental Health & Stress Telemetry Platform"
oShellLink.IconLocation = strCurrentDir & "\assets\app.ico, 0"
oShellLink.Save

MsgBox "Rakshak AI shortcut successfully installed on your Desktop!" & vbCrLf & vbCrLf & "You can now launch Rakshak AI directly from your desktop anytime.", 64, "Rakshak AI Setup"
