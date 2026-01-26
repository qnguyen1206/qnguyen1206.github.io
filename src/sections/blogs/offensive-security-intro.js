export default {
    id: 'offensive-security-intro',
    title: 'Offensive Security Intro',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['Offensive Security'],
    date: '2026-01-16T12:00:00',
    excerpt: 'Write up and walkthrough of Offensive Security Intro room on TryHackMe.',
    content: `
This is a write up and walkthrough of the Offensive Security Intro room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Think like a Hacker!

Offensive Security is about thinking like an attacker to find weaknesses before real hackers do.

In this room, you'll hack your first website in a safe and legal environment to see how ethical hackers operate.

**Answer the questions below**⸻⸻⸻⸻⸻

Which term describes simulating a hacker's actions to find weaknesses?
- Offensive Security
- Defensive Security
**Answer:** Offensive Security

⸻⸻⸻⸻⸻

### Task 2 Starting the Lab

This room uses a virtual desktop to simulate a real system. Click the button below to get started!

**View Site**
A browser will automatically open, displaying FakeBank, a fake banking application. This is what you will be targeting.

**Answer the questions below**⸻⸻⸻⸻⸻

What is the bank account number in the FakeBank application?
**Answer:** 8881

⸻⸻⸻⸻⸻

### Task 3 Find Hidden Pages

**Goal**
Find a weakness in the FakeBank application. One common mistake is leaving hidden pages accessible.

**Open the Terminal**
Open the terminal on the machine. You will be using this to run your first hacking tool, \`dirbuster\`. The terminal icon will look like the following:

<img src="/public/blogs/tryhackme/offensive-security-intro/5de96d9ca744773ea7ef8c00-1767710353328.png" alt="Terminal Icon">

**Finding Hidden Pages**
To find hidden pages using Dirbuster, we will use \`dirb\` and the URL that we wish to search:

\`dirb http://fakebank.thm\`
Any lines from the output that start with \`+\` are pages that have been found. Dirb will find two URLs.

**Answer the questions below**⸻⸻⸻⸻⸻

Dirb found one URL, \`http://fakebank.thm/images.\`
What is the other hidden URL?
**Answer:** http://fakebank.thm/bank-transfer

⸻⸻⸻⸻⸻

### Task 4 Attack the Admin Page

You should now have found a hidden admin panel that lets you add money to your account.

To open this URL in the browser of the simulated desktop:

<img src="public/blogs/tryhackme/offensive-security-intro/5de96d9ca744773ea7ef8c00-1767711203188.png" alt="Browser Icon">

Add the following: \`/bank-transfer\` to the URL in the browser.

Use your account number 8881 and deposit $2000 (or more). After depositing, return to your account page and confirm the balance is now positive.

**Answer the questions below**⸻⸻⸻⸻⸻

When your balance turns positive, a pop-up with green text appears.
Enter the green words as the answer (ALL CAPS)
**Answer:** BANK-HACKED

`
}