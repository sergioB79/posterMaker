/**
 * 15 Artistic "Remix" hybrid styles.
 * Each blends two design traditions into something new.
 * NO artist names — descriptions only (avoids content-policy blocks).
 */

export interface RemixPreset {
  id: string;
  name: string;
  shortDesc: string;
  styleElements: string;
  promptDescription: string;
}

export const remixes: RemixPreset[] = [
  {
    id: "neo-nouveau-propaganda",
    name: "Neo-Nouveau Propaganda",
    shortDesc: "Flowing organic elegance meets bold street activism",
    styleElements: "Ornate floral borders, melting organic typography, high-contrast stencil portraiture",
    promptDescription:
      "Neo-Nouveau Propaganda style: the organic flowing elegance of Art Nouveau meets the aggressive high-contrast messaging of modern street activism. Ornate floral borders frame melting organic typography and high-contrast stencil portraiture. Decorative curves juxtaposed with bold protest-poster directness.",
  },
  {
    id: "kinetic-swiss",
    name: "Kinetic Swiss",
    shortDesc: "Rigid mathematical grids broken by hand-cut energy",
    styleElements: "Strict grid alignment, bold primary colors, rough torn-paper silhouettes",
    promptDescription:
      "Kinetic Swiss style: the rigid mathematical precision of the Swiss grid is intentionally 'broken' by the jagged hand-cut energy of mid-century cinema. Strict grid alignment with bold primary colors, but the imagery uses intentionally rough torn-paper silhouettes that disrupt the order.",
  },
  {
    id: "machine-diva",
    name: "The Machine Diva",
    shortDesc: "Sleek Art Deco structures with whimsical Belle Époque figures",
    styleElements: "Airbrushed gradients, metallic geometric textures, joyful fluid character illustrations",
    promptDescription:
      "The Machine Diva style: sleek aerodynamic Art Deco structures inhabited by whimsical energetic figures from the Belle Époque era. Airbrushed gradients blend with metallic geometric textures, while joyful fluid character illustrations add warmth and movement to the machine-age geometry.",
  },
  {
    id: "psychedelic-constructivism",
    name: "Psychedelic Constructivism",
    shortDesc: "Avant-garde geometry rendered in vibrating acid colours",
    styleElements: "Photomontage, heavy diagonal axes, swirling liquid typography",
    promptDescription:
      "Psychedelic Constructivism style: the radical diagonal geometry of the avant-garde rendered in vibrating clashing acid colors. Photomontage elements with heavy diagonal axes, combined with illegible swirling liquid typography. Industrial structure meets optical color vibration.",
  },
  {
    id: "minimalist-absurdism",
    name: "Minimalist Absurdism",
    shortDesc: "Stark object metaphor with dark surreal wit",
    styleElements: "Deep black backgrounds, one central odd object, raw handwritten notes",
    promptDescription:
      "Minimalist Absurdism style: a single stark product metaphor delivered with dark surreal conceptual wit. Deep black backgrounds featuring one central unexpected object, accompanied by raw handwritten notes. Maximum conceptual impact through radical simplicity.",
  },
  {
    id: "architectural-grunge",
    name: "Architectural Grunge",
    shortDesc: "Wall-to-wall typography physically decaying",
    styleElements: "Overlapping wood-block type, distressed textures, no white space",
    promptDescription:
      "Architectural Grunge style: massive wall-to-wall typography that feels like it is physically decaying or being shredded. Overlapping wood-block type with heavily distressed textures and a total lack of traditional white space. Typography as architecture, crumbling and raw.",
  },
  {
    id: "pop-culture-puppet",
    name: "The Pop-Culture Puppet",
    shortDesc: "Eastern woodblock themes with 60s vibrant line-work",
    styleElements: "Bold black outlines, neon halo motifs, surrealist collage elements",
    promptDescription:
      "The Pop-Culture Puppet style: traditional Eastern woodblock themes mixed with the vibrant flat psychedelic line-work of the 1960s. Bold black outlines with neon halo motifs and surrealist collage elements. East meets West in a colorful graphic fusion.",
  },
  {
    id: "ghost-grid",
    name: "The Ghost Grid",
    shortDesc: "Invisible layout using negative space and visual puns",
    styleElements: "Heavy use of negative space, merged icons, sans-serif clarity",
    promptDescription:
      "The Ghost Grid style: an invisible perfect layout that uses negative space and visual puns to tell a story without many lines. Heavy use of negative space where shapes merge with background to create dual-meaning icons. Sans-serif clarity and elegant restraint.",
  },
  {
    id: "cabaret-punk",
    name: "Cabaret Punk",
    shortDesc: "1890s nightlife silhouettes with 1990s glitch distortion",
    styleElements: "Flat silhouettes, blurred edges, broken photocopier typography",
    promptDescription:
      "Cabaret Punk style: dark atmospheric silhouettes from 1890s nightlife captured with the raw glitchy distortion of the 1990s. Flat silhouettes with blurred edges and broken typography that looks like a photocopier error. Moody, theatrical, and deliberately degraded.",
  },
  {
    id: "geometric-folk-art",
    name: "Geometric Folk Art",
    shortDesc: "Playful narrative illustrations with rigid modernist geometry",
    styleElements: "Bright flat colors, blocky characters, visual wit puzzles",
    promptDescription:
      "Geometric Folk Art style: a mix of playful narrative illustrations and rigid modernist geometric shapes. Bright flat colors with blocky charming characters and visual wit puzzles. Folk storytelling wrapped in geometric precision.",
  },
  {
    id: "techno-nouveau",
    name: "Techno-Nouveau",
    shortDesc: "Whiplash lines inspired by circuit boards and industrial pipes",
    styleElements: "Copper/silver gradients, gear-made circular halos, flowing machine-like forms",
    promptDescription:
      "Techno-Nouveau style: sinuous whiplash Art Nouveau lines that are inspired not by flowers but by circuit boards and industrial pipes. Copper and silver gradients, ornate circular halos made of gears, and flowing machine-like hair and forms. Organic curves reinterpreted through technology.",
  },
  {
    id: "lucid-shadow",
    name: "The Lucid Shadow",
    shortDesc: "One bold icon with stark black-and-white Swiss contrast",
    styleElements: "Extreme scaling, high-contrast B&W, single splash of color",
    promptDescription:
      "The Lucid Shadow style: the one-bold-icon approach to advertising rendered with stark brutal black-and-white Swiss Modernism contrast. Extreme scaling with one very large item and one very small, high-contrast B&W photography, and a single strategic splash of color.",
  },
  {
    id: "constructivist-comic",
    name: "Constructivist Comic",
    shortDesc: "Propaganda layouts telling lighthearted comic stories",
    styleElements: "Red/black/white palettes, speech bubbles in geometric shapes, photomontage characters",
    promptDescription:
      "Constructivist Comic style: heavy-duty propaganda layouts used to tell lighthearted narrative comic stories. Bold red/black/white palettes with speech bubbles integrated into geometric shapes and photomontage characters. Revolutionary form meets playful content.",
  },
  {
    id: "vibrant-void",
    name: "The Vibrant Void",
    shortDesc: "Minimalist symbol fusion with neon vibrating colours",
    styleElements: "Two-symbol fusions, clashing high-saturation colors, hidden optical illusions",
    promptDescription:
      "The Vibrant Void style: maximum meaning minimum means philosophy executed with neon vibrating psychedelic colors. Two-symbol fusions with clashing high-saturation colors and hidden optical illusions. Minimalist structure made electric through intense color.",
  },
  {
    id: "typographic-beast",
    name: "The Typographic Beast",
    shortDesc: "Human/animal forms created entirely from distorted letterforms",
    styleElements: "Type used as texture, distorted letter heights, body as primary structure",
    promptDescription:
      "The Typographic Beast style: human or animal forms created entirely out of massive architectural and distorted letterforms. Type is used as texture and structural material, with distorted letter heights forming the human body as the primary visual structure. Typography becomes anatomy.",
  },
];
