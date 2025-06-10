export const horizontal = "3/2";
export const vertical = "2/3";

export interface PhotoMetadata {
  aspectRatio: string;
  path: string;
  styles: string;
  size?: number;
}

export interface Gallery {
  id: string;
  name: string;
  buffer: number;
  description: string;
  photos: PhotoMetadata[];
}

export const galleriesData = {
  noiretblanc: {
    id: 'noiretblanc',
    name: "Noir et Blanc",
    buffer: 80,
    description: "Black and white film photo collection, shot entirely on Kentmere Pan 400 and pushed to 800 ISO. This is my first exploration of pushing film. Landscapes, portraits, and everyday moments transform into something magical through the grain and texture...",
    photos: [
      { aspectRatio: vertical, path: "road-in-mist-bw.jpg", styles: "px-5 pb-14 xl:p-0",},
      { aspectRatio: horizontal, path: "mohnesee-in-winter-bw.jpg", styles: "px-8 pb-14 xl:p-0 xl:px-10", size: 1000 },
      { aspectRatio: horizontal, path: "retro-car-bw.jpg", styles: "pb-14 xl:p-0 xl:px-24" },
      { aspectRatio: horizontal, path: "artist-portrait-pencil-bw.jpg", styles: "px-15 pb-14 xl:p-10 xl:pl-16", size: 1000},
      { aspectRatio: horizontal, path: "old-tea-set-bw.jpg", styles: "px-5 xl:p-0 xl:pl-[140px] xl:mb-24",},
      { aspectRatio: horizontal, path: "window-rain-plant-bw.jpg", styles: "px-5 xl:p-0 xl:pr-[140px] xl:mt-24",},
    ] as PhotoMetadata[],
  },
  alpineescape: {
    id: 'alpineescape',
    name: "Alpine Escape",
    description: "Series of photos captured in 2024 during a trip with friends to Lauterbrunnen region, Switzerland. These images hold memories and impressions from an unforgettable 26 km hike up Mount Schilthorn (2,970 meters).",
    buffer: 78,
    photos: [
      { aspectRatio: vertical, path: "duck-on-fallen-tree-thun-lake.jpg", styles: "px-5 pb-14 xl:p-0", },
      { aspectRatio: horizontal, path: "alpine-cow.jpg", styles: "px-8 xl:p-0 xl:px-24", },
      { aspectRatio: vertical, path: "cows-in-alps-murren.jpg", styles: "px-8 pb-14 xl:p-0 xl:justify-start", },
      { aspectRatio: horizontal, path: "wooden-houses-in-alps.jpg", styles: "px-5 pb-14 xl:p-0 xl:px-10", size: 900 },
      { aspectRatio: vertical, path: "mount-reflection-in-lake-alps.jpg", styles: "px-0 xl:p-0 xl:justify-end", },
      { aspectRatio: vertical, path: "mountain-lake-schilthorn.jpg", styles: "px-10 pb-24 xl:p-0 xl:justify-start", },
      { aspectRatio: horizontal, path: "house-in-mountains-with-dog-murren.jpg", styles: "px-5 xl:p-0 xl:pl-24", size: 1200 },
    ] as PhotoMetadata[],
  },
  pentax17: {
    id: 'pentax17',
    name: "Pentax 17",
    description: "A collection of picture made in Paris, Amsterdam, Venice and Düsseldorf on Pentax 17.",
    buffer: 76,
    photos: [
      { aspectRatio: vertical, path: "night-eiffel-tower-paris-pentax17.jpg", styles: "px-5 pb-14 xl:p-0", },
      { aspectRatio: vertical, path: "man-with-pipe-big-shot-coffee-paris-pentax17.jpg", styles: "px-0 pb-14 xl:p-0 xl:justify-start", },
      { aspectRatio: vertical, path: "golden-hour-canal-venice-pentax17.jpg", styles: "px-10 xl:p-0 xl:p-14 xl:pl-[100px] xl:justify-end", },
      { aspectRatio: vertical, path: "night-canal-boat-venice-pentax17.jpg", styles: "px-10 pb-14 xl:p-0 xl:pr-24 xl:justify-start", },
      { aspectRatio: vertical, path: "cyclist-christmas-amsterdam-pentax17.jpg", styles: "px-8 pb-14 xl:p-20 xl:pr-0 xl:pb-[160px] xl:justify-end", },
      { aspectRatio: vertical, path: "bike-corner-canals-amsterdam-pentax17.jpg", styles: "px-0 xl:p-20 xl:pl-0 xl:pt-[160px] xl:justify-start", },
      { aspectRatio: vertical, path: "ladies-walking-amsterdam-pentax17.jpg", styles: "p-14 pb-0 xl:p-20 xl:pr-0 xl:pt-[160px] xl:justify-end", },
      { aspectRatio: vertical, path: "tourists-in-amsterdam-pentax17.jpg", styles: "p-14 pt-0 xl:p-20 xl:pl-0 xl:pb-[160px] xl:justify-start", },
      { aspectRatio: vertical, path: "city-ducks-dusseldorf-pentax17.jpg", styles: "p-5 xl:p-0 xl:p-0", },
    ] as PhotoMetadata[],
  },
  momentsofstillness: {
    id: 'momentsofstillness',
    name: "Moments of Stillness",
    description: "If you look closely, you'll find images captured across the changing seasons. My personal favourite: three flowers hanging in jars, still blooming in winter's cold and glowing in the golden hour light. This collection is dedicated to the nature and quiet life around us.",
    buffer: 76,
    photos: [
      { aspectRatio: vertical, path: "braun-leaves-lake-water-backdrop.jpg", styles: "px-5 pb-5 xl:p-0", },
      { aspectRatio: horizontal, path: "cat-on-the-beach-malaga.jpg", styles: "px-0 pb-5 xl:p-0 xl:pl-14 xl:pt-14", size: 1000 },
      { aspectRatio: horizontal, path: "spring-mognolia-blooming.jpg", styles: "px-8 xl:p-0 xl:pr-14 xl:pb-14", size: 1000},
      { aspectRatio: vertical, path: "spring-blooming-trees.jpg", styles: "px-8 xl:p-0", },
      { aspectRatio: vertical, path: "small-river-in-the-forest.jpg", styles: "px-5 pt-12 xl:p-0 xl:justify-end", },
      { aspectRatio: vertical, path: "fall-leaves-and-sky.jpg", styles: "px-0 pt-12 xl:p-0 xl:justify-start", },
      { aspectRatio: horizontal, path: "sheep-mother-and-baby-cinestill.jpg", styles: "p-12 xl:p-0 xl:pr-24", size: 1000},
      { aspectRatio: vertical, path: "flowers-in-jars-munster.jpg", styles: "px-5 pb-14 xl:p-0", },
      { aspectRatio: horizontal, path: "boats-in-port-barcelona.jpg", styles: "px-10 xl:p-0 xl:pl-14 xl:pb-14", size: 1000},
      { aspectRatio: horizontal, path: "boat-water-lake-geneva.jpg", styles: "px-10 xl:p-0 xl:pr-14 xl:pt-14", size: 1000},
    ] as PhotoMetadata[],
  },
  europeanfeel: {
    id: 'europeanfeel',
    name: "European Feel",
    description: "A collection of travel moments from Paris, Lyon, Venice, and Bruges, captured in 2023-2025",
    buffer: 76,
    photos: [
      { aspectRatio: vertical, path: "galeries-lafayette-paris.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: vertical, path: "montmartre-rain-street-paris.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: vertical, path: "rainy-sky-paris-city-center.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: horizontal, path: "brugges-city-center.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: vertical, path: "view-from-bridge-brugges.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: vertical, path: "funiculaire-lyon-france.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: vertical, path: "croix-rousse-lyon-france.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: horizontal, path: "hanging-clothes-venice.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: vertical, path: "hanging-clothes-between-houses-venice.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: vertical, path: "canal-boats-old-venice.jpg", styles: "px-5 xl:p-0", },
    ] as PhotoMetadata[],
  },
  grainofukraine: {
    id: 'grainofukraine',
    name: "Grain of Ukraine",
    description: "Ukraine on film, Kyiv and Kyiv region mostly...",
    buffer: 78,
    photos: [
      { aspectRatio: vertical, path: "vdnh-kyiv-tower.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: horizontal, path: "kyiv-velotrek-mural.jpg", styles: "px-5 xl:p-0",},
      { aspectRatio: horizontal, path: "kyiv-ghost-mural-podil.jpg", styles: "px-5 xl:p-0",},
      { aspectRatio: horizontal, path: "ukraine-landscape-kyiv-region.jpg", styles: "px-5 xl:p-0",},
      { aspectRatio: horizontal, path: "ruined-brigde-war-kyiv-region.jpg", styles: "px-5 xl:p-0",},
      { aspectRatio: horizontal, path: "kyiv-storm-clouds.jpg", styles: "px-5 xl:p-0",},
      { aspectRatio: horizontal, path: "kyiv-in-storm-winter.jpg", styles: "px-5 xl:p-0",},
    ] as PhotoMetadata[],
  },
  jazzyblues: {
    id: 'jazzyblues',
    name: "Jazzy Blues",
    description: "Ever heard of the 25 ISO Jazzy Blues film roll? You'll be lucky if at least half of it ends up properly exposed. I shot one roll a year, and this is all I can share after two years of experimenting. The last two shots were taken in Kyiv in 2020 with my first camera — FED-5 and a Revolog roll. Feels a little jazzy, doesn't it?",
    buffer: 78,
    photos: [
      { aspectRatio: vertical, path: "plant-stature-amterdam-jazzy-blues.jpg", styles: "px-5 xl:p-0", },
      { aspectRatio: horizontal, path: "jazzy-blues-chamomile.jpg", styles: "p-8 xl:p-0", size: 1000 },
      { aspectRatio: vertical, path: "design-books-jazzy-blues.jpg", styles: "p-0 xl:p-0", },
      { aspectRatio: horizontal, path: "white-cat-walking-jazzy-blues.jpg", styles: "pt-20 px-10 xl:p-0", },
      { aspectRatio: horizontal, path: "lady-smelling-roses.jpg", styles: "pb-20 px-10 xl:p-0", },
      { aspectRatio: horizontal, path: "mother-and-daughter-revolog.jpg", styles: "p-0 pb-8 xl:p-0", },
      { aspectRatio: vertical, path: "guy-portrait-kyiv-revolog.jpg", styles: "px-8 xl:p-0", },
    ] as PhotoMetadata[],
  },
  facesandplaces: {
    id: 'facesandplaces',
    name: "Faces and Places",
    description: "Pictures of people I know, strangers I met and moments that tell a story...",
    buffer: 80,
    photos: [
      { aspectRatio: vertical, path: "olives-festa-italiana-unna.jpg", styles: "px-5 pb-12 xl:p-0" },
      { aspectRatio: horizontal, path: "girl-with-dogs-prohorivka.jpg", styles: "px-8 xl:p-0" },
      { aspectRatio: horizontal, path: "guys-on-the-beach-italy.jpg", styles: "px-8 pb-12 xl:p-0" },
      { aspectRatio: vertical, path: "girl-in-glasses-park-guel.jpg", styles: "pb-20 xl:p-0 xl:pl-[200px]" },
      { aspectRatio: horizontal, path: "sad-kids-in-the-forest-prohorivka.jpg", styles: "p-10 xl:pl-36 xl:mt-40" },
      { aspectRatio: horizontal, path: "girl-in-the-woods.jpg", styles: "px-10 pb-20 xl:p-0 xl:pr-36 xl:mb-40" },
      { aspectRatio: vertical, path: "rooftop-monk-kretinga.jpg", styles: "px-5 xl:p-0" },
      { aspectRatio: horizontal, path: "roesterei-vier-dusseldorf.jpg", styles: "p-16 xl:p-0 xl:pl-10" , size: 1000 },
    ] as PhotoMetadata[],
  },
};
