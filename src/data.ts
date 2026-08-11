export const horizontal = "3/2";
export const vertical = "2/3";

export interface PhotoMetadata {
  aspectRatio: string;
  path: string;
  description?: string;
  place?: string;
  year?: string;
}

export interface Gallery {
  id: string;
  name: string;
  description: string;
  photos: PhotoMetadata[];
}

export const galleriesData: Record<string, Gallery> = {
  'noir-et-blanc': {
    id: 'noir-et-blanc',
    name: "Noir et Blanc",
    description: "Out of the few black-and-white rolls I’ve ever shot, I picked a handful for this printed collection. At first, I had no plan to make a series, but these frames seemed to fall into place — fragments of everyday life and small adventures.",
    photos: [
      { aspectRatio: vertical, path: "road-in-mist-bw.jpg", place: "Misty Road", year: "2025", description: "Heavy mist hung over the ground and blurred into the sky on a freezing winter day. The road fades into the fog just a few hundred meters ahead, as if leading nowhere…" },
      { aspectRatio: horizontal, path: "mohnesee-in-winter-bw.jpg", place: "Möhnesee, Germany", year: "2025", description: "Around the lake the air was clear, the sun was shining and yet only a few kilometers away the mist swallowed everything. It felt as if this place existed on another planet." },
      { aspectRatio: horizontal, path: "retro-car-bw.jpg", place: "Kunstpalast, Düsseldorf", year: "2024", description: "Flower in the Rearview" },
      { aspectRatio: horizontal, path: "artist-portrait-pencil-bw.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Artist’s Touch" },
      { aspectRatio: horizontal, path: "old-tea-set-bw.jpg", place: "Local Café, Unna", year: "2024", description: "Vintage Tea Set" },
      { aspectRatio: horizontal, path: "window-rain-plant-bw.jpg", place: "Unna, Germany", year: "2023", description: "Reflection" },
    ],
  },
  'alpine-escape': {
    id: 'alpine-escape',
    name: "Alpine Escape",
    description: "26 kilometers, 2,970 meters, and memories to last a lifetime. This collection documents a 2024 trip through the Lauterbrunnen Valley with friends, centered around the incredible hike up Mount Schilthorn.",
    photos: [
      { aspectRatio: horizontal, path: "wooden-houses-in-alps.jpg", place: "Lauterbrunnen, Switzerland", year: "2024", description: "" },
      { aspectRatio: vertical, path: "duck-on-fallen-tree-thun-lake.jpg", place: "Lake Thun, Switzerland", year: "2024", description: "Lonely duck." },
      { aspectRatio: horizontal, path: "house-in-mountains-with-dog-murren.jpg", place: "Mürren, Switzerland", year: "2024", description: "" },
      { aspectRatio: vertical, path: "mount-reflection-in-lake-alps.jpg", place: "Schilthorn, Switzerland", year: "2024", description: "Mirror-like surfaces on the way up." },
      { aspectRatio: vertical, path: "mountain-lake-schilthorn.jpg", place: "Schilthorn, Switzerland", year: "2024", description: "Mountain lake." },
      { aspectRatio: horizontal, path: "alpine-cow.jpg", place: "Mürren, Switzerland", year: "2024", description: "The locals are very friendly here." },
      { aspectRatio: vertical, path: "cows-in-alps-murren.jpg", place: "Mürren, Switzerland", year: "2024", description: "Tinkle of bells..." },
      { aspectRatio: horizontal, path: "people-on-the-rock.jpg", place: "Mount Schilthorn, 2,970 meters", year: "2024", description: "On top of the world." },
      { aspectRatio: horizontal, path: "girl-smiling-on-schilthorn.jpg", place: "Schilthorn, Switzerland", year: "2024", description: "It's 5pm and we are still on the very top of the mountain..." },
    ],
  },
  'harman-phoenix': {
    id: 'harman-phoenix',
    name: "Harman Phoenix",
    description: "Exploring the high-contrast world of Harman Phoenix I & II. This collection contains of intense, burning reds with dreamy blue tones. This series was an exploration of color. I had a lot of fun finding the perfect subjects to embrace the unique, experimental palette of these films",
    photos: [
      { aspectRatio: horizontal, path: "berlin-museum-stature.jpg", place: "Deutsches Historisches Museum, Berlin", year: "2025", description: "" },
      { aspectRatio: vertical, path: "whaet-filed-harman.jpg", place: "NRW, Germany", year: "2025", description: "Golden fields, which remind me of home." },
      { aspectRatio: horizontal, path: "newspaper-on-the-chair.jpg", place: "Düsseldorf, Germany", year: "2025", description: "Düsseldorfer" },
      { aspectRatio: horizontal, path: "girl-with-polaroid.jpg", place: "Ringstead Bay, UK", year: "2025", description: "Polaroid Girl" },
      { aspectRatio: horizontal, path: "cows-on-the-hill.jpg", place: "Durdle Door, UK", year: "2025", description: "Cows on the hill" },
      { aspectRatio: horizontal, path: "english-white-houses.jpg", place: "Portland, UK", year: "2025", description: "English white houses" },
      { aspectRatio: vertical, path: "lether-sheep-maastricht.jpg", place: "Maastricht, Netherlands", year: "2025", description: "I was instantly drawn to the 'sheep' at the entrance and snapped the shot without thinking. Only when invited inside did I realize it was a leather and fur shop. As someone who doesn't support the use of animal products, the irony wasn't lost on me. Sometimes photography is just about the composition, not the context." },
      { aspectRatio: vertical, path: "portland-bill.jpg", place: "Portland Bill Lighthouse, UK", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "plain-sky-harman.jpg", place: "Above Birmingham, UK", year: "2025", description: "" },
    ],
  },
  'european-feel': {
    id: 'european-feel',
    name: "European Feel",
    description: "These photos represent a journey I never expected to take. Forced to leave Ukraine and start over, I had a chance to explore Europe, which I am grateful for to this day. I think one should seek for peace and beauty even during the most challenging times.",
    photos: [
      { aspectRatio: vertical, path: "galeries-lafayette-paris.jpg", place: "Galeries Lafayette, Paris", year: "2023", description: "" },
      { aspectRatio: vertical, path: "montmartre-rain-street-paris.jpg", place: "Montmartre, Paris", year: "2023", description: "Rainy Montmartre" },
      { aspectRatio: vertical, path: "rainy-sky-paris-city-center.jpg", place: "Paris, France", year: "2023", description: "" },
      { aspectRatio: horizontal, path: "brugges-city-center.jpg", place: "Bruges, Belgium", year: "2024", description: "" },
      { aspectRatio: vertical, path: "view-from-bridge-brugges.jpg", place: "Bruges, Belgium", year: "2024", description: "So serene..." },
      { aspectRatio: vertical, path: "funiculaire-lyon-france.jpg", place: "Lyon, France", year: "2025", description: "Up to Fourvière" },
      { aspectRatio: vertical, path: "croix-rousse-lyon-france.jpg", place: "Croix-Rousse, Lyon", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "light-and-shadow-lyon.jpg", place: "Lyon, France", year: "2025", description: "Light & shadows" },
      { aspectRatio: vertical, path: "lyon-street-in-shadow.jpg", place: "Lyon, France", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "hanging-clothes-venice.jpg", place: "Venice, Italy", year: "2024", description: "" },
      { aspectRatio: vertical, path: "hanging-clothes-between-houses-venice.jpg", place: "Venice, Italy", year: "2024", description: "" },
      { aspectRatio: vertical, path: "canal-boats-old-venice.jpg", place: "Venice, Italy", year: "2024", description: "" },
      { aspectRatio: vertical, path: "venice-first-impression.jpg", place: "Venice, Italy", year: "2024", description: "First impression" },
      { aspectRatio: vertical, path: "barcelona-cathedral.jpg", place: "Barcelona, Spain", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "malaga-view-from-the-top.jpg", place: "La Malagueta, Malaga", year: "2023", description: "" },
      { aspectRatio: vertical, path: "malaga-cathedral.jpg", place: "Malaga, Spain", year: "2023", description: "Santa Iglesia Catedral Basílica de la Encarnación" },
    ],
  },
  'jazzy-blues': {
    id: 'jazzy-blues',
    name: "Jazzy Blues",
    description: "Ever heard of Jazzy Blues film? You're lucky if even half the roll comes out properly exposed. After two years of experimenting at a rate of one roll per year, this is all I have to show for it. Working with an expired 25 ISO stock is tricky, but those colors... they really do feel a little jazzy, don't they?",
    photos: [
      { aspectRatio: vertical, path: "design-books-jazzy-blues.jpg", place: "Düsseldorf, Germany", year: "2023", description: "This brutal world" },
      { aspectRatio: horizontal, path: "jazzy-blues-chamomile.jpg", place: "Unna, Germany", year: "2023", description: "Camomiles by neighbor's house" },
      { aspectRatio: vertical, path: "plant-stature-amterdam-jazzy-blues.jpg", place: "Amsterdam, Netherlands", year: "2024", description: "" },
      { aspectRatio: horizontal, path: "white-cat-walking-jazzy-blues.jpg", place: "Amsterdam, Netherlands", year: "2024", description: "" },
      { aspectRatio: horizontal, path: "lady-smelling-roses.jpg", place: "Unna, Germany", year: "2024", description: "" },
      { aspectRatio: horizontal, path: "flowers-in-focus-jazzy-blues.jpg", place: "Unna, Germany", year: "2023", description: "In focus" },
      { aspectRatio: vertical, path: "flower-in-sunlight.jpg", place: "Dortmund, Germany", year: "2023", description: "" },
      { aspectRatio: horizontal, path: "rolls-roys-car.jpg", place: "Düsseldorf, Germany", year: "2023", description: "" },
      { aspectRatio: horizontal, path: "rolls-roys-car-mirror.jpg", place: "Düsseldorf, Germany", year: "2023", description: "" },
    ],
  },
};

