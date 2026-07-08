export default {
    id: 'kart-the-tech-filled-racing-game',
    title: 'Kart: The Tech-Filled Racing Game',
    category: 'Games',
    difficulty: 'Hard',
    tags: ['Game Design', 'System Design', 'UI/UX'],
    date: '2026-06-16T12:00:00',
    excerpt: 'Design decision and documentation for Kart: The Tech Filled Racing Game',
    content: `
## Lobby System

This system is built into GodotSteam which allow for seamless integration

⸻⸻⸻⸻⸻

## Multiplayer System

⸻⸻⸻⸻⸻

## AI Opponents System

___________________________

## UX 1: Fail Safe System

One of the first users feedback we got from the players is that they game doesn't work and crashes frequently.

<img src="/blogs/design-process/kart-the-tech-filled-racing-game/ux-1.png" alt="UX 1">

However, from our rigorous testing, we found that the game works fine and does not crash. Therefore, we decided to implement a fail safe system where the users have a pop up message said that "Please open Steam if this is your first time playing the game". Then our config file will save a boolean value that will persist and check if the player has opened Steam and owned the game before.

<img src="/blogs/design-process/kart-the-tech-filled-racing-game/ux-1-2.png" alt="UX 1.2">

This does not prevent the game from getting pirated but it does add a layer of security to prevent the game from crashing and create a better user experience for the players. In addition, the system also deters the players from pirating the game since they have to open Steam for the first time playing the game.
`}