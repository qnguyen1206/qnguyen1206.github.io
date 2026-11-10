# Region images

Place your region images in this folder. Suggested names:

- `warden-base.jpg`
- `tree_of_life.jpg`
- `root-mine.jpg`
- `realm-of-the-dead.jpg`
- `deep-sea.jpg`
- `castle-in-the-sky.jpg`
- `land-of-fire.jpg`
- `mummelseekonig-swamp.jpg`

After adding an image, open `../../data/regions.js` and set its path, for example:

`forest: { name: "Tree of Life", image: "assets/regions/tree_of_life.jpg" }`

The current forest setup in `../../data/regions.js` uses:

- `assets/forest.jpg`: sunlit forest clearings and daylight shelter observations.
- `assets/forest-1.jpg`: dense woodland for creature encounters.
- `assets/forest-2.jpg`: the Goblin trail and identification observation.
- `assets/regions/tree_of_life.jpg`: the Tree of Life field maps.

Change `forest.image` for the default story background, or a path under
`forest.sceneImages` for one particular scene. Scene IDs match `dialogue.js`.
Use `forest.imagePositions` to adjust a photo's crop (for example, `center bottom`).
The title and ending use `forest.jpg`, selected in `../../data/content-layer.css`.
All files in `LMC4730/assets` are copied into the production build automatically.

## Story and field notes

Creature portraits are configured by scene under `MYTHICAL_HUNT_CREATURE_ART`
in `../../data/regions.js`: `goblin.jpg` for individual observations,
`goblin-1.jpg` for underground groups, and `chupa.jpg` for the Chupacabra page.
These illustrations do not unlock unfinished evidence. They are displayed whole,
without cropping or removing source markings.

- Edit every scene's narration, speakers, choices, and destinations in `../../data/dialogue.js`.
- Edit species descriptions and habits in `../../data/evidence.js`.
- Non-Goblin entries have a blank description and `status: "draft"`. They are visible as notes pending, not collectible evidence.
- To finish one: write the observation scene, fill the evidence description, change its status to `"ready"`, and add its evidence ID to a record choice. See the Goblin scenes as examples.
- Keep the `next` destination on that choice so the player can return and keep exploring. Kitsune has no assigned region until you choose one; sky, fire, and swamp species are intentionally unassigned.

Run `npm run test:lmc4730` from the repository root to check routes, evidence IDs, and image paths.

This version uses new field-journal saves. The older story's saves are left untouched but are not imported, because those clues do not describe species or habits.

