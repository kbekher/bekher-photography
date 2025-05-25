// /data/galleryConfig.ts

export const horizontal = "3/2";
export const vertical = "2/3";

export interface PhotoMetadata {
  aspectRatio: string;
  path: string;
  spacing: string;
  space: number;
  size: number;
}

export const galleriesData = {
  noiretblanc: {
    name: "Noir et Blanc",
    // description: "Black and white film photo collection, shot entirely on Kentmere Pan 400 and pushed to 800 ISO. This is my first exploration of pushing film. Landscapes, portraits, and everyday moments transform into something magical through the grain and texture...",
    photos: [
      { aspectRatio: vertical, path: "road-in-mist-bw.jpg" },
      { aspectRatio: horizontal, path: "mohnesee-in-winter-bw.jpg" },
      { aspectRatio: horizontal, path: "retro-car-bw.jpg" },
      { aspectRatio: horizontal, path: "artist-portrait-pencil-bw.jpg" },
      { aspectRatio: horizontal, path: "old-tea-set-bw.jpg" },
      { aspectRatio: horizontal, path: "window-rain-plant-bw.jpg" },
    ] as PhotoMetadata[],
  },
  alpineescape: {
    name: "Alpine Escape",
    // description: "Series of photos captured in 2024 during a trip with friends to Lauterbrunnen region, Switzerland. These images hold memories and impressions from an unforgettable 26 km hike up Mount Schilthorn (2,970 meters).",
    photos: [
      { aspectRatio: vertical, path: "duck-on-fallen-tree-thun-lake.jpg" },
      { aspectRatio: horizontal, path: "alpine-cow.jpg" },
      { aspectRatio: vertical, path: "cows-in-alps-murren.jpg" },
      { aspectRatio: horizontal, path: "wooden-houses-in-alps.jpg" },
      { aspectRatio: vertical, path: "mount-reflection-in-lake-alps.jpg" },
      { aspectRatio: vertical, path: "mountain-lake-schilthorn.jpg" },
      { aspectRatio: horizontal, path: "house-in-mountains-with-dog-murren.jpg" },
    ] as PhotoMetadata[],
  },
  jazzyblues: {
    name: "Jazzy Blues",
    // description: "Ever heard of the 25 ISO Jazzy Blues film roll? You'll be lucky if at least half of it ends up properly exposed. I shot one roll a year, and this is all I can share after two years of experimenting. The last two shots were taken in Kyiv in 2020 with my first camera — FED-5 and a Revolog roll. Feels a little jazzy, doesn't it?",
    photos: [
      { aspectRatio: vertical, path: "plant-stature-amterdam-jazzy-blues.jpg" },
      { aspectRatio: horizontal, path: "jazzy-blues-chamomile.jpg" },
      { aspectRatio: vertical, path: "design-books-jazzy-blues.jpg" },
      { aspectRatio: horizontal, path: "white-cat-walking-jazzy-blues.jpg" },
      { aspectRatio: horizontal, path: "lady-smelling-roses.jpg" },
      { aspectRatio: horizontal, path: "mother-and-daughter-revolog.jpg" },
      { aspectRatio: vertical, path: "guy-portrait-kyiv-revolog.jpg" },
    ] as PhotoMetadata[],
  },
  momentsofstillness: {
    name: "Moments of Stillness",
    // description: "If you look closely, you'll find images captured across the changing seasons. My personal favourite: three flowers hanging in jars, still blooming in winter's cold and glowing in the golden hour light. And then, the animals: a cat resting on a beach in Málaga in May 2023, sheep in Wersten neighborhood in Düsseldorf, and city ducks caught on camera. This collection is dedicated to the nature and quiet life around us.",
    photos: [
      { aspectRatio: vertical, path: "braun-leaves-lake-water-backdrop.jpg" },
      { aspectRatio: horizontal, path: "cat-on-the-beach-malaga.jpg" },
      { aspectRatio: horizontal, path: "spring-mognolia-blooming.jpg" },
      { aspectRatio: vertical, path: "spring-blooming-trees.jpg" },
      { aspectRatio: vertical, path: "small-river-in-the-forest.jpg" },
      { aspectRatio: vertical, path: "fall-leaves-and-sky.jpg" },
      { aspectRatio: horizontal, path: "sheep-mother-and-baby-cinestill.jpg" },
      { aspectRatio: vertical, path: "flowers-in-jars-munster.jpg" },
      { aspectRatio: horizontal, path: "boats-in-port-barcelona.jpg" },
      { aspectRatio: horizontal, path: "boat-water-lake-geneva.jpg" },
    ] as PhotoMetadata[],
  },
  fromparistovenice: {
    name: "From Paris to Venice",
    description: "A collection of travel moments from Paris, Lyon, Venice, and Bruges, captured in 2023-2025",
    photos: [
      { aspectRatio: vertical, path: "galeries-lafayette-paris.jpg" },
      { aspectRatio: vertical, path: "montmartre-rain-street-paris.jpg" },
      { aspectRatio: vertical, path: "rainy-sky-paris-city-center.jpg" },
      { aspectRatio: horizontal, path: "brugges-city-center.jpg" },
      { aspectRatio: vertical, path: "view-from-bridge-brugges.jpg" },
      { aspectRatio: vertical, path: "funiculaire-lyon-france.jpg" },
      { aspectRatio: vertical, path: "croix-rousse-lyon-france.jpg" },
      { aspectRatio: horizontal, path: "hanging-clothes-venice.jpg" },
      { aspectRatio: vertical, path: "hanging-clothes-between-houses-venice.jpg" },
      { aspectRatio: vertical, path: "canal-boats-old-venice.jpg" },
    ] as PhotoMetadata[],
  },
  familiarfaces: {
    name: "Familiar Faces",
    // description: "Pictures of people I know, strangers I met and moments that, I hope, tell a story...",
    photos: [
      { aspectRatio: vertical, path: "olives-festa-italiana-unna.jpg",},
      { aspectRatio: horizontal, path: "girl-with-dogs-prohorivka.jpg",},
      { aspectRatio: horizontal, path: "guys-on-the-beach-italy.jpg",},
      { aspectRatio: vertical, path: "girl-in-glasses-park-guel.jpg",},
      { aspectRatio: horizontal, path: "sad-kids-in-the-forest-prohorivka.jpg",},
      { aspectRatio: horizontal, path: "girl-in-the-woods.jpg",},
      { aspectRatio: vertical, path: "rooftop-monk-kretinga.jpg",},
      { aspectRatio: horizontal, path: "roesterei-vier-dusseldorf.jpg",},
    ] as PhotoMetadata[],
  },

  pentax17: {
    name: "Pentax 17",
    // description: "A collection of picture made on Pentax 17.",
    photos: [
      { aspectRatio: vertical, path: "night-eiffel-tower-paris-pentax17.jpg", },
      { aspectRatio: vertical, path: "man-with-pipe-big-shot-coffee-paris-pentax17.jpg",},
      { aspectRatio: vertical, path: "golden-hour-canal-venice-pentax17.jpg", },
      { aspectRatio: vertical, path: "night-canal-boat-venice-pentax17.jpg", },
      { aspectRatio: vertical, path: "cyclist-christmas-amsterdam-pentax17.jpg", },
      { aspectRatio: vertical, path: "bike-corner-canals-amsterdam-pentax17.jpg",},
      { aspectRatio: vertical, path: "ladies-walking-amsterdam-pentax17.jpg", },
      { aspectRatio: vertical, path: "tourists-in-amsterdam-pentax17.jpg", },
      { aspectRatio: vertical, path: "city-ducks-dusseldorf-pentax17.jpg", },

    ] as PhotoMetadata[],
  },
};
