export default {
    id: 'the-game-challenge',
    title: 'The Game Challenge',
    category: 'TryHackMe',
    difficulty: 'Easy',
    tags: ['Penetration Testing'],
    date: '2026-01-29T12:00:00',
    excerpt: 'Write up of The Game Challenge room on TryHackMe.',
    content: `
This is a write up for the The Game Challenge room on TryHackMe.

⸻⸻⸻⸻⸻

Cipher has gone dark, but intel reveals he’s hiding critical secrets inside Tetris, a popular video game. Hack it and uncover the encrypted data buried in its code.

*This challenge was originally a part of the Hackfinity Battle 2025 CTF Event.*

**Answer the questions below**⸻⸻⸻⸻⸻

What is the flag?
**Answer:** THM{I\_CAN_READ_IT_ALL}
**Reason:** In this challenge, I am using Windows 11 computer and Windows PowerShell to complete the challenge.
1. Downloaded the file associated with the tasks.
2. Extract the file and find the file named "Tetris".
3. Run Windows PowerShell.
4. Run command \`Select-String -Path "C:\\Users\\kylen\\Downloads\\Tetrix.exe-1741979048280\\Tetrix.exe" -Patter "THM"\`
5. Wait for the command to run and the flag will be at the bottom of the output.
`
}