export default {
    id: 'meow',
    title: 'Meow Challenge',
    category: 'HackTheBox',
    difficulty: 'Easy',
    tags: ['Linux'],
    date: '2026-02-02T12:00:00',
    excerpt: 'Write up and walkthrough of Meow Challenge on HackTheBox.',
    content: `
This is a write up and walkthrough of the Meow Challenge on HackTheBox.

⸻⸻⸻⸻⸻

### Task 1

What does the acronym VM stand for?
**Answer:** Virtual Machine

⸻⸻⸻⸻⸻

### Task 2

What tool do we use to interact with the operating system in order to issue commands via the command line, such as the one to start our VPN connection? It's also known as a console or shell.
**Answer:** terminal

⸻⸻⸻⸻⸻

### Task 3

What service do we use to form our VPN connection into HTB labs?
**Answer:** OpenVPN

⸻⸻⸻⸻⸻

### Task 4

What tool do we use to test our connection to the target with an ICMP echo request?
**Answer:** ping

⸻⸻⸻⸻⸻

### Task 5

What is the name of the most common tool for finding open ports on a target?
**Answer:** nmap

⸻⸻⸻⸻⸻

### Task 6

What service do we identify on port 23/tcp during our scans?
**Answer:** telnet

⸻⸻⸻⸻⸻

### Task 7

What username is able to log into the target over telnet with a blank password?
**Answer:** root

⸻⸻⸻⸻⸻

Submit Flag
**Answer:** b40abdfe23665f766f9c61ecba8a4c19
**Reason:**
1. Run \`ping <target_ip>\` to make sure the target is up.
2. Run \`nmap -sV -sT -vv <target_ip>\` to scan all ports on the target system.
3. Telnet to the target system using \`telnet <target_ip> 23\`.
4. Log in using the username \`root\` and a blank password.
5. Run \`ls\` to list all files and directories.
6. Run \`cat flag.txt\` to view the flag.
`
}