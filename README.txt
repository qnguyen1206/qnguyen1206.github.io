Description: A CS 2110 Project using C language to make a simple game to run on Game Boy Emulator to learn about graphics and frames rates.

Game Objective: Survive for 60s and try to kills as much Creatures as possible (compete for the highest kills)

Descriptions: 
	- Player has 3 lives
	- Creatures touch players, player lives reduce by 1
	- Player can kill the player by hitting the bullet onto the creature
	- Only one bullet can be on screen at a time, but Player can control where the bullet is going
	- Bullet will be destroy if come in contact with walls or creatures
	- Gun will be reload after the bullet is destroy
	- New Creatures (random from 1 to 5) spawn every 2 seconds
	- Creatures will evolve if player jump/teleport too much (> 3) or if there are 20s left

Controls: 
	Enter      | (START)                 | start the game
	Arrow Keys | (LEFT, RIGHT, UP, DOWN) | moving
	A, S       | (L, R)                  | turning the gun and control the bullet
	X          | (A)                     | shooting
	Z          | (B)                     | jumping/teleporting
	BACKSPACE  | (RESET)                 | back to main menu

Current Known Bugs - These bugs can sometimes cause tearing because of draw and undraw:
	- Creatures can spawn on top of each other
	- Creatures does not have collision on themselves, in other words, one creatures can walk on top of another creatures
	- Creatures can walk through wall

How to run:
Step 1: Download from GitHub into Zip file
Step 2: Run App.gba file with mGBA application