export default {
    id: 'hammer-challenge',
    title: 'Hammer',
    category: 'TryHackMe',
    difficulty: 'Medium',
    tags: ['Penetration Testing', 'Web Application', 'Authentication'],
    date: '2026-04-08T12:00:00',
    excerpt: 'Write up and walkthrough of Hammer Challenge room on TryHackMe.',
    content: `
This is the write up and walkthrough of the Pickle Rick Challenge room on TryHackMe.

⸻⸻⸻⸻⸻

Start the VM by clicking the \`Start Machine\` button at the top right of the task. You can complete the challenge by connecting through a VPN or the AttackBox, which contains all the essential tools.

With the Hammer in hand, can you bypass the authentication mechanisms and get RCE on the system?

**Answer the questions below**⸻⸻⸻⸻⸻

What is the flag value after logging in to the dashboard?
**Answer:** THM{AuthBypass3D}
**Reason:**
1. Run \`nmap -sV -sC -p1-65535 MACHINE\_IP\` to figure out if the host is online and which port is open. We will find that port 22 for SSH and port 1337 for HTTP are open.
2. Go to the website at \`http://MACHINE_IP:1337\` and we will see a login page.


What is the content of the file **/home/ubuntu/flag.txt**?
**Answer:** THM{RUNANYCOMMAND1337}
**Reason:**

`
}