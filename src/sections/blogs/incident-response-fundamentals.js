export default {
    id: 'incident-response-fundamentals',
    title: 'Incident Response Fundamentals',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['Incident Response'],
    date: '2026-02-07T12:00:00',
    excerpt: 'Write up and walkthrough of Incident Response Fundamentals room on TryHackMe.',
    content: `
This is a write up and walkthrough of the Incident Response Fundamentals room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Introduction to Incident Response

Imagine living in a heavily insecure street with many expensive things in your home. You must be thinking of having a security guard and a few CCTV cameras in your home. Hiding the expensive material inside a hidden underground room is a good idea if any intruder successfully enters the house. These are the things that you plan for the safety of your home, even before any attack occurs.

Besides these proactive measures, did you ever consider how things would work if someone successfully bypassed your external security mechanisms and gained access to your home? You must also take several other measures after your home is attacked.

Let’s take the above into the Digital Realm. You may have heard about a cyber attack on any organization that caused them to lose thousands of dollars. Several such cases are reported daily on the internet. These are referred to as **Cyber Security Incidents**. Just as in the scenario above, where you planned for the security of your home, cyber security incidents also need some planning and resources to avoid huge losses.

Incident Response handles an incident from its start to end. From deploying security in several areas to prevent incidents to fighting with them, and minimizing their impact, incident response is a thorough guideline.

This room will help you understand the critical concepts of incident response and give you a chance to solve your first incident practically.

**Learning Objectives**
    - Overview of what are incidents and their severity levels
    - Common types of incidents
    - Phases of Incident Response from SANS and NIST Frameworks
    - Tools for Incident Detection and Response along with the role of PlayBooks
    - Incident Response Plan

**Room Pre-Requisites**
    - Intro to Defensive Security

⸻⸻⸻⸻⸻

### Task 2 What are Incidents?

Several different processes run on your computing devices, e.g., laptops, mobile phones, etc. Some of these processes are interactive, meaning you perform the actions, e.g., playing a game or watching a video. There will also be some non-interactive processes running in the background that may not require your interaction with them. They are just necessary for your device. Both of these types of processes generate several events. Anything they do, an event is logged for what they have done.

Events are generated in huge numbers regularly. This is because many processes run on a device, each performing different routine tasks, generating numerous events. These events can sometimes point to something terrible going on in your device. How do we check these vast numbers of events and see if they point to some destructive activity? There are security solutions in place to solve this problem. These events are ingested into the security solutions as logs, and the security solutions can find harmful activities in them. This made our job way more easier! But wait a minute; the real challenge is after the security solution points these activities out.

So, when a security solution finds an event or group of events associated with a possible harmful activity, it triggers an alert. The security team then analyzes these alerts. Some of these alerts may be **False Positives**, while some would be **True Positives**. The alerts that point to something dangerous but are not harmful are referred to as false positives. In contrast, the alerts that point to something harmful and are actually dangerous are called true positives. You can get a better understanding of this from the example below:

**False positive:** A security solution raised an alert on a high amount of data being transferred from one system to an external IP address. Upon analyzing this alert, the security team found that the subject system was undergoing a backup process to a cloud storage service, which caused this. This is known as a false positive.
**True Positive:** A security solution raised an alert on a phishing attempt on one of the organization’s users. Upon analyzing this alert, the security team found that the email was a phishing email sent to this user to compromise the system. This is known as a true positive.

These true positive alerts are sometimes referred to as **Incidents**. Assuming the alert is now categorized as an incident, the next phase is to give a severity level to the incident. Imagine you are part of the security team and get multiple incidents simultaneously. Which incident would you choose first to respond to? This is where the idea of incident severity helps. Incidents can be categorized as low, medium, high, or critical based on the impact they can create. Critical Severity incidents are always the higher priority, followed by high severity, and so on.

**Answer the questions below**⸻⸻⸻⸻⸻

What is triggered after an event or group of events point at a harmful activity?
**Answer:** Alert

If a security solution correctly identifies a harmful activity from a set of events, what type of alert is it?
**Answer:** True Positive

If a fire alarm is triggered by smoke after cooking, is it a true positive or a false positive?
**Answer:** False Positive

⸻⸻⸻⸻⸻

### Task 3 Types of Incidents

People usually label every harmful activity associated with the digital world as a hacking attempt. This may be correct, but it is very generic in terms of cyber security. Security Incidents can be of different types. In the above tasks, we saw an example of a true positive alert, which became an incident after the analysis of the security team. This incident was related to the phishing email, which probably came with a malicious attachment. If downloaded into the system, this attachment may have harmful consequences. This is one type of incident. There are several other types of incidents. These types can occur independently or altogether within the same victim.

**Malware Infections:** Malware is a malicious program that can damage a system, network, or application. The majority of incidents are associated with malware infections.  There are different types of malware, each with a unique potential to cause damage. Malware infections are mostly caused by files that can be text, documents, executables, etc.
**Security Breaches:** Security Breaches arise when an unauthorized person gets access to confidential data (something we don’t want them to see or have).  Security Breaches are of the utmost importance as many businesses rely on their confidential data, which must only be accessible to authorized personnel.
**Data Leaks:** Data leaks are incidents in which confidential information of an individual or an organization is exposed to unauthorized entities. Many attackers use data leaks for reputational damage to their victims or use this technique to threaten their victims and get what they need from them. Unlike Security Breaches, data leaks can also be unintentionally caused by human errors or misconfigurations.
**Insider Attacks:** Incidents from within an organization are known as insider attacks. Think about a disgruntled employee infecting the whole network through a USB on his last day. This is an example of an insider attack. Someone within your organization intentionally initiating an attack comes under this category. These attacks can be hazardous, as an insider always has greater access to resources than an outsider.
**Denial Of Service Attacks:** Availability is one of the three pillars of cyber security. Defensive security solutions and people constantly find ways to protect information; they ensure that the data is available to the people simultaneously. This is because there is no point in protecting something that is unavailable to us. Denial of Service attacks, or DoS attacks, are incidents where the attacker floods a system/network/application with false requests, eventually making it unavailable to legitimate users. This happens due to the exhaustion of resources available to entertain the requests.

All these incidents have their unique potential to impact the victim negatively. These incidents can not be compared in terms of the severity of the impact they create. This is because a particular incident can be disastrous for one organization while it can cause minor damage to another. For example, XYZ Corp. may not be heavily impacted by a data leak as the information it stores can be useless to anybody else. However, it can undergo a massive loss in case of a Denial of Service (DoS) attack on its primary website, as its services depend on that website.

**Answer the questions below**⸻⸻⸻⸻⸻

A user's system got compromised after downloading a file attachment from an email. What type of incident is this?
**Answer:** Malware Infection

What type of incident aims to disrupt the availability of an application?
**Answer:** Denial of Service

⸻⸻⸻⸻⸻

### Task 4 Incident Response Process




`
}