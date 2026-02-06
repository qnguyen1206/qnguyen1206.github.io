export default {
    id: 'soc-fundamentals',
    title: 'SOC Fundamentals',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['SOC'],
    date: '2026-02-06T12:00:00',
    excerpt: 'Write up and walkthrough of SOC Fundamentals room on TryHackMe.',
    content: `
This is a write up and walkthrough of the SOC Fundamentals room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Introduction to SOC

Technology has made our lives more efficient, but with this efficiency comes more responsibility. Modern-day fears have come a long way from the exploitation of physical assets. The critical data, called secrets, are no longer stored in physical files. Organizations carry tons of confidential data in their network and systems. Any unauthorized disruption, loss, or modification to this data may cause them a huge damage. Threat actors discover and exploit new vulnerabilities in these networks and systems daily, becoming a major concern in cyber security. Traditional security practices may not be enough to prevent many of these threats. Dedicating a whole team to managing your organization’s security is important.

A **SOC** (**S**ecurity **O**perations **C**enter) is a dedicated facility operated by a specialized security team. This team aims to continuously monitor an organization’s network and resources and identify suspicious activity to prevent damage. This team works 24 hours a day, seven days a week.

This room will delve into some key concepts of SOC, one of the most important fields in defensive security.

**Learning Objectives**
    - Building a baseline for SOC (Security Operations Center)
    - Detection and response in SOC
    - The role of People, Processes, and Technology
    - Practical exercise

**Answer the questions below**⸻⸻⸻⸻⸻

What does the term SOC stand for?
**Answer:** Security Operations Center

⸻⸻⸻⸻⸻

### Task 2 Purpose and Components

The main focus of the SOC team is to keep **Detection** and **Response** intact. The SOC team has some resources available in the form of security solutions that help them achieve this. These solutions integrate the whole company’s network and all the systems to monitor them from one centralized location. Continuous monitoring is required to detect and respond to any security incident.

**Detection**
    - **Detect vulnerabilities**: A vulnerability is a weakness that an attacker can exploit to carry out things beyond their permission level. A vulnerability might be discovered in any device’s software (operating system and programs), such as a server or computer. For instance, the SOC might discover a set of MS Windows computers that must be patched against a specific published vulnerability. Strictly speaking, vulnerabilities are not necessarily the SOC’s responsibility; however, unfixed vulnerabilities affect the security level of the entire company.
    - **Detect unauthorized activity**: Consider the case where an attacker discovered the username and password of one of the employees and used them to log in to the company system. It is crucial to detect this kind of unauthorized activity quickly before it causes any damage. Many clues, such as geographic location, can help us detect this.
    - **Detect policy violations**: A security policy is a set of rules and procedures created to help protect a company against security threats and ensure compliance. What is considered a violation would vary from company to company; examples include downloading pirated media files and sending confidential company files insecurely.
    - **Detect intrusions**: Intrusions refer to unauthorized access to systems and networks. One scenario would be an attacker successfully exploiting our web application. Another would be a user visiting a malicious site and getting their computer infected.

**Response**
    - **Support with the incident response**: Once an incident is detected, certain steps are taken to respond to it. This response includes minimizing its impact and performing the root cause analysis of the incident. The SOC team also helps the incident response team carry out these steps.

There are three pillars of a SOC. With all these pillars, a SOC team becomes mature and efficiently detects and responds to different incidents. These pillars are **People**, **Process**, and **Technology**.

**People**, **Process**, and **Technology** coexist in a SOC environment. A team of professional individuals working on state-of-the-art security tools in the presence of proper processes is what makes a mature SOC environment.

In the upcoming tasks, we will discuss each of these pillars individually and examine how they are important parts of SOC.

**Answer the questions below**⸻⸻⸻⸻⸻

The SOC team discovers an unauthorized user is trying to log in to an account. Which capability of SOC is this?
**Answer:** Detection

What are the three pillars of a SOC?
**Answer:** People, Process, Technology

⸻⸻⸻⸻⸻

### Task 3 People

Regardless of the evolution of automating the majority of security tasks, the **People** in a SOC will always be important. A security solution can generate numerous red flags in a SOC environment, which can cause huge noise.

Imagine you are part of a fire brigade team and have centralized software where all the city’s fire alarms are integrated. Suppose you get many fire notifications at once, all for different places. When you get into those locations, your team finds out most of those were only triggered by excessive smoke from cooking. Eventually, all the efforts will be a waste of time and resources.

In a SOC, with security solutions in place without human intervention, you'll end up focusing on more irrelevant issues. There are always the **People** who help the security solution to identify truly harmful activities and enable a prompt response.

The **People** are known as the SOC team. This team has the following roles and responsibilities.

    - **SOC Analyst (Level 1):** Anything detected by the security solution would pass through these analysts first. These are the first responders to any detection. SOC Level 1 Analysts perform basic alert triage to determine if a specific detection is harmful. They also report these detections through proper channels.
    - **SOC Analyst (Level 2):** While Level 1 does the first-level analysis, some detections may require deeper investigation. Level 2 Analysts help them dive deeper into the investigations and correlate the data from multiple data sources to perform a proper analysis.
    - **SOC Analyst (Level 3)** Level 3 Analysts are experienced professionals who proactively look for any threat indicators and support in the incident response activities. The critical severity detection reported by Level 1 and Level 2 Analysts are often security incidents that need detailed responses, including containment, eradication, and recovery. This is where Level 3 analysts’ experience comes in handy.
    - **Security Engineer:** All analysts work on security solutions. These solutions need deployment and configuration. Security Engineers deploy and configure these security solutions to ensure their smooth operation.
    - **Detection Engineer:** Security rules are the logic built behind security solutions to detect harmful activities. Level 2 and 3 Analysts often create these rules, while the SOC team can sometimes also utilize the detection engineer role independently for this responsibility.
    - **SOC Manager:** The SOC Manager manages the processes the SOC team follows and provides support. The SOC Manager also remains in contact with the organization’s CISO (Chief Information Security Officer) to provide him with updates on the SOC team’s current security posture and efforts.

**Note**: The roles in the SOC team can increase or decrease depending on the size and criticality of the organizations.

**Answer the questions below**⸻⸻⸻⸻⸻

Alert triage and reporting is the responsibility of?
**Answer:** SOC Analyst (Level 1)

Which role in the SOC team allows you to work dedicatedly on establishing rules for alerting security solutions?
**Answer:** Detection Engineer

⸻⸻⸻⸻⸻

### Task 4 Process




`
}