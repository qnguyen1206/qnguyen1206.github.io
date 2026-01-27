export default {
    id: 'port-scanner-tool',
    title: ' Basic Port Scanner Tool in Python',
    category: 'Tools',
    difficulty: 'Easy',
    tags: ['Python', 'Tools'],
    date: '2026-01-26T12:00:00',
    excerpt: 'How to create a basic port scanner tool in Python',
    content: `
Since port scanner is a common tool used in penetration testing and there are a lot of famous port scanner tools out there such as Nmap, Masscan, etc., it is a good idea to learn how they work under the hood and how was one created.

**DISCLAIMER:** I do not condome any illegal activities. This tool is for educational purposes only. Do not use it for any illegal activities.

Before we start, there are several topics that you should familiar with:
- Networking
- Socket Programming
If you are not familiar with these topics, I would recommend you to read up on them before continuing.

⸻⸻⸻⸻⸻

## What is a Port Scanner?
A port scanner is a tool that is used to scan a host for open ports.

⸻⸻⸻⸻⸻

## How does a Port Scanner work?
A port scanner works by sending a packet to a specific port on a host.
- If the port is open, the host will respond to the packet. The port scanner will then know that the port is open.
- If the port is closed, the host will not respond to the packet. The port scanner will then know that the port is closed.

⸻⸻⸻⸻⸻

Let's get started!

First, we need to import the necessary libraries including \`socket\` and \`sys\` libraries.

\`\`\`
import socket
import sys
\`\`\`

Next, we will create a function to scan target ip and ports.

\`\`\`
def port_scanner_v4(target_host, port):
    try:
        # Create a socket using IPv4 and TCP
        # AF_INET --> IPv4
        # SOCK_STREAM --> TCP
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Set a timeout for the connection attempt
        s.settimeout(1)

        # Try to connect to the target host and port
        result = s.connect_ex((target_host, port))
        if result == 0:
            print(f"Port {port} is open")
        else:
            print(f"Port {port} is closed")

    except socket.gaierror:
        print("Hostname could not be resolved.")
        sys.exit

    except socket.error:
        print("Server not responding.")
        sys.exit()
\`\`\`

The function above will scan a specific port on a target host using IPv4 (\`socket.AF_INET\`) and TCP (\`socket.SOCK_STREAM\`).

The \`socket.settimeout(1)\` is used to set a timeout for the connection attempt. This is to prevent the program from hanging indefinitely if the host is not responding.

The \`socket.connect_ex((target_host, port))\` is used to connect to the target host and port. The \`connect_ex\` method is used instead of \`connect\` because it will return an error code instead of raising an exception.

This is all for the core of this tool. You can further improve this tool by adding more features such as IPv6 support, UDP support, etc.

Below is the final code for the tool that I have created in which the user can specify which protocol to use:

\`\`\`
import sys
import socket

def port_scanner_v4(target_host, port):
    try:
        # Create a socket using IPv4 and TCP
        # AF_INET --> IPv4
        # SOCK_STREAM --> TCP
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Set a timeout for the connection attempt
        s.settimeout(1)

        # Try to connect to the target host and port
        result = s.connect_ex((target_host, port))
        if result == 0:
            print(f"Port {port} is open")
        else:
            print(f"Port {port} is closed")

    except socket.gaierror:
        print("Hostname could not be resolved.")
        sys.exit

    except socket.error:
        print("Server not responding.")
        sys.exit()

def port_scanner_v6(target_host, port):
    try:
        # Create a socket using IPv6 and TCP
        # AF_INET6 --> IPv6
        # SOCK_STREAM --> TCP
        s = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)

        # Set a timeout for the connection attempt
        s.settimeout(1)

        # Try to connect to the target host and port
        result = s.connect_ex((target_host, port))
        if result == 0:
            print(f"Port {port} is open")
        else:
            print(f"Port {port} is closed")

    except socket.gaierror:
        print("Hostname could not be resolved.")
        sys.exit

    except socket.error:
        print("Server not responding.")
        sys.exit()


target_ip = ""
while True:
    print("1. IPv4, TCP scan")
    print("2. IPv6, TCP scan")
    scan_choice = int(input("Enter the scan choice: "))

    target_ip = input("Enter the IP address to scan: ")

    target__start_port = int(input("Enter the start port to scan: "))
    target_end_port = int(input("Enter the end port to scan: "))

    match scan_choice:
        case 1:
            for port in range(target__start_port, target_end_port + 1):
                port_scanner_v4(target_ip, port)
        case 2:
            for port in range(target__start_port, target_end_port + 1):
                port_scanner_v6(target_ip, port)

    run_again = input("Do you want to run again? (y/n)")
    while True:
        if run_again == "y" or run_again == "n":
            break
        else:
            print("Invalid input. Please try again.")
            run_again = input("Do you want to run again? (y/n)")
    
    if run_again == "n":
        sys.exit()
\`\`\`

⸻⸻⸻⸻⸻

## Conclusion

Port scanner is a very simple yet it is a very powerful and necessary tool for penetration testing.

I hope you have learnt something new from this write up.

Thank you for reading and happy hacking!
`
}