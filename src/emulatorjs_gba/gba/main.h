#ifndef MAIN_Hheight
#define MAIN_H

#include "gba.h"

#define MAX_CREATURE 10

#define sprite_size 10

#define PLAYER_JUMP_DISTANCE 50

// TODO: Create any necessary structs

/*
* For example, for a Snake game, one could be:
*
* struct snake {
*   int heading;
*   int length;
*   int row;
*   int col;
* };
*
* Example of a struct to hold state machine data:
*
* struct state {
*   int currentState;
*   int nextState;
* };
*
*/

struct position {
    int row;
    int col;
};

struct player {
    //highest kill
    int highest_kill;
    //kill
    int kill;
    //health
    int health;
    //speed
    int speed;
    //position
    struct position *curr;
    //prev position
    struct position *prev;
    //gun
    struct gun *gun;
};

struct gun {
    //heading
    /*
    N : 0
    E : 1
    S : 2
    W : 3
    */
    int heading;
    //gun current position
    struct position *gun_curr;
    //gun previous position
    struct position *gun_prev;
    //gun width
    int gun_width;
    //gun height
    int gun_height;
    //bullet
    struct bullet *bullet;
};

struct bullet {
    //alive
    int alive;
    //velocity
    int vel;
    //size
    int size;
    //damage
    int damage;
    //bullet current position
    struct position *bullet_curr;
    //bullet previous position
    struct position *bullet_prev;
};

struct creature {
    //alive
    int alive;
    //health
    int health;
    //damage
    int damage;
    //speed
    int speed;
    //position
    struct position *curr;
    //prev position
    struct position *prev;
};

int collide(int x1, int y1, int w1, int h1, int x2, int y2, int w2, int h2);

#endif
