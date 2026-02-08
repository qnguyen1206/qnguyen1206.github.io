export default {
    id: 'introduction-to-siem',
    title: 'Introduction to SIEM',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['SIEM'],
    date: '2026-02-08T12:00:00',
    excerpt: 'Write up and walkthrough of Introduction to SIEM room on TryHackMe.',
    content: `
This is a write up and walkthrough of the Introduction to SIEM room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Introduction

Security Information and Event Management system (SIEM) is the core security solution that a SOC analyst uses in the security operations center. In this room, we will learn how different devices in a network generate logs and why it's essential to have a centralized solution to collect, normalize, and correlate these logs.

**Learning Objectives**
- Understand the different types of log sources
- Identify the limitations of working with isolated logs
- Recognize the importance of a SIEM solution
- Explore the features of a SIEM solution
- Learn various types of log sources and their ingestion in the SIEM
- Understand the process behind alerting and alert analysis

**Answer the questions below**⸻⸻⸻⸻⸻

What does SIEM stand for?
**Answer:** Security Information and Event Management system

⸻⸻⸻⸻⸻

### Task 2 Logs Everywhere, Answers Nowhere

**Logs Everywhere**
Multiple devices in a network communicate with each other and, most of the time, with the Internet through a router. The image below shows an example of a simple network that comprises multiple Linux/Windows-based Endpoints, one data server, and one website.
<img src="/blogs/tryhackme/introduction-to-siem/41df28fd5cb0b3f4f8ee8616ed315d94.png">

These devices continuously generate logs of the activities that occur within them. We can also call these devices log sources. The logs they generate serve as a trail of all the activities and are extremely helpful for identifying malicious activities or general troubleshooting. These log sources are mainly divided into two categories, which are discussed below.

**1) Host-Centric Log Sources**
These log sources capture events that occurred within or related to the host. Devices that generate host-centric logs include Windows, Linux, servers, etc. Some examples of host-centric logs are:
- A user accessing a file
- A user attempting to authenticate.
- A process execution activity
- A process adding/editing/deleting a registry key or value.
- PowerShell execution

**2) Network-Centric Log Sources**
Network-related logs are generated when the hosts communicate with each other or access the internet to visit a website. Devices that generate network-centric logs are firewalls, IDS/IPS, routers, etc. Some examples of network-centric logs are:
- SSH connection
- A file being accessed via FTP
- Web traffic
- A user accessing the company's resources through VPN.
- Network file sharing Activity

Together, these host-centric and network-centric log sources constantly create numerous logs in a network. 

**Answers Nowhere**
Until now, it seems pretty straightforward that these log sources generate logs, we analyze them, and identify malicious activities. However, it's not that simple. It has some challenges. Some of them are discussed below:
- **Numerous Log Sources:** A network has many log sources, which generate hundreds of events per second. These logs are scattered across different devices, and examining the logs on each device one by one in case of an incident can be tedious.
- **No Centralization:** As logs reside on the machines on which they are generated,  you may need to connect with each log source via SSH, RDP, etc., to analyze logs from multiple log sources. This is very inefficient and can waste a lot of your valuable time during the investigations.
- **Limited Context:** Individual logs cannot tell the whole story of an activity. During any incident, the individual activities on different log sources may seem harmless. But if these logs are correlated, they can indicate a whole different story. For instance, you observed a file access event in a system, which is generally normal activity. However, if you correlate different log sources, you might come to know that this file was accessed by a user who accessed this machine through lateral movement after compromising another machine in the network.
- **Limited Analysis:** The log sources generate numerous logs per second, and analyzing all the logs from all the devices manually to identify any abnormal activity is nearly impossible for humans. Realistically, the analysts will miss a lot of important logs in between the analyses due to their huge number.
- **Format Issues:** Different log sources generate logs in various formats. Analysts need to know all these formats to analyze them, which can be extremely difficult, especially when dealing with numerous log sources in a network.

In the next task, we will learn about a powerful technology that can solve all these problems.

**Answer the questions below**⸻⸻⸻⸻⸻

Is Registry-related activity host-centric or network-centric?
**Answer:** Host-Centric

Is VPN-related activity host-centric or network-centric?
**Answer:** Network-Centric

⸻⸻⸻⸻⸻

### Task 3 Why SIEM?

In the previous task, we saw how different log sources generate numerous logs of various types and the challenges associated with analyzing those logs. So, how can we more efficiently manage this flood of data and extract valuable results?

This is where SIEM comes into play. Security Information and Event Management (SIEM) is a security solution that collects logs from various types of log sources, standardizes their format into a consistent one, correlates them, and detects malicious activities using detection rules.

**Features of SIEM**
The SIEM solution not only solves the issues we discussed in the previous task but also provides capabilities to enhance security operations. Let's discuss some of the core features that a SIEM provides.
    - **Centralized Log Collection**
    SIEM collects logs from all sources (endpoints, servers, firewalls, etc.) and centralizes them in one place. These logs are pulled through lightweight agents or APIs and populated into the SIEM solution. This solves the problem of jumping on every machine individually to analyze its logs.
    - **Normalization of Logs**
    Raw logs are of different formats and sizes. A Windows log does not look the same as a Linux log. Since a SIEM solution centralizes these logs in one place, it also ensures that all the logs are broken down into different fields and presented in one consistent format. Breaking down a log into several fields for ease of understanding is known as Parsing, and converting all the logs of various log sources into one consistent format is known as Normalization.
    - **Correlation of Logs**
    Individual logs are not very useful. SIEM correlates the logs of different sources and finds any relationship between them. This helps to identify malicious activity by analyzing its pattern. For instance, let's take a look at the following activities happening in a system during a 5-minute timeframe.
        - Haris logs in via VPN from an IP that he never has previously used
        - Haris accesses some documents on a shared drive
        - Haris executed a PowerShell script
        - The system makes an outbound network connection
    
Individually assessed, these activities look fine, but the SIEM solution would correlate these activities, which could point to a potential data exfiltration activity resulting from Haris's compromised VPN credentials.
    - **Real-time Alerting**
    SIEM detects malicious activities based on the rules it contains. Many rules come with a SIEM by default. However, analysts make new detection rules based on their requirements to mature future detections. When the conditions for these detection rules are satisfied, alerts are triggered, and the analysts are notified. Analysts can then investigate these alerts within the SIEM platform.
    - **Dashboards and Reporting**
    Dashboards are the most important components of any SIEM. SIEM presents the data for analysis after being normalized and ingested. The summary of this analysis is presented in the form of actionable insights with the help of multiple dashboards. Each SIEM solution comes with some default dashboards and provides an option for custom Dashboard creation. Below is some of the information that can be found in a dashboard:
        - Alert Highlights
        - System Notification
        - Health Alert
        - List of Failed Login Attempts
        - Events Ingested Count
        - Rules triggered
        - Top Domains Visited

An example of a dashboard made in Splunk SIEM is shown below:
<img src="/blogs/tryhackme/introduction-to-siem/6645aa8c024f7893371eb7ac-1753953252149.png">

There are several other features of a SIEM that we will not cover in detail in this room. These features include integration with threat intelligence feeds, extensive data retention, powerful searching capabilities, and many others. 

In the next task, we will discuss different log sources by examining their logs and see how they are ingested into a SIEM solution.

⸻⸻⸻⸻⸻

### Task 4 Log Sources and Ingestion



`
}