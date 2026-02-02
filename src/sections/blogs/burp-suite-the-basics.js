export default {
    id: 'burp-suite-the-basics',
    title: 'Burp Suite: The Basics',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['Burp Suite', 'Penetration Testing', 'Web Application'],
    date: '2026-02-03T12:00:00',
    excerpt: 'Write up and walkthrough of Burp Suite: The Basics room on TryHackMe.',
    content: `
This is a write up and walkthrough of the Burp Suite: The Basics room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Introduction

**Welcome to Burp Suite Basics!**

This particular room aims to understand the basics of the Burp Suite web application security testing framework. Our focus will revolve around the following key aspects:
1. A thorough introduction to Burp Suite.
2. A comprehensive overview of the various tools available within the framework.
3. Detailed guidance on the process of installing Burp Suite on your system.
4. Navigating and configuring Burp Suite.
We will also introduce the core of the Burp Suite framework, which is the Burp Proxy. It is important to note that this room primarily serves as a foundational resource for acquiring knowledge about Burp Suite. Subsequent rooms in the Burp module will adopt a more practical approach. Thus, this room will contain a greater emphasis on theoretical content. If you have not yet utilised Burp Suite, it is recommended to carefully read the provided information and actively engage with the tool. Experimentation is essential for grasping the fundamentals of this framework. Combining the information presented here with hands-on exploration will establish a strong foundation for utilising the framework. This will significantly assist you in future rooms.

⸻⸻⸻⸻⸻

### Task 2 What is Burp Suite

In essence, Burp Suite is a Java-based framework designed to serve as a comprehensive solution for conducting web application penetration testing. It has become the industry standard tool for hands-on security assessments of web and mobile applications, including those that rely on **a**pplication **p**rogramming **i**nterface**s** (APIs).

Simply put, Burp Suite captures and enables manipulation of all the HTTP/HTTPS traffic between a browser and a web server. This fundamental capability forms the backbone of the framework. By intercepting requests, users have the flexibility to route them to various components within the Burp Suite framework, which we will explore in upcoming sections. The ability to intercept, view, and modify web requests before they reach the target server or even manipulate responses before they are received by our browser makes Burp Suite an invaluable tool for manual web application testing.

Burp Suite is available in different editions. For our purposes, we will focus on the **Burp Suite Community Edition**, which is freely accessible for non-commercial use within legal boundaries. However, it's worth noting that Burp Suite also offers Professional and Enterprise editions, which come with advanced features and require licensing:
    1. **Burp Suite Professional** is an unrestricted version of Burp Suite Community. It comes with features such as:
        - An automated vulnerability scanner.
        - A fuzzer/brute-forcer that isn't rate limited.
        - Saving projects for future use and report generation.
        - A built-in API to allow integration with other tools.
        - Unrestricted access to add new extensions for greater functionality.
        - Access to the Burp Suite Collaborator (effectively providing a unique request catcher self-hosted or running on a Portswigger-owned server).
    In short, Burp Suite Professional is a highly potent tool, making it a preferred choice for professionals in the field.

    2. **Burp Suite Enterprise**, in contrast to the community and professional editions, is primarily utilized for continuous scanning. It features an automated scanner that periodically scans web applications for vulnerabilities, similar to how tools like Nessus perform automated infrastructure scanning. Unlike the other editions, which allow manual attacks from a local machine, Burp Suite Enterprise resides on a server and constantly scans the target web applications for potential vulnerabilities.
    
Due to requiring a license for the Professional and Enterprise editions, we will focus on the core feature set provided by the Burp Suite Community Edition.

**Note**: The provided demonstrations utilize Burp Suite for Windows. However, the functionality remains consistent with the version installed on the AttackBox.

**Answer the questions below**⸻⸻⸻⸻⸻

Which edition of Burp Suite runs on a server and provides constant scanning for target web apps?
**Answer:** Burp Suite Enterprise

Burp Suite is frequently used when attacking web applications and ______ applications.
**Answer:** Mobile

⸻⸻⸻⸻⸻



`
}