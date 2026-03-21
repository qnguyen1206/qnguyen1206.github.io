export default {
    id: 'window-washing-game-mdm',
    title: 'Window Washing Game MDM',
    category: 'Games',
    difficulty: 'Medium',
    tags: ['Game'],
    date: '2026-03-04T12:00:00',
    excerpt: 'MDM for Window Washing Game',
    content: `
This is an MDM for the game called Window Washing Game. Since the game is still in development, this MDM is subject to change.

⸻⸻⸻⸻⸻

**Jan. 30th, 2026**
- Create game concepts including basic mechanics and map layout.

**Jan. 31st, 2026**
- Create the basic online multiplayer using PurrNet by following the tutorial: <a href="https://www.youtube.com/watch?v=Fj2DeO31oF4">The Only Multiplayer Tutorial You’ll Need (Unity 2026)</a>.

**Feb. 6th, 2026**
- Separate tasks between the members using Trello.
- Find inspirations for the music.
- Create due dates and goals for February.

**Feb. 9th, 2026**
- Continuing the online multiplayer using the same tutorial was not helpful at all, appreciate the dev but the instructions are so bad I rather read the docs.
- Use ChatGPT to help fix syntax 😑(actually forgot c# syntax).
- Read the docs from <a href="https://purrnet.gitbook.io/docs">Introduction | PurrNet</a> and follow this tutorial <a href="https://www.youtube.com/watch?v=CGPwjSfuvv8&list=PLF6lFlLzb6CSO2MyOcUStQJ7YRuQmi58W&index=3">Easiest Unity Multiplayer Setup in 5 Minutes! (PurrNet)</a> for more information in order to make players spawn and despawn.
So tired 😮‍💨
- Ran into some random errors where I use the wrong toggle such that the movement script is enabled for other players instead of your own player. 😂
Whoopsie🤦
- Oh also ran into a problem where the player controller is clashing with each other so I have to turn off the generate c# script for it. Idk where the script is coming from so… 🤷
- Push to GitHub after fixing all the errors and being able to make the two players connect. 🥹🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳

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
Kinda bad due to the difference between the tutorial and what actually is needed 😞😞😞😞😞😞😞😞😞😞😞

**Feb. 20th, 2026**
- Implemented the create lobby and successfully spawn in the players through code.
Took sooooooo long😫The one who created the plug in kinda cool but also kinda bad at tutoring.
- Read through the dude code to make a custom script to allow passing through custom data that is needed for the game.

**Feb. 23rd, 2026**
- Redo the lobby because the tutorial guy code is 10 scripts tangled with each other, impossible to untangle.

**Feb. 24th, 2026**
- Test multiplayer with another group member, didn’t work out as expected.
- Was struggling to fix a bug where all the players are ready and the scene doesn’t change
- Use Claude Opus 4.5 to read through the code base including PurrLobby and PurrNet to allow the AI to understand the backend code.
- It fixed the problem after it figured out there is a timing mismatch due to the asynchronous nature of the game and possibly there is an instance mismatch where the script running the multiplayer was getting the wrong instance lobby object to listen on.
Have to revise the guy tutorial code with AI 5 times to fully understand this guy code with the AI and due to him not having a tutorial on this, in other words, have to work with AI to figure out how to properly use his code. Absolute mess but it works so pretty happy about it. 😁
- Test again and ran into another error with the player joining in as a client since apparently the players are already in the lobby when the game started and the code is calling the players to join again which causes conflicts.
- And again, with the help from Claude, the problem is fixed but there is another problem which is scene synchronization.
- Scene synchronization is addressed in the PurrLobby tutorial which can be found in YouTube: <a href="https://www.youtube.com/watch?v=2_15WJCEp7M&list=PLF6lFlLzb6CSO2MyOcUStQJ7YRuQmi58W&index=20">Networked Scene Management in Unity - PurrNet tutorial</a>.
- Another problem pops up when there is only one player spawning into the scene. Apparently, one of the older code I had was conflicting with the tutorial code in which it only spawn locally. After back and forth between the AI and the tutorials, it still is not working.
- Ran into firewall blockage
- Ran into NAT loopback error
- Finally figured out his code also has Steam Transport (aka Steamworks P2P) which instead of using your own server, it will go through Steam backend server and, it won’t have to deal with all the weird network error and jumping hoops of computer ports to make networking works due to security issues from both software (OS) and hardware (physical board) side of the computer.
Still don’t know why it is not in any of the tutorials. Like dude if you make a lobby and scene changes through Steam maybe do one for the Steamworks P2P too??? Like hello???
- Aahahahahahahahah, it works. A lot of issues had arrived during the development which mostly is the timing and synchronization issue but it is fixed thanks to Claude. 
Will have to take time to take a look at the code and fully understand what it does but for now, it works. AHAHAHAHAHHAHAHAHAHAAH, it’s 1:11 AM exactly but that’s ok.

**Feb. 25th, 2026**
- Found out there is an error during the update presentation where the players’ lobby still exists even though the host had already left the lobby.
- Also found out there is another error in the same event where the players are not able to connect to the host due to some unknown errors but expected to be related to the previous error.
- Try to refactor the code to eliminate unnecessary code
- Ran into scene switching error on client side
- Update the import PurrLobby because some import are outdated and being tampered
- Some default script doesn’t work with Steamworks P2P so with Claude help, Steamworks P2P is added into the plugin code and has to manipulate some assembly file (asmdef file) for Unity to compile without error.
- At least everything works now but gotta jump some hoops to get the effects and gameplay for waiting room that is needed

**Feb. 26th, 2026**
- Meeting with team to divide the tasks out again
- Test multiplayer with 4 people (it works)

**Mar. 2nd, 2026**
- Implemented building spawners
- Ran into some synchronization and instantiate problems
- Solved it using UnityProxy.InstantiateDirectly which a force bypass Instantiate on networking
- Also watch this tutorial <a href="https://www.youtube.com/watch?v=35N_nfny6Ec&list=PLF6lFlLzb6CSO2MyOcUStQJ7YRuQmi58W&index=6">Synchronizing in Unity (SyncVar) - PurrNet</a> to learn how to sync the number of building floors.
Welp, just figure out don’t need to use SyncVar
- Get the building wall spawning to work
Did learn that Unity doesn’t have add children to a game object but do have SetParent()
- Make a little touch for the buttons UI to make it look like window glare effect.
Have to run through so many iterations due to the overwhelming color it has on the button since the button is already too crowded with effects.
- Try to implement window spawning system
- Ran into problems where the windows are spawning with wrong scale and position due to conflict with parents and children’s position in addition to local vs. world transform
- Also ran into the problem with synchronization for windows layout since we want to make it procedural and dynamic
Consult Claude for different options for synchronization and also fixing some issues in the code for synchronization

**Mar. 4th, 2026**
- Fix a bug when merging causing from the change in name of prefabs
- Fix shader problem since there was no shader manager in the scene
- Test out the building spawner across computer and it works
Used Claude to find what functions and components need to plug-in in order to make the spawner happen. 😅
- Fix lobby UI so that it shows number of players’ ready / max players instead of number of players / max players

**Mar. 8th, 2026**
- Meeting with team to resolve art style conflict and catch up with progress

**Mar. 9th, 2026**
- Meeting with team to resolve some bug issues regarding the synchronization and UI update to resolve the art style conflict from last meeting
Still didn’t fix the bug so will do it outside of the meeting time

**Mar. 10th, 2026**
- Find out there is a bug for synchronization after changing how the windows are spawning.
- Try out SyncVar to see if it works
- SyncVar solved the problem
- Fixing a bug where the rig movement is not synchronize
Thanks to Claude, an initial suspect of why the bug is happening is because the rig is changing in local position and the rig is animating locally.
- That is the problem and the rig movement synchronization bug is fixed

**Mar. 11th, 2026**
- Fix issue with github branching for one of the team members 
- Start Character Design with teams
- Start working on game mechanics where the player can pick up the squeegee

**Mar. 13th, 2026**
- Fixed UI bug where player cards UI is not showing up
- Solved git conflict when merging
- Fixed UI bug where the room members use the room owners player cards

**Mar. 15th, 2026*
- Git doing Git thing and broke the game 🥲
Took a while but apparently, I broke the game 😐😐😐😐😐😐😐😐
Well, it fixed by the end but it took around an hour or so to fix everything
- Work on the new squeegee and new rig model
Still haven’t able to make the player detach from the squeegee
Some random stuff happen with the rig after applying rigid body
- Fix the hinge door to work properly
- Fix the rig to move lower to allow the player to get in
Ask Claude to help debug the problem where the player are not able to detach from the squeegee

**Mar. 16th, 2026**
- Update skybox and background for the game
Welp, have some fun easter eggs and bugs in the game but that’s fine 😆
- Help design the loading screen, settings screen, pause screen
- Help divide tasks among the group members
- Implement persistent data system using PlayerPrefs
PlayerPrefs works because it is simple and the game currently doesn’t need to store anything need security or complex data
- Fix bugs with the squeegee handling
Kinda painful since it just collision, collider and some random problems 🫩
OK, WHATEVER UNITY DO WITH COLLISION, PLEASE JUST FIX IT. WHY IS COLLISION HAVE MORE PROBLEMS THAN MULTIPLAYER?????
WHYYYYYYYYY????????????????????????????????????????????????????????????????????????????JUST WHY?????????????????????????????????????????? 🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬
- Fix the rotation bug where the player rotate on the y-axis after picking up or dropping down the squeegee
AHAHHAHAHAHAHHAAHAHAHAHAHAHAHA, after 4 hrs of working, it finally working, AHAHAHAHAHAAHAHAHAHAHAHAHAAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHHHAHAH
IT IS THE DAMPING THAT CAUSES THE PROBLEMS. WHO PUT THE DAMPING TO 0.05?????? GOT TO MOVE THAT TO 50. 🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳
- Add in mechanics that allow players to turn around using mouse
Well, there are more bugs related to collision so still hate it.
Yeah, after 6.5 hours with Claude and still haven’t able to fix the collision so gotta take a break before having mental break down or something
- Add in customization backend code to allow players to choose different player card skins
Take a break from collision 😒😒😒😒😒😒😒😒😒😒😒😒😒😒😒😒
- Fix bugs where after the players leave the lobby, the lobby doesn’t close in which create ghost lobbies

**Mar. 17th, 2026**
- Well, not a good day because something is wrong with the position and control scripts of the player and the squeegee. They are immune to gravity and force even though their rigid body is not position lock or rotation lock.
Guess Rigid Body and Gravity doesn’t go to work today 😞😞😞😞😞😞😞
HAHAHAHAHAHAHAHAHAHA, IT HAD BEEN 4 HOURS AND NOTHING WORKS AHAHAHAHAHAHAHAHAHAH 😵‍💫😵‍💫😵‍💫😵‍💫😵‍💫😵‍💫😵‍💫😵‍💫😵‍💫😵‍💫
- Still haven’t able to fix yet
Things that I had tried to fix this problem:
    - Revert changes and test each commit one by one
    - Read through each files to make sure every line of code is correct and every changes were not interfere with each other
    - Go back to the commit that works, download the git folder, extract it, and use it to overwrite everything in the head commit
    - Uninstall and reinstall the unity editor
    - Git reset hard to the correct commit
- Still haven’t fix it AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

**Mar. 18th, 2026**
- Create a new scene with minimal objects to test
- Figure out that the physic engine was turn off
HOLYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
AHAHAHHHHHHAHAHAHAHAHAHAHAHAHAHHAHAHHAHAHAHAHA
16 HOURS JUST TO FIND OUT THE PHYSICS IS TURN OFF
AHHAAHHAHAHAHHHHHHHAHAHAHAHAHAHAHAHAHAHAAAAAAA

`
}