/** Slugs of the 5 collections that remain browsable under `/collections`. */
export const keptCollectionSlugs = ['noir-et-blanc', 'alpine-escape', 'harman-phoenix', 'european-feel', 'jazzy-blues'] as const;
export type CollectionSlug = typeof keptCollectionSlugs[number];

export interface FeedPhoto extends Omit<PhotoMetadata, 'path'> {
  /** S3 key path, e.g. "home-feed/euston-station.jpg" — always `<original-collection-id>/<path>`, even for retired collections. */
  src: string;
  /** Slug of a kept collection this photo still belongs to, or null if it came from a retired collection. */
  collection: string | null;
}

// Unified Overview feed: every photo from all 10 original collections (5 kept +
// 5 retired: mind-the-gap, moments-of-stillness, grain-of-ukraine, pentax-17,
// faces-and-places), hand-curated into one sequence. Ordering intent:
//   - Opens on a strong vertical (road-in-mist-bw) since the intro animation
//     deals the whole grid out from this first frame.
//   - Orientations are interleaved in short runs (mostly 1-3 verticals or
//     1-2 horizontals in a row, never more than 5 verticals or 3 horizontals
//     consecutively, and no 4-wide row is ever all-horizontal) so the 4-column
//     grid keeps its irregular Swiss rhythm rather than reading as a grid of
//     uniform rows.
//   - Kept and retired collections are round-robin interleaved rather than
//     grouped, so consecutive tiles almost always come from different
//     collections/trips.
export const homeFeed: FeedPhoto[] = [
  { aspectRatio: vertical, src: "european-feel/galeries-lafayette-paris.jpg", collection: 'european-feel', place: "Galeries Lafayette, Paris", year: "2023", description: "" },
  { aspectRatio: vertical, src: "european-feel/venice-first-impression.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "First impression" },
  { aspectRatio: vertical, src: "european-feel/paris-city-bike-french-flag.jpg", collection: 'european-feel', place: "Paris, France", year: "2023", description: "" },
  { aspectRatio: vertical, src: "home-feed/kfc-road-sign-harman.jpg", collection: null, place: "Kamen, Germany", year: "2026", description: "" },
  { aspectRatio: horizontal, src: "european-feel/malaga-view-from-the-top.jpg", collection: 'european-feel', place: "La Malagueta, Malaga", year: "2023", description: "" },
  { aspectRatio: vertical, src: "european-feel/hanging-clothes-between-houses-venice.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: vertical, src: "european-feel/malaga-cathedral.jpg", collection: 'european-feel', place: "Malaga, Spain", year: "2023", description: "Santa Iglesia Catedral Basílica de la Encarnación" },
  { aspectRatio: vertical, src: "home-feed/girls-on-a-boat-amsterdam.jpg", collection: '', place: "Amsterdam, Netherlands", year: "2026", description: "" },
  { aspectRatio: vertical, src: "home-feed/podil-kyiv-sunrise.jpg", collection: null, place: "Podil, Kyiv", year: "2025", description: "View on Kontraktova Square at sunrise" },
  { aspectRatio: vertical, src: "european-feel/rainy-sky-paris-city-center.jpg", collection: 'european-feel', place: "Paris, France", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "home-feed/statues-at-the-museum.jpg", collection: '', place: "Langen Foundation, Neuss", year: "2025", description: "" },
  { aspectRatio: vertical, src: "home-feed/bath-market-uk.jpg", collection: null, place: "Bath Guildhall Market", year: "2025", description: "Belts cut to size" },
  { aspectRatio: vertical, src: "home-feed/ryanair-plane-view.jpg", collection: '', place: "", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/leaves-in-the-darkness.jpg", collection: '', place: "Benrath, Düsseldorf", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "home-feed/cat-on-the-beach-malaga.jpg", collection: null, place: "Malaga, Spain", year: "2023", description: "A cat on the beach" },
  { aspectRatio: vertical, src: "home-feed/spring-blooming-trees.jpg", collection: null, place: "Unna, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "european-feel/lyon-street-in-shadow.jpg", collection: 'european-feel', place: "Lyon, France", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "home-feed/regent-street-lemington.jpg", collection: null, place: "Royal Leamington Spa", year: "2025", description: "Turns out, London isn't the only place with a Regent Street." },
  { aspectRatio: horizontal, src: "harman-phoenix/berlin-museum-stature.jpg", collection: 'harman-phoenix', place: "Deutsches Historisches Museum, Berlin", year: "2025", description: "" },
  { aspectRatio: vertical, src: "jazzy-blues/design-books-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Düsseldorf, Germany", year: "2023", description: "This brutal world" },
  { aspectRatio: horizontal, src: "european-feel/hanging-clothes-venice.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/night-eiffel-tower-paris-pentax17.jpg", collection: null, place: "Paris, France", year: "2024", description: "The Eiffel Tower at night." },
  { aspectRatio: horizontal, src: "home-feed/ukraine-landscape-kyiv-region.jpg", collection: null, place: "Ukraine", year: "2022", description: "" },
  { aspectRatio: vertical, src: "alpine-escape/duck-on-fallen-tree-thun-lake.jpg", collection: 'alpine-escape', place: "Lake Thun, Switzerland", year: "2024", description: "Lonely duck." },
  { aspectRatio: horizontal, src: "noir-et-blanc/mohnesee-in-winter-bw.jpg", collection: 'noir-et-blanc', place: "Möhnesee, Germany", year: "2025", description: "Around the lake the air was clear, the sun was shining and yet only a few kilometers away the mist swallowed everything. It felt as if this place existed on another planet." },
  { aspectRatio: vertical, src: "harman-phoenix/whaet-filed-harman.jpg", collection: 'harman-phoenix', place: "NRW, Germany", year: "2025", description: "Golden fields, which remind me of home." },
  { aspectRatio: horizontal, src: "jazzy-blues/jazzy-blues-chamomile.jpg", collection: 'jazzy-blues', place: "Unna, Germany", year: "2023", description: "Camomiles by neighbor's house" },
  { aspectRatio: vertical, src: "european-feel/montmartre-rain-street-paris.jpg", collection: 'european-feel', place: "Montmartre, Paris", year: "2023", description: "Rainy Montmartre" },
  { aspectRatio: horizontal, src: "home-feed/girl-with-dogs-prohorivka.jpg", collection: null, place: "Prokhorivka, Ukraine", year: "2021", description: "The dog lady" },
  { aspectRatio: vertical, src: "home-feed/braun-leaves-lake-water-backdrop.jpg", collection: null, place: "Möhnesee, Germany", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/retro-car-bw.jpg", collection: 'noir-et-blanc', place: "Kunstpalast, Düsseldorf", year: "2024", description: "Flower in the Rearview" },
  { aspectRatio: horizontal, src: "alpine-escape/house-in-mountains-with-dog-murren.jpg", collection: 'alpine-escape', place: "Mürren, Switzerland", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/man-with-pipe-big-shot-coffee-paris-pentax17.jpg", collection: null, place: "Paris, France", year: "2024", description: "Leaving Paris, I asked an elderly man outside a café for a portrait. He tried to put his pipe away, but I insisted he keep smoking and ignore me. Despite my usual nerves, I took the shot, said a quick Merci, and hurried off. After sharing the scan with @bigshotcoffee.paris, I learned he was the father of one of the owners. Knowing the photo meant as much to them as it did to me turned a simple frame into a beautiful story." },
  { aspectRatio: horizontal, src: "harman-phoenix/newspaper-on-the-chair.jpg", collection: 'harman-phoenix', place: "Düsseldorf, Germany", year: "2025", description: "Düsseldorfer" },
  { aspectRatio: horizontal, src: "home-feed/kyiv-velotrek-mural.jpg", collection: null, place: "Kyiv Cycle Track", year: "2020", description: "" },
  { aspectRatio: vertical, src: "jazzy-blues/plant-stature-amterdam-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Amsterdam, Netherlands", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "home-feed/guys-on-the-beach-italy.jpg", collection: null, place: "Duna Verde, Italy", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/book-store-bath-market-uk.jpg", collection: null, place: "Bath Guildhall Market", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/artist-portrait-pencil-bw.jpg", collection: 'noir-et-blanc', place: "Düsseldorf, Germany", year: "2024", description: "Artist’s Touch" },
  { aspectRatio: horizontal, src: "european-feel/brugges-city-center.jpg", collection: 'european-feel', place: "Bruges, Belgium", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/golden-hour-canal-venice-pentax17.jpg", collection: null, place: "Venice, Italy", year: "2024", description: "Golden hour on the canal." },
  { aspectRatio: horizontal, src: "harman-phoenix/girl-with-polaroid.jpg", collection: 'harman-phoenix', place: "Ringstead Bay, UK", year: "2025", description: "Polaroid Girl" },
  { aspectRatio: vertical, src: "alpine-escape/mount-reflection-in-lake-alps.jpg", collection: 'alpine-escape', place: "Schilthorn, Switzerland", year: "2024", description: "Mirror-like surfaces on the way up." },
  { aspectRatio: vertical, src: "home-feed/small-river-in-the-forest.jpg", collection: null, place: "NRW, Germany", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "jazzy-blues/white-cat-walking-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Amsterdam, Netherlands", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/night-canal-boat-venice-pentax17.jpg", collection: null, place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "home-feed/charity-shop-vinyl.jpg", collection: null, place: "Charity Shop, Royal Leamington Spa", year: "2025", description: "In search of treasures" },
  { aspectRatio: vertical, src: "alpine-escape/mountain-lake-schilthorn.jpg", collection: 'alpine-escape', place: "Schilthorn, Switzerland", year: "2024", description: "Mountain lake." },
  { aspectRatio: horizontal, src: "home-feed/kyiv-ghost-mural-podil.jpg", collection: null, place: "Podil, Kyiv", year: "2022", description: "Ghost of Kyiv" },
  { aspectRatio: vertical, src: "european-feel/view-from-bridge-brugges.jpg", collection: 'european-feel', place: "Bruges, Belgium", year: "2024", description: "So serene..." },
  { aspectRatio: horizontal, src: "home-feed/sad-kids-in-the-forest-prohorivka.jpg", collection: null, place: "Prokhorivka, Ukraine", year: "2020", description: "Sad kids" },
  { aspectRatio: vertical, src: "home-feed/fall-leaves-and-sky.jpg", collection: null, place: "Unna, Germany", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/old-tea-set-bw.jpg", collection: 'noir-et-blanc', place: "Local Café, Unna", year: "2024", description: "Vintage Tea Set" },
  { aspectRatio: vertical, src: "home-feed/trash-cans.jpg", collection: null, place: "Royal Leamington Spa", year: "2025", description: "This view caught my eye during several trips, through both summer and winter. I'm glad I finally had my camera with me to capture this moment forever." },
  { aspectRatio: horizontal, src: "harman-phoenix/cows-on-the-hill.jpg", collection: 'harman-phoenix', place: "Durdle Door, UK", year: "2025", description: "Cows on the hill" },
  { aspectRatio: vertical, src: "home-feed/cyclist-christmas-amsterdam-pentax17.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2024", description: "Christmas in Amsterdam" },
  { aspectRatio: horizontal, src: "jazzy-blues/lady-smelling-roses.jpg", collection: 'jazzy-blues', place: "Unna, Germany", year: "2024", description: "" },
  { aspectRatio: vertical, src: "european-feel/funiculaire-lyon-france.jpg", collection: 'european-feel', place: "Lyon, France", year: "2025", description: "Up to Fourvière" },
  { aspectRatio: vertical, src: "home-feed/china-town-london.jpg", collection: null, place: "Chinatown, London", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "home-feed/ruined-brigde-war-kyiv-region.jpg", collection: null, place: "Irpin, Ukraine", year: "2022", description: "Ruined bridge" },
  { aspectRatio: vertical, src: "home-feed/bike-corner-canals-amsterdam-pentax17.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2024", description: "Around the corner..." },
  { aspectRatio: horizontal, src: "home-feed/girl-in-the-woods.jpg", collection: null, place: "Prokhorivka, Ukraine", year: "2020", description: "" },
  { aspectRatio: vertical, src: "noir-et-blanc/road-in-mist-bw.jpg", collection: 'noir-et-blanc', place: "Misty Road", year: "2025", description: "Heavy mist hung over the ground and blurred into the sky on a freezing winter day. The road fades into the fog just a few hundred meters ahead, as if leading nowhere…" },
  { aspectRatio: horizontal, src: "alpine-escape/alpine-cow.jpg", collection: 'alpine-escape', place: "Mürren, Switzerland", year: "2024", description: "The locals are very friendly here." },
  { aspectRatio: vertical, src: "european-feel/croix-rousse-lyon-france.jpg", collection: 'european-feel', place: "Croix-Rousse, Lyon", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/window-rain-plant-bw.jpg", collection: 'noir-et-blanc', place: "Unna, Germany", year: "2023", description: "Reflection" },
  { aspectRatio: vertical, src: "alpine-escape/cows-in-alps-murren.jpg", collection: 'alpine-escape', place: "Mürren, Switzerland", year: "2024", description: "Tinkle of bells..." },
  { aspectRatio: horizontal, src: "harman-phoenix/english-white-houses.jpg", collection: 'harman-phoenix', place: "Portland, UK", year: "2025", description: "English white houses" },
  { aspectRatio: vertical, src: "home-feed/notting-hill.jpg", collection: null, place: "Notting Hill, London", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "home-feed/sheep-mother-and-baby-cinestill.jpg", collection: null, place: "Wersten, Düsseldorf", year: "2023", description: "The sheep mother and baby" },
  { aspectRatio: vertical, src: "harman-phoenix/lether-sheep-maastricht.jpg", collection: 'harman-phoenix', place: "Maastricht, Netherlands", year: "2025", description: "I was instantly drawn to the 'sheep' at the entrance and snapped the shot without thinking. Only when invited inside did I realize it was a leather and fur shop. As someone who doesn't support the use of animal products, the irony wasn't lost on me. Sometimes photography is just about the composition, not the context." },
  { aspectRatio: horizontal, src: "jazzy-blues/flowers-in-focus-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Unna, Germany", year: "2023", description: "In focus" },
  { aspectRatio: vertical, src: "home-feed/flowers-in-jars-munster.jpg", collection: null, place: "Münster, Germany", year: "2023", description: "Flower jars in winter light" },
  { aspectRatio: horizontal, src: "home-feed/purple-flowers.jpg", collection: null, place: "Spivoche Pole, Kyiv", year: "2021", description: "" },
  { aspectRatio: vertical, src: "jazzy-blues/flower-in-sunlight.jpg", collection: 'jazzy-blues', place: "Dortmund, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "home-feed/vdnh-kyiv-tower.jpg", collection: null, place: "VDNKh, Kyiv", year: "2021", description: "Leftovers of soviet modernism. Last Christmas before full-scale invasion." },
  { aspectRatio: horizontal, src: "home-feed/roesterei-vier-dusseldorf.jpg", collection: null, place: "Rösterei VIER (RVTC), Düsseldorf", year: "2023", description: "" },
  { aspectRatio: vertical, src: "harman-phoenix/portland-bill.jpg", collection: 'harman-phoenix', place: "Portland Bill Lighthouse, UK", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "european-feel/light-and-shadow-lyon.jpg", collection: 'european-feel', place: "Lyon, France", year: "2025", description: "Light & shadows" },
  { aspectRatio: vertical, src: "home-feed/rooftop-monk-kretinga.jpg", collection: null, place: "Kretinga, Lithuania", year: "2024", description: "Bernardas" },
  { aspectRatio: horizontal, src: "alpine-escape/people-on-the-rock.jpg", collection: 'alpine-escape', place: "Mount Schilthorn, 2,970 meters", year: "2024", description: "On top of the world." },
  { aspectRatio: vertical, src: "home-feed/guy-portrait-kyiv-revolog.jpg", collection: null, place: "Bereznyaky, Kyiv", year: "2020", description: "Hore" },
  { aspectRatio: horizontal, src: "alpine-escape/wooden-houses-in-alps.jpg", collection: 'alpine-escape', place: "Lauterbrunnen, Switzerland", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/soho.jpg", collection: null, place: "Soho, London", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "home-feed/mother-and-daughter-revolog.jpg", collection: null, place: "Bereznyaky, Kyiv", year: "2020", description: "" },
  { aspectRatio: vertical, src: "home-feed/dog-in-the-car.jpg", collection: null, place: "ALDI Parking, Unna", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "home-feed/in-house-library.jpg", collection: null, place: "Notting Hill, London", year: "2025", description: "Home library" },
  { aspectRatio: vertical, src: "home-feed/reflection-lviv.jpg", collection: null, place: "Lviv, Ukraine", year: "2025", description: "The ability to reproduce energy and feel it beyond yourself." },
  { aspectRatio: horizontal, src: "jazzy-blues/rolls-roys-car.jpg", collection: 'jazzy-blues', place: "Düsseldorf, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "home-feed/girl-in-munster.jpg", collection: null, place: "Münster, Germany", year: "2025", description: "Sister in town" },
  { aspectRatio: horizontal, src: "home-feed/hanging-clothes-lviv.jpg", collection: null, place: "Lviv, Ukraine", year: "2025", description: "" },
  { aspectRatio: vertical, src: "home-feed/smoking-girl-mural.jpg", collection: null, place: "Münster, Germany", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "alpine-escape/girl-smiling-on-schilthorn.jpg", collection: 'alpine-escape', place: "Schilthorn, Switzerland", year: "2024", description: "It's 5pm and we are still on the very top of the mountain..." },
  { aspectRatio: vertical, src: "home-feed/durdle-door.jpg", collection: null, place: "Durdle Door, UK", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "harman-phoenix/plain-sky-harman.jpg", collection: 'harman-phoenix', place: "Above Birmingham, UK", year: "2025", description: "" },
  { aspectRatio: vertical, src: "european-feel/canal-boats-old-venice.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "home-feed/euston-station.jpg", collection: null, place: "Euston Station, London", year: "2025", description: "Empty at 5am" },
  { aspectRatio: horizontal, src: "jazzy-blues/rolls-roys-car-mirror.jpg", collection: 'jazzy-blues', place: "Düsseldorf, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "home-feed/coffee-with-friends.jpg", collection: null, place: "Royal Leamington Spa", year: "2025", description: "The people who make every journey special." },
  { aspectRatio: horizontal, src: "home-feed/boat-water-lake-geneva.jpg", collection: null, place: "Geneva, Switzerland", year: "2025", description: "The boat" },
  { aspectRatio: vertical, src: "european-feel/barcelona-cathedral.jpg", collection: 'european-feel', place: "Barcelona, Spain", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "home-feed/lviv-tram-train-station.jpg", collection: null, place: "Lviv Central Station", year: "2022", description: "" },
  { aspectRatio: vertical, src: "home-feed/pulpit-rock-portland.jpg", collection: null, place: "Pulpit Rock, Portland", year: "2025", description: "" },
  { aspectRatio: vertical, src: "home-feed/olives-festa-italiana-unna.jpg", collection: null, place: "Unna, Germany", year: "2023", description: "Una Festa Italiana" },
  { aspectRatio: vertical, src: "home-feed/a-horse-on-film.jpg", collection: null, place: "Unna, Germany", year: "2025", description: "I was amazed by how they take care of horses here..." },
  { aspectRatio: vertical, src: "home-feed/amsterdam-locals.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2026", description: "" },
  { aspectRatio: horizontal, src: "home-feed/amsterdam-tableware.jpg", collection: null, place: "Tableware, Amsterdam", year: "2026", description: "" },
  { aspectRatio: horizontal, src: "home-feed/barcelona-morning-rush-hour.jpg", collection: null, place: "Barcelona, Spain", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "home-feed/berlin-street-bike-passing-by.jpg", collection: null, place: "Berlin, Germany", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "home-feed/berlin-u-bahn-on-film.jpg", collection: null, place: "Berlin, Germany", year: "2025", description: "" },
  { aspectRatio: vertical, src: "home-feed/cat-covered-in-blanket.jpg", collection: null, place: "Kretinga, Lithuania", year: "2024", description: "Gucci" },
  { aspectRatio: vertical, src: "home-feed/cirmes-vibes-munster.jpg", collection: null, place: "Münster, Germany", year: "2025", description: "Cirmes Vibes" },
  { aspectRatio: vertical, src: "home-feed/disnayland-atractions-cart-farther-and-daughter.jpg", collection: null, place: "Disnayland, Paris", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/dog-im-amsterdam.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2026", description: "" },
  { aspectRatio: vertical, src: "home-feed/dusseldorf-turm-harman.jpg", collection: null, place: "Düsseldorf, Germany", year: "2026", description: "" },
  { aspectRatio: horizontal, src: "home-feed/gertrudes-painting-amsterdam-canals-studio.jpg", collection: null, place: "Gertrud D Galleries, Amsterdam", year: "2023", description: "" },
  { aspectRatio: vertical, src: "home-feed/girl-hiking-up-the-mountain.jpg", collection: 'alpine-escape', place: "Lauterbrunnen, Switzerland", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "home-feed/girl-pumpkin-head-playing-ps.jpg", collection: null, place: "", year: "2025", description: "Halloween Fortnite Round" },
  { aspectRatio: horizontal, src: "home-feed/guys-on-the-boat-amsterdam.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2026", description: "" },
  { aspectRatio: horizontal, src: "home-feed/indian-village-in-lithuania.jpg", collection: null, place: "Vinetu Kaimas, Lithuania", year: "2024", description: "“Vinetu Village” is an authentic Native American living museum, nestled in the scenic Akmena-Danė river valley near Kretinga." },
  { aspectRatio: vertical, src: "home-feed/japanese-food.jpg", collection: null, place: "Little Tokyo, Düsseldorf's Japanese quarter", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "home-feed/kochem-castle.jpg", collection: null, place: "Reichsburg Castle, Cochem", year: "2023", description: "" },
  { aspectRatio: vertical, src: "home-feed/love-harman.jpg", collection: 'harman-phoenix', place: "Düsseldorf, Germany", year: "2025", description: "" },
  { aspectRatio: vertical, src: "home-feed/netherlands-boat-amsterdam.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2026", description: "" },
  { aspectRatio: vertical, src: "home-feed/newspapers-dusseldorfer.jpg", collection: null, place: "Düsseldorf, Germany", year: "2024", description: "Düsseldorfer" },
  { aspectRatio: horizontal, src: "home-feed/old-man-sitting-at-the-caffe.jpg", collection: null, place: "Bath, UK", year: "2025", description: "" },
  { aspectRatio: vertical, src: "home-feed/palm-trees-malaga.jpg", collection: null, place: "Malaga, Splain", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "home-feed/rhine-sunset-harman.jpg", collection: 'harman-phoenix', place: "Düsseldorf, Germany", year: "2026", description: "" },
  { aspectRatio: vertical, src: "home-feed/road-signs-mcdonalds-kfc.jpg", collection: 'harman-phoenix', place: "Kamen, Germany", year: "2026", description: "" },
  { aspectRatio: vertical, src: "home-feed/street-autumn-bike-leaves.jpg", collection: null, place: "Unna, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "home-feed/vanice-on-film.jpg", collection: null, place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: vertical, src: "home-feed/view-from-the-bus-front-window-london.jpg", collection: null, place: "London, UK", year: "2026", description: "" },
  { aspectRatio: vertical, src: "home-feed/woman-making-hair-at-home.jpg", collection: null, place: "Kretinga, Lithuania", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "home-feed/young-couple.jpg", collection: null, place: "Lviv, Ukraine", year: "2025", description: "" },
];
