// REGION ART
// Put image files in LMC4730/assets (or assets/regions), then set their paths below.
// Paths are relative to LMC4730/index.html, not to this data file.
// Leave image as an empty string to keep the game's current illustrated background.
window.MYTHICAL_HUNT_REGIONS = {
  base:   { name: "Warden Base / Gate Nexus", image: "" },
  forest: {
    name: "Tree of Life",

    // Sunlit forest: default for forest clearings and shelter observations.
    image: "assets/forest.jpg",

    // Keep the trail visible when this portrait photo fills a wide screen.
    imagePositions: {
      "assets/forest-2.jpg": "center bottom"
    },

    // Each scene keeps the same background through dialogue and on replay.
    // A scene not listed here uses the default image above.
    sceneImages: {
      // The Tree of Life overview / search-zone map.
      tree_regions: "assets/regions/tree_of_life.jpg",

      // Forest paths and species identification.
      forest: "assets/forest-2.jpg",
      goblin_sighting: "assets/forest-2.jpg",

      // Dense woodland: Goblin observation sites and future species entries.
      goblin_group: "assets/forest-1.jpg",
      goblin_cap: "assets/forest-1.jpg",
      goblin_shapeshift: "assets/forest-1.jpg",
      chupa_gate: "assets/forest-1.jpg",
      troll_gate: "assets/forest-1.jpg",
      golem_gate: "assets/forest-1.jpg",
      erlking_gate: "assets/forest-1.jpg"
    }
  },
  cave:   { name: "Root-Mine",                image: "" },
  dead:   { name: "Realm of the Dead",        image: "" },
  sea:    { name: "The Deep Sea",             image: "" },
  sky:    { name: "Castle in the Sky",        image: "" },
  fire:   { name: "The Land of Fire",         image: "" },
  swamp:  { name: "Mummelseekonig Swamp",     image: "" }
};

