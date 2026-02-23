export default {
    id: 'window-washing-game-mdm',
    title: 'Window Washing Game MDM',
    category: 'Games',
    difficulty: 'Medium',
    tags: ['Game'],
    date: '2026-02-10T12:00:00',
    excerpt: 'MDM for Window Washing Game',
    content: `
This is an MDM for the game called Window Washing Game. Since the game is still in development, this MDM is subject to change.

⸻⸻⸻⸻⸻

**Jan. 30th, 2026**
    - Create game concepts including basic mechanics and maps layout

**Jan. 31st, 2026**
    - Create the basic online multiplayer using PurrNet by following the tutorial: <a href="https://www.youtube.com/watch?v=Fj2DeO31oF4">The Only Multiplayer Tutorial You’ll Need (Unity 2026)</a>

**Feb. 6th, 2026**
    - Separate tasks between the members using Trello
    - Find inspirations for the music
    - Create due date and goals for February

**Feb. 9th, 2026**
    - Continuing the online multiplayer using the same tutorial was not helpful at all, appreciate the dev but the instructions are so bad I rather read the docs.
    - Use ChatGPT to help fix syntax 😑(actually forgot c# syntax)
    - Read the docs from <a href="https://purrnet.gitbook.io/docs">Introduction | PurrNet</a> and follow this tutorial <a href="https://www.youtube.com/watch?v=CGPwjSfuvv8&list=PLF6lFlLzb6CSO2MyOcUStQJ7YRuQmi58W&index=3">Easiest Unity Multiplayer Setup in 5 Minutes! (PurrNet)</a> for more information in order to make player spawn and despawn
Tired af 😮‍💨
    - Ran into some random errors where I use the wrong toggle such that the movement script is enabled for other players instead of your own player. 😂
Brain dmg 🤦
    - Oh also ran into a problem where the player controller is clashing with each other so I have to turn off the generate c# script for it. Idk where the script is coming from so… 🤷
    - Push to GitHub after fixing all the errors and able to make the two players connect 🥹🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳

**Feb. 10th, 2026**
    - Ummm...forgot to actual push to GitHub, fix it thou 😅, everything is good.

**Feb. 16th, 2026**
    - Pull from GitHub to make sure everything is up-to-date with the team.
    - Start creating a lobby scene to make sure the multiplayer system can work across the internet (hopefully without leaking other people's IP address).

**Feb. 17th, 2026**
    - Start working on the lobby system logistics including create lobby and join lobby.
    - Have to use ChatGPT and Google to help with syntax, fixing bugs and improving some coding habits such as singleton and fall back errors.
    - Able to get the IP address and correctly place them inside the Network Manager Component to allow the player to host a lobby.
    - Need help from ChatGPT to find and fix some errors along the way including some missing references, missing objects assignment and syntax errors. 🫠
    - Push to Git

**Feb. 18th, 2026**
    - Add a custom script for the namespace in PurrNet to allow you to add and remove spawn points through script instead of drag and drop.
    - Follow this tutorial <a href="https://www.youtube.com/watch?v=fIBAlOJxqtg&list=PLF6lFlLzb6CSO2MyOcUStQJ7YRuQmi58W&index=17">Unity Easy Lobby setup with Multiplayer (Steam, Unity Lobbies, Database) - PurrNet</a> to create a lobby and connect it to Steam.
Kinda suck due to the difference between the tutorial and what actually is needed 😞😞😞😞😞😞😞😞😞😞😞

**Feb. 20th, 2026**
    - Implemented the create lobby and successfully spawn in the players through code.
Took so dam long😫The one who created the plug in kinda cool but also kinda suck.
    - Read through the dude code to make a custom script to allow passing through custom data that is needed for the game.


`
}