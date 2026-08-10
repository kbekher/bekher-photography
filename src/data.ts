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

/** Slugs of the 5 collections that remain browsable under `/index`. */
export const keptCollectionSlugs = ['noir-et-blanc', 'alpine-escape', 'harman-phoenix', 'european-feel', 'jazzy-blues'] as const;
export type CollectionSlug = typeof keptCollectionSlugs[number];

export interface FeedPhoto extends Omit<PhotoMetadata, 'path'> {
  /** S3 key path, e.g. "mind-the-gap/euston-station.jpg" — always `<original-collection-id>/<path>`, even for retired collections. */
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
  { aspectRatio: vertical, src: "european-feel/lyon-street-in-shadow.jpg", collection: 'european-feel', place: "Lyon, France", year: "2025", description: "" },
  { aspectRatio: vertical, src: "european-feel/galeries-lafayette-paris.jpg", collection: 'european-feel', place: "Galeries Lafayette, Paris", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "mind-the-gap/regent-street-lemington.jpg", collection: null, place: "Royal Leamington Spa", year: "2025", description: "Turns out, London isn't the only place with a Regent Street." },
  { aspectRatio: horizontal, src: "harman-phoenix/berlin-museum-stature.jpg", collection: 'harman-phoenix', place: "Deutsches Historisches Museum, Berlin", year: "2025", description: "" },
  { aspectRatio: vertical, src: "jazzy-blues/design-books-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Düsseldorf, Germany", year: "2023", description: "This brutal world" },
  { aspectRatio: horizontal, src: "european-feel/hanging-clothes-venice.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: vertical, src: "pentax-17/night-eiffel-tower-paris-pentax17.jpg", collection: null, place: "Paris, France", year: "2024", description: "The Eiffel Tower at night." },
  { aspectRatio: horizontal, src: "moments-of-stillness/cat-on-the-beach-malaga.jpg", collection: null, place: "Malaga, Spain", year: "2023", description: "A cat on the beach" },
  { aspectRatio: vertical, src: "european-feel/malaga-cathedral.jpg", collection: 'european-feel', place: "Malaga, Spain", year: "2023", description: "Santa Iglesia Catedral Basílica de la Encarnación" },
  { aspectRatio: horizontal, src: "grain-of-ukraine/ukraine-landscape-kyiv-region.jpg", collection: null, place: "Ukraine", year: "2022", description: "" },
  { aspectRatio: vertical, src: "alpine-escape/duck-on-fallen-tree-thun-lake.jpg", collection: 'alpine-escape', place: "Lake Thun, Switzerland", year: "2024", description: "Lonely duck." },
  { aspectRatio: horizontal, src: "noir-et-blanc/mohnesee-in-winter-bw.jpg", collection: 'noir-et-blanc', place: "Möhnesee, Germany", year: "2025", description: "Around the lake the air was clear, the sun was shining and yet only a few kilometers away the mist swallowed everything. It felt as if this place existed on another planet." },
  { aspectRatio: vertical, src: "harman-phoenix/whaet-filed-harman.jpg", collection: 'harman-phoenix', place: "NRW, Germany", year: "2025", description: "Golden fields, which remind me of home." },
  { aspectRatio: horizontal, src: "jazzy-blues/jazzy-blues-chamomile.jpg", collection: 'jazzy-blues', place: "Unna, Germany", year: "2023", description: "Camomiles by neighbor's house" },
  { aspectRatio: vertical, src: "european-feel/montmartre-rain-street-paris.jpg", collection: 'european-feel', place: "Montmartre, Paris", year: "2023", description: "Rainy Montmartre" },
  { aspectRatio: horizontal, src: "faces-and-places/girl-with-dogs-prohorivka.jpg", collection: null, place: "Prokhorivka, Ukraine", year: "2021", description: "The dog lady" },
  { aspectRatio: vertical, src: "mind-the-gap/bath-market-uk.jpg", collection: null, place: "Bath Guildhall Market", year: "2025", description: "Belts cut to size" },
  { aspectRatio: vertical, src: "moments-of-stillness/braun-leaves-lake-water-backdrop.jpg", collection: null, place: "Möhnesee, Germany", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/retro-car-bw.jpg", collection: 'noir-et-blanc', place: "Kunstpalast, Düsseldorf", year: "2024", description: "Flower in the Rearview" },
  { aspectRatio: vertical, src: "grain-of-ukraine/podil-kyiv-sunrise.jpg", collection: null, place: "Podil, Kyiv", year: "2025", description: "View on Kontraktova Square at sunrise" },
  { aspectRatio: horizontal, src: "alpine-escape/house-in-mountains-with-dog-murren.jpg", collection: 'alpine-escape', place: "Mürren, Switzerland", year: "2024", description: "" },
  { aspectRatio: vertical, src: "pentax-17/man-with-pipe-big-shot-coffee-paris-pentax17.jpg", collection: null, place: "Paris, France", year: "2024", description: "Leaving Paris, I asked an elderly man outside a café for a portrait. He tried to put his pipe away, but I insisted he keep smoking and ignore me. Despite my usual nerves, I took the shot, said a quick Merci, and hurried off. After sharing the scan with @bigshotcoffee.paris, I learned he was the father of one of the owners. Knowing the photo meant as much to them as it did to me turned a simple frame into a beautiful story." },
  { aspectRatio: horizontal, src: "harman-phoenix/newspaper-on-the-chair.jpg", collection: 'harman-phoenix', place: "Düsseldorf, Germany", year: "2025", description: "Düsseldorfer" },
  { aspectRatio: vertical, src: "european-feel/rainy-sky-paris-city-center.jpg", collection: 'european-feel', place: "Paris, France", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "grain-of-ukraine/kyiv-velotrek-mural.jpg", collection: null, place: "Kyiv Cycle Track", year: "2020", description: "" },
  { aspectRatio: vertical, src: "jazzy-blues/plant-stature-amterdam-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Amsterdam, Netherlands", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "faces-and-places/guys-on-the-beach-italy.jpg", collection: null, place: "Duna Verde, Italy", year: "2024", description: "" },
  { aspectRatio: vertical, src: "mind-the-gap/book-store-bath-market-uk.jpg", collection: null, place: "Bath Guildhall Market", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/artist-portrait-pencil-bw.jpg", collection: 'noir-et-blanc', place: "Düsseldorf, Germany", year: "2024", description: "Artist’s Touch" },
  { aspectRatio: vertical, src: "moments-of-stillness/spring-blooming-trees.jpg", collection: null, place: "Unna, Germany", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "european-feel/brugges-city-center.jpg", collection: 'european-feel', place: "Bruges, Belgium", year: "2024", description: "" },
  { aspectRatio: vertical, src: "pentax-17/golden-hour-canal-venice-pentax17.jpg", collection: null, place: "Venice, Italy", year: "2024", description: "Golden hour on the canal." },
  { aspectRatio: horizontal, src: "harman-phoenix/girl-with-polaroid.jpg", collection: 'harman-phoenix', place: "Ringstead Bay, UK", year: "2025", description: "Polaroid Girl" },
  { aspectRatio: vertical, src: "alpine-escape/mount-reflection-in-lake-alps.jpg", collection: 'alpine-escape', place: "Schilthorn, Switzerland", year: "2024", description: "Mirror-like surfaces on the way up." },
  { aspectRatio: vertical, src: "moments-of-stillness/small-river-in-the-forest.jpg", collection: null, place: "NRW, Germany", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "jazzy-blues/white-cat-walking-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Amsterdam, Netherlands", year: "2024", description: "" },
  { aspectRatio: vertical, src: "pentax-17/night-canal-boat-venice-pentax17.jpg", collection: null, place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "mind-the-gap/charity-shop-vinyl.jpg", collection: null, place: "Charity Shop, Royal Leamington Spa", year: "2025", description: "In search of treasures" },
  { aspectRatio: vertical, src: "alpine-escape/mountain-lake-schilthorn.jpg", collection: 'alpine-escape', place: "Schilthorn, Switzerland", year: "2024", description: "Mountain lake." },
  { aspectRatio: horizontal, src: "grain-of-ukraine/kyiv-ghost-mural-podil.jpg", collection: null, place: "Podil, Kyiv", year: "2022", description: "Ghost of Kyiv" },
  { aspectRatio: vertical, src: "european-feel/view-from-bridge-brugges.jpg", collection: 'european-feel', place: "Bruges, Belgium", year: "2024", description: "So serene..." },
  { aspectRatio: horizontal, src: "faces-and-places/sad-kids-in-the-forest-prohorivka.jpg", collection: null, place: "Prokhorivka, Ukraine", year: "2020", description: "Sad kids" },
  { aspectRatio: vertical, src: "moments-of-stillness/fall-leaves-and-sky.jpg", collection: null, place: "Unna, Germany", year: "2023", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/old-tea-set-bw.jpg", collection: 'noir-et-blanc', place: "Local Café, Unna", year: "2024", description: "Vintage Tea Set" },
  { aspectRatio: vertical, src: "mind-the-gap/trash-cans.jpg", collection: null, place: "Royal Leamington Spa", year: "2025", description: "This view caught my eye during several trips, through both summer and winter. I'm glad I finally had my camera with me to capture this moment forever." },
  { aspectRatio: horizontal, src: "harman-phoenix/cows-on-the-hill.jpg", collection: 'harman-phoenix', place: "Durdle Door, UK", year: "2025", description: "Cows on the hill" },
  { aspectRatio: vertical, src: "pentax-17/cyclist-christmas-amsterdam-pentax17.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2024", description: "Christmas in Amsterdam" },
  { aspectRatio: horizontal, src: "jazzy-blues/lady-smelling-roses.jpg", collection: 'jazzy-blues', place: "Unna, Germany", year: "2024", description: "" },
  { aspectRatio: vertical, src: "european-feel/funiculaire-lyon-france.jpg", collection: 'european-feel', place: "Lyon, France", year: "2025", description: "Up to Fourvière" },
  { aspectRatio: vertical, src: "mind-the-gap/china-town-london.jpg", collection: null, place: "Chinatown, London", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "grain-of-ukraine/ruined-brigde-war-kyiv-region.jpg", collection: null, place: "Irpin, Ukraine", year: "2022", description: "Ruined bridge" },
  { aspectRatio: vertical, src: "pentax-17/bike-corner-canals-amsterdam-pentax17.jpg", collection: null, place: "Amsterdam, Netherlands", year: "2024", description: "Around the corner..." },
  { aspectRatio: horizontal, src: "faces-and-places/girl-in-the-woods.jpg", collection: null, place: "Prokhorivka, Ukraine", year: "2020", description: "" },
  { aspectRatio: vertical, src: "noir-et-blanc/road-in-mist-bw.jpg", collection: 'noir-et-blanc', place: "Misty Road", year: "2025", description: "Heavy mist hung over the ground and blurred into the sky on a freezing winter day. The road fades into the fog just a few hundred meters ahead, as if leading nowhere…" },
  { aspectRatio: horizontal, src: "alpine-escape/alpine-cow.jpg", collection: 'alpine-escape', place: "Mürren, Switzerland", year: "2024", description: "The locals are very friendly here." },
  { aspectRatio: vertical, src: "european-feel/croix-rousse-lyon-france.jpg", collection: 'european-feel', place: "Croix-Rousse, Lyon", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "noir-et-blanc/window-rain-plant-bw.jpg", collection: 'noir-et-blanc', place: "Unna, Germany", year: "2023", description: "Reflection" },
  { aspectRatio: vertical, src: "alpine-escape/cows-in-alps-murren.jpg", collection: 'alpine-escape', place: "Mürren, Switzerland", year: "2024", description: "Tinkle of bells..." },
  { aspectRatio: horizontal, src: "harman-phoenix/english-white-houses.jpg", collection: 'harman-phoenix', place: "Portland, UK", year: "2025", description: "English white houses" },
  { aspectRatio: vertical, src: "mind-the-gap/notting-hill.jpg", collection: null, place: "Notting Hill, London", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "moments-of-stillness/sheep-mother-and-baby-cinestill.jpg", collection: null, place: "Wersten, Düsseldorf", year: "2023", description: "The sheep mother and baby" },
  { aspectRatio: vertical, src: "harman-phoenix/lether-sheep-maastricht.jpg", collection: 'harman-phoenix', place: "Maastricht, Netherlands", year: "2025", description: "I was instantly drawn to the 'sheep' at the entrance and snapped the shot without thinking. Only when invited inside did I realize it was a leather and fur shop. As someone who doesn't support the use of animal products, the irony wasn't lost on me. Sometimes photography is just about the composition, not the context." },
  { aspectRatio: horizontal, src: "jazzy-blues/flowers-in-focus-jazzy-blues.jpg", collection: 'jazzy-blues', place: "Unna, Germany", year: "2023", description: "In focus" },
  { aspectRatio: vertical, src: "moments-of-stillness/flowers-in-jars-munster.jpg", collection: null, place: "Münster, Germany", year: "2023", description: "Flower jars in winter light" },
  { aspectRatio: horizontal, src: "grain-of-ukraine/purple-flowers.jpg", collection: null, place: "Spivoche Pole, Kyiv", year: "2021", description: "" },
  { aspectRatio: vertical, src: "jazzy-blues/flower-in-sunlight.jpg", collection: 'jazzy-blues', place: "Dortmund, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "grain-of-ukraine/vdnh-kyiv-tower.jpg", collection: null, place: "VDNKh, Kyiv", year: "2021", description: "Leftovers of soviet modernism. Last Christmas before full-scale invasion." },
  { aspectRatio: horizontal, src: "faces-and-places/roesterei-vier-dusseldorf.jpg", collection: null, place: "Rösterei VIER (RVTC), Düsseldorf", year: "2023", description: "" },
  { aspectRatio: vertical, src: "harman-phoenix/portland-bill.jpg", collection: 'harman-phoenix', place: "Portland Bill Lighthouse, UK", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "european-feel/light-and-shadow-lyon.jpg", collection: 'european-feel', place: "Lyon, France", year: "2025", description: "Light & shadows" },
  { aspectRatio: vertical, src: "faces-and-places/rooftop-monk-kretinga.jpg", collection: null, place: "Kretinga, Lithuania", year: "2024", description: "Bernardas" },
  { aspectRatio: horizontal, src: "alpine-escape/people-on-the-rock.jpg", collection: 'alpine-escape', place: "Mount Schilthorn, 2,970 meters", year: "2024", description: "On top of the world." },
  { aspectRatio: vertical, src: "faces-and-places/guy-portrait-kyiv-revolog.jpg", collection: null, place: "Bereznyaky, Kyiv", year: "2020", description: "Hore" },
  { aspectRatio: horizontal, src: "alpine-escape/wooden-houses-in-alps.jpg", collection: 'alpine-escape', place: "Lauterbrunnen, Switzerland", year: "2024", description: "" },
  { aspectRatio: vertical, src: "mind-the-gap/soho.jpg", collection: null, place: "Soho, London", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "faces-and-places/mother-and-daughter-revolog.jpg", collection: null, place: "Bereznyaky, Kyiv", year: "2020", description: "" },
  { aspectRatio: vertical, src: "moments-of-stillness/dog-in-the-car.jpg", collection: null, place: "ALDI Parking, Unna", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "mind-the-gap/in-house-library.jpg", collection: null, place: "Notting Hill, London", year: "2025", description: "Home library" },
  { aspectRatio: vertical, src: "grain-of-ukraine/reflection-lviv.jpg", collection: null, place: "Lviv, Ukraine", year: "2025", description: "The ability to reproduce energy and feel it beyond yourself." },
  { aspectRatio: horizontal, src: "jazzy-blues/rolls-roys-car.jpg", collection: 'jazzy-blues', place: "Düsseldorf, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "faces-and-places/girl-in-munster.jpg", collection: null, place: "Münster, Germany", year: "2025", description: "Sister in town" },
  { aspectRatio: horizontal, src: "grain-of-ukraine/hanging-clothes-lviv.jpg", collection: null, place: "Lviv, Ukraine", year: "2025", description: "" },
  { aspectRatio: vertical, src: "european-feel/hanging-clothes-between-houses-venice.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: vertical, src: "faces-and-places/smoking-girl-mural.jpg", collection: null, place: "Münster, Germany", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "alpine-escape/girl-smiling-on-schilthorn.jpg", collection: 'alpine-escape', place: "Schilthorn, Switzerland", year: "2024", description: "It's 5pm and we are still on the very top of the mountain..." },
  { aspectRatio: vertical, src: "mind-the-gap/durdle-door.jpg", collection: null, place: "Durdle Door, UK", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "harman-phoenix/plain-sky-harman.jpg", collection: 'harman-phoenix', place: "Above Birmingham, UK", year: "2025", description: "" },
  { aspectRatio: vertical, src: "european-feel/canal-boats-old-venice.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "" },
  { aspectRatio: horizontal, src: "mind-the-gap/euston-station.jpg", collection: null, place: "Euston Station, London", year: "2025", description: "Empty at 5am" },
  { aspectRatio: vertical, src: "european-feel/venice-first-impression.jpg", collection: 'european-feel', place: "Venice, Italy", year: "2024", description: "First impression" },
  { aspectRatio: horizontal, src: "jazzy-blues/rolls-roys-car-mirror.jpg", collection: 'jazzy-blues', place: "Düsseldorf, Germany", year: "2023", description: "" },
  { aspectRatio: vertical, src: "mind-the-gap/coffee-with-friends.jpg", collection: null, place: "Royal Leamington Spa", year: "2025", description: "The people who make every journey special." },
  { aspectRatio: horizontal, src: "moments-of-stillness/boat-water-lake-geneva.jpg", collection: null, place: "Geneva, Switzerland", year: "2025", description: "The boat" },
  { aspectRatio: vertical, src: "european-feel/barcelona-cathedral.jpg", collection: 'european-feel', place: "Barcelona, Spain", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "grain-of-ukraine/lviv-tram-train-station.jpg", collection: null, place: "Lviv Central Station", year: "2022", description: "" },
  { aspectRatio: vertical, src: "mind-the-gap/pulpit-rock-portland.jpg", collection: null, place: "Pulpit Rock, Portland", year: "2025", description: "" },
  { aspectRatio: horizontal, src: "european-feel/malaga-view-from-the-top.jpg", collection: 'european-feel', place: "La Malagueta, Malaga", year: "2023", description: "" },
  { aspectRatio: vertical, src: "faces-and-places/olives-festa-italiana-unna.jpg", collection: null, place: "Unna, Germany", year: "2023", description: "Una Festa Italiana" },
];
