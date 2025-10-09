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
      { aspectRatio: vertical, path: "road-in-mist-bw.jpg", styles: "px-5 pb-14 xl:p-0" },
      { aspectRatio: horizontal, path: "mohnesee-in-winter-bw.jpg", styles: "px-8 pb-14 xl:p-0 xl:px-48 xl:py-18" },
      { aspectRatio: horizontal, path: "retro-car-bw.jpg", styles: "pb-14 xl:p-0 xl:py-24 xl:pb-48 xl:pr-16" },
      { aspectRatio: horizontal, path: "artist-portrait-pencil-bw.jpg", styles: "px-15 pb-14 xl:p-0 xl:py-24 xl:pt-48 xl:pl-10 xl:pr-48" },
      { aspectRatio: horizontal, path: "old-tea-set-bw.jpg", styles: "px-5 xl:p-0 xl:py-18 xl:pr-48" },
      { aspectRatio: horizontal, path: "window-rain-plant-bw.jpg", styles: "px-5 xl:p-0 xl:py-6" },
    ] as PhotoMetadata[],
  },
  alpineescape: {
    id: 'alpineescape',
    name: "Alpine Escape",
    description: "Series of photos captured in 2024 during a trip with friends to Lauterbrunnen region, Switzerland. These images hold memories and impressions from an unforgettable 26 km hike up Mount Schilthorn (2,970 meters).",
    buffer: 78,
    photos: [
      { aspectRatio: vertical, path: "duck-on-fallen-tree-thun-lake.jpg", styles: "px-5 pb-14 xl:p-0" },
      { aspectRatio: horizontal, path: "alpine-cow.jpg", styles: "px-8 xl:p-0 xl:p-40" },
      { aspectRatio: vertical, path: "cows-in-alps-murren.jpg", styles: "px-8 pb-14 xl:p-0 xl:py-6" },
      { aspectRatio: horizontal, path: "wooden-houses-in-alps.jpg", styles: "px-5 pb-14 xl:p-0 xl:px-60 xl:py-18" },
      { aspectRatio: vertical, path: "mount-reflection-in-lake-alps.jpg", styles: "xl:p-0 xl:py-6 xl:pr-2" },
      { aspectRatio: vertical, path: "mountain-lake-schilthorn.jpg", styles: "px-10 py-24 xl:p-0 xl:py-6 xl:pl-2" },
      { aspectRatio: horizontal, path: "house-in-mountains-with-dog-murren.jpg", styles: "px-5 xl:p-0 xl:py-24 xl:pl-60" },
    ] as PhotoMetadata[],
  },
  pentax17: {
    id: 'pentax17',
    name: "Pentax 17",
    description: "A collection of picture made in Paris, Amsterdam, Venice and Düsseldorf on Pentax 17.",
    buffer: 76,
    photos: [
      { aspectRatio: vertical, path: "night-eiffel-tower-paris-pentax17.jpg", styles: "px-5 pb-14 xl:p-0 xl:pr-4" },
      { aspectRatio: vertical, path: "man-with-pipe-big-shot-coffee-paris-pentax17.jpg", styles: "pb-14 xl:p-0 xl:pl-4 xl:py-18" },
      { aspectRatio: vertical, path: "golden-hour-canal-venice-pentax17.jpg", styles: "px-10 xl:p-0 xl:pl-80 xl:py-6 xl:pr-2" },
      { aspectRatio: vertical, path: "night-canal-boat-venice-pentax17.jpg", styles: "px-10 pb-14 xl:p-0 xl:py-6 xl:pl-2 xl:pr-80" },
      { aspectRatio: vertical, path: "cyclist-christmas-amsterdam-pentax17.jpg", styles: "px-8 pb-14 xl:p-0 xl:py-18 xl:pr-14" },
      { aspectRatio: vertical, path: "bike-corner-canals-amsterdam-pentax17.jpg", styles: "xl:p-0 xl:py-6 xl:pl-14" },
      { aspectRatio: vertical, path: "bath-market-uk.jpg", styles: "p-14 pb-0 xl:p-0 xl:py-6 xl:pl-80 xl:pr-2" },
      { aspectRatio: vertical, path: "book-store-bath-market-uk.jpg", styles: "p-14 pt-0 xl:p-0 xl:py-6 xl:px-50" },
      { aspectRatio: horizontal, path: "charity-shop-vinyl.jpg", styles: "p-16 xl:p-24 xl:pr-0" },
    ] as PhotoMetadata[],
  },
  momentsofstillness: {
    id: 'momentsofstillness',
    name: "Moments of Stillness",
    description: "If you look closely, you'll find images captured across the changing seasons. My personal favourite: three flowers hanging in jars, still blooming in winter's cold and glowing in the golden hour light. This collection is dedicated to the nature and quiet life around us.",
    buffer: 76,
    photos: [
      { aspectRatio: vertical, path: "braun-leaves-lake-water-backdrop.jpg", styles: "px-5 pb-5 xl:p-0" },
      { aspectRatio: horizontal, path: "cat-on-the-beach-malaga.jpg", styles: "xl:p-0 xl:py-40 xl:px-60" },
      { aspectRatio: horizontal, path: "spring-mognolia-blooming.jpg", styles: "px-8 xl:p-0 xl:py-18 xl:pr-60" },
      { aspectRatio: vertical, path: "spring-blooming-trees.jpg", styles: "px-8 xl:p-0 xl:py-6 xl:pr-3" },
      { aspectRatio: vertical, path: "small-river-in-the-forest.jpg", styles: "px-5 pt-12 xl:p-0 xl:py-6 xl:px-3" },
      { aspectRatio: vertical, path: "fall-leaves-and-sky.jpg", styles: "pt-12 xl:p-0 xl:py-6 xl:pl-3" },
      { aspectRatio: horizontal, path: "sheep-mother-and-baby-cinestill.jpg", styles: "p-12 xl:p-0 xl:py-18 xl:px-60" },
      { aspectRatio: vertical, path: "flowers-in-jars-munster.jpg", styles: "px-5 pb-14 xl:p-0" },
      { aspectRatio: horizontal, path: "boats-in-port-barcelona.jpg", styles: "px-10 xl:p-0 xl:pl-60 xl:pt-34 xl:pb-58 xl:pr-4" },
      { aspectRatio: horizontal, path: "boat-water-lake-geneva.jpg", styles: "px-10 xl:p-0 xl:pb-34 xl:pt-58 xl:pl-4" },
    ] as PhotoMetadata[],
  },
  europeanfeel: {
    id: 'europeanfeel',
    name: "European Feel",
    description: "A collection of travel moments from Paris, Lyon, Venice, and Bruges, captured in 2023-2025",
    buffer: 76,
    photos: [
      { aspectRatio: vertical, path: "galeries-lafayette-paris.jpg", styles: "px-5 xl:p-0" },
      { aspectRatio: vertical, path: "montmartre-rain-street-paris.jpg", styles: "px-8 pt-10 xl:p-0 xl:pr-4 xl:pl-80 xl:py-6" },
      { aspectRatio: vertical, path: "rainy-sky-paris-city-center.jpg", styles: "px-8 pb-10 xl:p-0 xl:pl-4 xl:pr-80 xl:py-6" },
      { aspectRatio: horizontal, path: "brugges-city-center.jpg", styles: "px-10 pb-10 xl:p-0 xl:py-34 xl:pr-6" },
      { aspectRatio: vertical, path: "view-from-bridge-brugges.jpg", styles: "pb-10 xl:p-0 xl:py-18 xl:pl-6" },
      { aspectRatio: vertical, path: "funiculaire-lyon-france.jpg", styles: "px-5 pb-2 xl:p-0 xl:pl-80 xl:pr-3" },
      { aspectRatio: vertical, path: "croix-rousse-lyon-france.jpg", styles: "px-5 pb-10 xl:p-0 xl:pl-3 xl:py-6" },
      { aspectRatio: horizontal, path: "hanging-clothes-venice.jpg", styles: "pb-10 xl:p-0 xl:pl-120 xl:pt-18 xl:pb-50 xl:pr-4" },
      { aspectRatio: vertical, path: "hanging-clothes-between-houses-venice.jpg", styles: "px-12 pb-10 xl:p-0 xl:py-18 xl:pl-4 xl:pr-60" },
      { aspectRatio: vertical, path: "canal-boats-old-venice.jpg", styles: "px-5 xl:p-0 xl:py-6 xl:pl-20" },
    ] as PhotoMetadata[],
  },
  grainofukraine: {
    id: 'grainofukraine',
    name: "Grain of Ukraine",
    description: "Ukraine on film, Kyiv and Kyiv region mostly...",
    buffer: 78,
    photos: [
      { aspectRatio: vertical, path: "whaet-filed-harman.jpg", styles: "px-5 xl:p-0 xl:pr-120" },
      { aspectRatio: horizontal, path: "kyiv-velotrek-mural.jpg", styles: "py-12 xl:p-0 xl:pt-48 xl:pb-20 xl:px-9" },
      { aspectRatio: horizontal, path: "kyiv-ghost-mural-podil.jpg", styles: "px-12 pb-12 xl:p-0 xl:pb-48 xl:pt-20 xl:px-9" },
      { aspectRatio: horizontal, path: "ukraine-landscape-kyiv-region.jpg", styles: "xl:p-0 xl:pl-60 xl:pr-30 xl:py-6" },
      { aspectRatio: horizontal, path: "ruined-brigde-war-kyiv-region.jpg", styles: "xl:p-0 xl:px-30 xl:py-18" },
      { aspectRatio: vertical, path: "sunflower-ua-pentax17.jpg", styles: "px-5 pt-10 xl:p-0 xl:pl-100" },
      { aspectRatio: vertical, path: "vdnh-kyiv-tower.jpg", styles: "p-10 pb-0 xl:p-0 xl:pl-50" },
    ] as PhotoMetadata[],
  },
  jazzyblues: {
    id: 'jazzyblues',
    name: "Jazzy Blues",
    description: "Ever heard of the 25 ISO Jazzy Blues film roll? You'll be lucky if at least half of it ends up properly exposed. I shot one roll a year, and this is all I can share after two years of experimenting. The last two shots were taken in Kyiv in 2020 with my first camera — FED-5 and a Revolog roll. Feels a little jazzy, doesn't it?",
    buffer: 78,
    photos: [
      { aspectRatio: vertical, path: "plant-stature-amterdam-jazzy-blues.jpg", styles: "px-5 xl:p-0" },
      { aspectRatio: horizontal, path: "jazzy-blues-chamomile.jpg", styles: "p-8 xl:p-0 xl:py-26 xl:px-52" },
      { aspectRatio: vertical, path: "design-books-jazzy-blues.jpg", styles: "xl:p-0 xl:py-6" },
      { aspectRatio: horizontal, path: "white-cat-walking-jazzy-blues.jpg", styles: "pt-20 px-10 xl:p-0 xl:pt-18 xl:pb-56 xl:pr-9 xl:pl-80" },
      { aspectRatio: horizontal, path: "lady-smelling-roses.jpg", styles: "pb-20 px-10 xl:p-0 xl:pb-18 xl:pt-56 xl:pl-9 xl:pr-80" },
      { aspectRatio: horizontal, path: "mother-and-daughter-revolog.jpg", styles: "pb-8 xl:p-0 xl:py-6 xl:px-3" },
      { aspectRatio: vertical, path: "guy-portrait-kyiv-revolog.jpg", styles: "px-8 xl:p-0 xl:px-3 xl:py-6" },
    ] as PhotoMetadata[],
  },
  facesandplaces: {
    id: 'facesandplaces',
    name: "Faces and Places",
    description: "Pictures of people I know, strangers I met and moments that tell a story...",
    buffer: 80,
    photos: [
      { aspectRatio: vertical, path: "olives-festa-italiana-unna.jpg", styles: "px-5 pb-12 xl:p-0 xl:pr-80" },
      { aspectRatio: horizontal, path: "girl-with-dogs-prohorivka.jpg", styles: "px-8 xl:pt-48 xl:p-18" },
      { aspectRatio: horizontal, path: "guys-on-the-beach-italy.jpg", styles: "px-8 pb-12 xl:p-18 xl:pr-60" },
      { aspectRatio: vertical, path: "china-town-london.jpg", styles: "pb-20 xl:p-0 xl:pr-120 xl:pl-60 xl:py-6" },
      { aspectRatio: horizontal, path: "sad-kids-in-the-forest-prohorivka.jpg", styles: "p-10 xl:p-0 xl:pt-18 xl:pb-64 xl:pr-6" },
      { aspectRatio: horizontal, path: "girl-in-the-woods.jpg", styles: "px-10 pb-20 xl:p-0 xl:pb-18 xl:pt-64 xl:pl-6" },
      { aspectRatio: vertical, path: "rooftop-monk-kretinga.jpg", styles: "px-5 xl:p-0 xl:px-80" },
      { aspectRatio: horizontal, path: "roesterei-vier-dusseldorf.jpg", styles: "p-16 xl:p-24" },
    ] as PhotoMetadata[],
  },
};
