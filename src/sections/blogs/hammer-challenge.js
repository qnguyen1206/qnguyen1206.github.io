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
2. Go to the website at \`http://MACHINE\_IP:1337\` and we will see a login page.
3. After inspect the page, we will find that there is a dev note that said "<!-- Dev Note: Directory naming convention must be hmr_DIRECTORY_NAME -->".
4. We can use this information to brute force the directories using \`dirb\` or \`gobuster\`.
5. Before we brute force the directories, we need to create a wordlist that contains the directory naming convention. We can use \`sed\` to modify the wordlist from \`/usr/share/wordlists/dirb/big.txt\` in order to prepend \`hmr_\` in front of each word. The command will be \`sed 's/^/hmr_/' /usr/share/wordlists/dirb/big.txt > hmr_big.txt\`.
6. Now, we can run \`dirb http://MACHINE\_IP:1337 hmr_big.txt\`.
7. We will find some directories including \`hmr_css\`, \`hmr_images\`, \`hmr_js\`. However, we are interested in the \`hmr_logs\` since it might give us something useful.
8. After accessing \`http://MACHINE\_IP:1337/hmr_logs\`, we will find a log file that contains some errors in which one of the username \`tester@hammer.thm\` was exposed.
9.


What is the content of the file **/home/ubuntu/flag.txt**?
**Answer:** THM{RUNANYCOMMAND1337}
**Reason:**

`
}