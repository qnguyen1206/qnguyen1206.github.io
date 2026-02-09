export default {
    id: 'ids-fundamentals',
    title: 'IDS Fundamentals',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['IDS'],
    date: '2026-02-09T12:00:00',
    excerpt: 'Write up and walkthrough of IDS Fundamentals room on TryHackMe.',
    content: `
This is a write up and walkthrough of the IDS Fundamentals room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 What Is an IDS

As we know,, firewalls are the security solution usually deployed on the boundary of a network to protect its incoming and outgoing traffic. The firewall checks the traffic when a connection is going to take place and denies it if it violates the firewall rules. However, there should be some security to detect the activities of the connection that passed through the firewall and has already taken place. So, if an attacker successfully bypasses a firewall via a legitimate-looking connection and then performs any malicious activities inside the network, there should be something to detect it in a timely manner. For this purpose, we have a security solution inside the network. This solution is known as an \`Intrusion Detection System (IDS)\`.

Think of an example of a building’s security. A firewall acts as the gatekeeper, checking the people coming in and going out. There is always a chance that some bad actor will successfully sneak inside and start performing malicious activities. He was missed at the gate, but what if we catch him even after he gets in? This can be done by the surveillance cameras present throughout the building. The IDS plays the role of surveillance cameras. It sits in a corner, monitors the network traffic based on its signature and anomaly-based detections, and detects any abnormal traffic going out or inside the network. Upon every detection, an alert is generated for the security administrators. IDS does not act on those detections; it only notifies the security administrators about the malicious activity.

This room will equip you with sound knowledge of IDS solutions. We will also explore the most popular open-source IDS solution in the upcoming tasks.

**Learning Objectives**
    - Types of IDS and their detection capabilities
    - Working of Snort IDS
    - Default and custom rules in Snort IDS
    - Making a custom rule in Snort IDS

**Prerequisites**
This room expects the users to have completed or explored the following rooms:
    - Firewall Fundamentals
    - Network Concepts

**Answer the questions below**⸻⸻⸻⸻⸻

Can an intrusion detection system (IDS) prevent the threat after it detects it? Yea/Nay
**Answer:** Nay

⸻⸻⸻⸻⸻

### Task 2 Types of IDS

IDS can be categorized differently depending on certain factors. An IDS’s main categorization depends on its deployment and detection modes.










`
}