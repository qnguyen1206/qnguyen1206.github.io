// MYTHICAL HUNT — SPECIES & HABIT FIELD JOURNAL
// Edit evidence cards here. The story and record choices are in dialogue.js.
//
// ENTRY FIELDS
//   species:     the creature this note describes.
//   region:      its world in regions.js; null means not yet assigned.
//   kind:        "species" for identification, "habit" for behavior / abilities.
//   title:       the short heading displayed in the journal.
//   description: the actual observation; leave blank while it is unfinished.
//   status:      "ready" = can be recorded; "draft" = unfinished placeholder.
//
// HOW TO FINISH A RESERVED ENTRY
//   1. Fill in its title and description below.
//   2. Write the matching observation scene in dialogue.js.
//   3. Set status to "ready".
//   4. Add evidence: "entry_id" to that scene's explicit record choice.
// Only ready entries count toward journal completion. Drafts are not evidence.
// Keep entry IDs stable so saved journals and dialogue choices still match.
//
// Goblin information is based on the GDD. All other species intentionally have
// blank descriptions for you to fill in. No placeholder behavior is invented.

window.MYTHICAL_HUNT_EVIDENCE = {
  // ========================================================================
  // TREE OF LIFE — GOBLIN (READY TO OBSERVE)
  // The mine is a subarea of this world, not a separate species assignment.
  // The Goblin Queen is recorded under Goblin, not as a new species.
  // ========================================================================

  goblin_species: {
    species: "Goblin",
    region: "forest",
    kind: "species",
    title: "Goblin identification",
    description: "Observed features include cloven feet, a naturally hunched back, uneven facial features, one unusually large eye, and rough, uneven brownish skin.",
    status: "ready",
  },

  goblin_groups: {
    species: "Goblin",
    region: "forest",
    kind: "habit",
    title: "Group living",
    description: "Several Goblins share the underground space. Goblins live in groups rather than only as solitary individuals.",
    status: "ready",
  },

  goblin_mining: {
    species: "Goblin",
    region: "forest",
    kind: "habit",
    title: "Mining and tool use",
    description: "Goblins use tools while working in the mine. Tool use and mining are part of the work observed in their underground home.",
    status: "ready",
  },

  goblin_red_hat: {
    species: "Goblin",
    region: "forest",
    kind: "habit",
    title: "Red-hat invisibility",
    description: "A Goblin became invisible while wearing its red hat. The observation does not establish a duration, a cooldown, or other limits to the ability.",
    status: "ready",
  },

  goblin_daylight: {
    species: "Goblin",
    region: "forest",
    kind: "habit",
    title: "Daytime shelter",
    description: "Observed: the Goblins remained underground during daylight. Existing Goblin notes warn that sunlight turns them to stone. No Goblin was exposed to sunlight to test the warning, and no reversal was observed or established.",
    status: "ready",
  },

  goblin_shapeshift: {
    species: "Goblin",
    region: "forest",
    kind: "habit",
    title: "Shapeshifting lure",
    description: "Observed: a Goblin changed shape and beckoned the Warden farther into a passage. Existing Goblin notes describe shapeshifting used to lure people into traps. The Warden did not follow or test a trap.",
    status: "ready",
  },

  goblin_queen: {
    species: "Goblin",
    region: "forest",
    kind: "habit",
    title: "The Goblin Queen",
    description: "The Goblin Queen sits on a throne underground and leads a group of miner Goblins. This observation records leadership within Goblin society without a confrontation.",
    status: "ready",
  },

  // ========================================================================
  // TREE OF LIFE — CHUPACABRA (FILL IN LATER)
  // Scene to edit: chupa_gate in dialogue.js.
  // ========================================================================

  chupa_species: {
    species: "Chupacabra",
    region: "forest",
    kind: "species",
    title: "Chupacabra · Species description",
    description: "", // TODO: Write identifying features after authoring the encounter.
    status: "draft",
  },

  chupa_habit: {
    species: "Chupacabra",
    region: "forest",
    kind: "habit",
    title: "Chupacabra · Habit observation",
    description: "", // TODO: Write what the Warden can observe this species doing.
    status: "draft",
  },

  // ========================================================================
  // TREE OF LIFE — TROLL (FILL IN LATER)
  // Scene to edit: troll_gate in dialogue.js.
  // ========================================================================

  troll_species: {
    species: "Troll",
    region: "forest",
    kind: "species",
    title: "Troll · Species description",
    description: "", // TODO: Write identifying features.
    status: "draft",
  },

  troll_habit: {
    species: "Troll",
    region: "forest",
    kind: "habit",
    title: "Troll · Habit observation",
    description: "", // TODO: Write a behavior observation.
    status: "draft",
  },

  // ========================================================================
  // TREE OF LIFE — GOLEM (FILL IN LATER)
  // Scene to edit: golem_gate in dialogue.js.
  // ========================================================================

  golem_species: {
    species: "Golem",
    region: "forest",
    kind: "species",
    title: "Golem · Species description",
    description: "", // TODO: Write identifying features.
    status: "draft",
  },

  golem_habit: {
    species: "Golem",
    region: "forest",
    kind: "habit",
    title: "Golem · Habit observation",
    description: "", // TODO: Write a behavior observation.
    status: "draft",
  },

  // ========================================================================
  // TREE OF LIFE — ERLKING (FILL IN LATER)
  // Scene to edit: erlking_gate in dialogue.js.
  // ========================================================================

  erlking_species: {
    species: "Erlking",
    region: "forest",
    kind: "species",
    title: "Erlking · Species description",
    description: "", // TODO: Write identifying features.
    status: "draft",
  },

  erlking_habit: {
    species: "Erlking",
    region: "forest",
    kind: "habit",
    title: "Erlking · Habit observation",
    description: "", // TODO: Write a behavior observation.
    status: "draft",
  },

  // ========================================================================
  // REALM OF THE DEAD — JIANGSHI (FILL IN LATER)
  // Scene to edit: jiangshi_gate in dialogue.js.
  // ========================================================================

  jiangshi_species: {
    species: "Jiangshi",
    region: "dead",
    kind: "species",
    title: "Jiangshi · Species description",
    description: "", // TODO: Write identifying features.
    status: "draft",
  },

  jiangshi_habit: {
    species: "Jiangshi",
    region: "dead",
    kind: "habit",
    title: "Jiangshi · Habit observation",
    description: "", // TODO: Write a behavior observation.
    status: "draft",
  },

  // ========================================================================
  // THE DEEP SEA — MERMAID (FILL IN LATER)
  // Scene to edit: mermaid_gate in dialogue.js.
  // ========================================================================

  mermaid_species: {
    species: "Mermaid",
    region: "sea",
    kind: "species",
    title: "Mermaid · Species description",
    description: "", // TODO: Write identifying features.
    status: "draft",
  },

  mermaid_habit: {
    species: "Mermaid",
    region: "sea",
    kind: "habit",
    title: "Mermaid · Habit observation",
    description: "", // TODO: Write a behavior observation.
    status: "draft",
  },

  // ========================================================================
  // THE DEEP SEA — LEVIATHAN (FILL IN LATER)
  // Scene to edit: leviathan_gate in dialogue.js.
  // ========================================================================

  leviathan_species: {
    species: "Leviathan",
    region: "sea",
    kind: "species",
    title: "Leviathan · Species description",
    description: "", // TODO: Write identifying features.
    status: "draft",
  },

  leviathan_habit: {
    species: "Leviathan",
    region: "sea",
    kind: "habit",
    title: "Leviathan · Habit observation",
    description: "", // TODO: Write a behavior observation.
    status: "draft",
  },

  // ========================================================================
  // UNASSIGNED REGION — KITSUNE (FILL IN LATER)
  // Scene to edit: kitsune_notes in dialogue.js, currently at the base desk.
  // The GDD does not assign a world. Replace null only when you choose one.
  // ========================================================================

  kitsune_species: {
    species: "Kitsune",
    region: null, // TODO: Choose its region before writing a travel encounter.
    kind: "species",
    title: "Kitsune · Species description",
    description: "", // TODO: Write identifying features.
    status: "draft",
  },

  kitsune_habit: {
    species: "Kitsune",
    region: null, // TODO: Match the region chosen for the species entry above.
    kind: "habit",
    title: "Kitsune · Habit observation",
    description: "", // TODO: Write a behavior observation.
    status: "draft",
  },
};
