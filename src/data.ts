export const horizontal = "3/2";
export const vertical = "2/3";

export interface Photo {
  /**
   * S3 key relative to the resizer base, e.g. "european-feel/venice-first-impression.jpg".
   * This is a STORAGE path, not a statement of collection membership — a photo
   * stored under `home-feed/` can still belong to a collection (and several do).
   * Membership is declared once, in `collectionsData` below.
   */
  src: string;
  /** `horizontal` ("3/2") or `vertical` ("2/3"). */
  aspectRatio: string;
  place?: string;
  year?: string;
  description?: string;
}

/**
 * THE source of truth: every photo on the site, exactly once.
 *
 * Order is the curated Overview feed order — this array *is* `homeFeed`.
 * Collections don't restate any of these fields; they list `src` keys and the
 * records are resolved from here (see `collectionsData`/`galleriesData`), so a
 * place or description is only ever edited in one spot. It also means a
 * collection photo cannot be missing from the feed: a `src` that isn't in this
 * array throws at module load rather than silently vanishing from Overview.
 *
 * Ordering intent (unchanged):
 *   - Opens on a strong vertical, since the intro animation deals the whole
 *     grid out from this first frame.
 *   - Orientations are interleaved in short runs (mostly 1-3 verticals or 1-2
 *     horizontals in a row, never more than 5 verticals or 3 horizontals
 *     consecutively, and no 4-wide row is ever all-horizontal) so the 4-column
 *     grid keeps its irregular Swiss rhythm rather than reading as a grid of
 *     uniform rows.
 *   - Kept and retired collections are round-robin interleaved rather than
 *     grouped, so consecutive tiles almost always come from different
 *     collections/trips.
 *
 * To add a photo: add one line here, and — if it belongs to a collection — its
 * `src` to that collection's `photos` list.
 */
export const photos: Photo[] = [
  { src: "european-feel/galeries-lafayette-paris.jpg", aspectRatio: vertical, place: "Paris", year: "2023", description: "Galeries Lafayette" },
  { src: "european-feel/venice-first-impression.jpg", aspectRatio: vertical, place: "Venice, Italy", year: "2024", description: "First impression" },
  { src: "european-feel/paris-city-bike-french-flag.jpg", aspectRatio: vertical, place: "Paris", year: "2023" },
  { src: "home-feed/kfc-road-sign-harman.jpg", aspectRatio: vertical, year: "2026" },
  { src: "home-feed/girls-on-a-boat-amsterdam.jpg", aspectRatio: vertical, place: "Amsterdam", year: "2026", description: "Sunbathing" },
  { src: "european-feel/malaga-cathedral.jpg", aspectRatio: vertical, place: "Malaga, Spain", year: "2023", description: "Santa Iglesia Catedral Basílica de la Encarnación" },
  { src: "home-feed/ryanair-plane-view.jpg", aspectRatio: vertical, year: "2024", description: "Window seat" },
  { src: "european-feel/hanging-clothes-between-houses-venice.jpg", aspectRatio: vertical, place: "Venice, Italy", year: "2024" },
  { src: "european-feel/malaga-view-from-the-top.jpg", aspectRatio: horizontal, place: "Malaga", year: "2023", description: "La Malagueta" },
  { src: "european-feel/rainy-sky-paris-city-center.jpg", aspectRatio: vertical, place: "Paris", year: "2023" },
  { src: "home-feed/statues-at-the-museum.jpg", aspectRatio: horizontal, place: "Langen Foundation", year: "2025" },
  { src: "home-feed/bath-market-uk.jpg", aspectRatio: vertical, place: "Bath Guildhall Market", year: "2025", description: "Belts cut to size" },
  { src: "home-feed/leaves-in-the-darkness.jpg", aspectRatio: vertical, year: "2024" },
  { src: "home-feed/cat-on-the-beach-malaga.jpg", aspectRatio: horizontal, place: "Malaga", year: "2023", description: "A cat on the beach" },
  { src: "european-feel/lyon-street-in-shadow.jpg", aspectRatio: vertical, place: "Lyon, France", year: "2025" },
  { src: "home-feed/spring-blooming-trees.jpg", aspectRatio: vertical, year: "2023" },
  { src: "home-feed/palm-trees-malaga.jpg", aspectRatio: vertical, place: "Malaga, Splain", year: "2023" },
  { src: "home-feed/berlin-u-bahn-on-film.jpg", aspectRatio: horizontal, place: "Berlin, Germany", year: "2025" },
  { src: "harman-phoenix/berlin-museum-stature.jpg", aspectRatio: horizontal, place: "Deutsches Historisches Museum, Berlin", year: "2025" },
  { src: "jazzy-blues/design-books-jazzy-blues.jpg", aspectRatio: vertical, place: "Düsseldorf", year: "2023", description: "This brutal world" },
  { src: "home-feed/night-eiffel-tower-paris-pentax17.jpg", aspectRatio: vertical, place: "Paris", year: "2024", description: "The Eiffel Tower at night." },
  { src: "home-feed/ukraine-landscape-kyiv-region.jpg", aspectRatio: horizontal, place: "Ukraine", year: "2022" },
  { src: "alpine-escape/duck-on-fallen-tree-thun-lake.jpg", aspectRatio: vertical, place: "Lake Thun, Switzerland", year: "2024", description: "Lonely duck." },
  { src: "noir-et-blanc/mohnesee-in-winter-bw.jpg", aspectRatio: horizontal, place: "Möhnesee, Germany", year: "2025", description: "It felt as if this place existed on another planet." },
  { src: "harman-phoenix/whaet-filed-harman.jpg", aspectRatio: vertical, place: "Germany", year: "2025", description: "Golden fields, which remind me of home." },
  { src: "jazzy-blues/jazzy-blues-chamomile.jpg", aspectRatio: horizontal, place: "Unna", year: "2023", description: "Camomiles by neighbor's house" },
  { src: "european-feel/montmartre-rain-street-paris.jpg", aspectRatio: vertical, place: "Paris", year: "2023", description: "Rainy Montmartre" },
  { src: "home-feed/girl-with-dogs-prohorivka.jpg", aspectRatio: horizontal, place: "Prokhorivka, Ukraine", year: "2021", description: "The dog lady" },
  { src: "noir-et-blanc/retro-car-bw.jpg", aspectRatio: horizontal, place: "Kunstpalast, Düsseldorf", year: "2024", description: "Flower in the Rearview" },
  { src: "alpine-escape/house-in-mountains-with-dog-murren.jpg", aspectRatio: horizontal, place: "Mürren, Switzerland", year: "2024" },
  { src: "home-feed/braun-leaves-lake-water-backdrop.jpg", aspectRatio: vertical, year: "2025" },
  { src: "home-feed/man-with-pipe-big-shot-coffee-paris-pentax17.jpg", aspectRatio: vertical, place: "Paris", year: "2024" },
  { src: "harman-phoenix/newspaper-on-the-chair.jpg", aspectRatio: horizontal, place: "Düsseldorf", year: "2025" },
  { src: "home-feed/kyiv-velotrek-mural.jpg", aspectRatio: horizontal, year: "2020", description: "Kyiv Cycle Track" },
  { src: "jazzy-blues/plant-stature-amterdam-jazzy-blues.jpg", aspectRatio: vertical, place: "Amsterdam", year: "2024" },
  { src: "home-feed/guys-on-the-beach-italy.jpg", aspectRatio: horizontal, place: "Duna Verde, Italy", year: "2024" },
  { src: "home-feed/book-store-bath-market-uk.jpg", aspectRatio: vertical, place: "Bath Guildhall Market", year: "2025" },
  { src: "noir-et-blanc/artist-portrait-pencil-bw.jpg", aspectRatio: horizontal, place: "Düsseldorf", year: "2024", description: "Artist’s Touch" },
  { src: "european-feel/brugges-city-center.jpg", aspectRatio: horizontal, place: "Bruges, Belgium", year: "2024" },
  { src: "home-feed/golden-hour-canal-venice-pentax17.jpg", aspectRatio: vertical, place: "Venice, Italy", year: "2024", description: "Golden hour on the canal." },
  { src: "harman-phoenix/girl-with-polaroid.jpg", aspectRatio: horizontal, place: "Ringstead Bay, UK", year: "2025", description: "Polaroid Girl" },
  { src: "alpine-escape/mount-reflection-in-lake-alps.jpg", aspectRatio: vertical, place: "Schilthorn, Switzerland", year: "2024", description: "Mirror-like surfaces on the way up." },
  { src: "home-feed/vanice-on-film.jpg", aspectRatio: vertical, place: "Venice, Italy", year: "2024" },
  { src: "home-feed/small-river-in-the-forest.jpg", aspectRatio: vertical, year: "2023" },
  { src: "jazzy-blues/white-cat-walking-jazzy-blues.jpg", aspectRatio: horizontal, place: "Amsterdam", year: "2024" },
  { src: "home-feed/night-canal-boat-venice-pentax17.jpg", aspectRatio: vertical, place: "Venice, Italy", year: "2024" },
  { src: "home-feed/charity-shop-vinyl.jpg", aspectRatio: horizontal, place: "Charity Shop, Royal Leamington Spa", year: "2025", description: "In search of treasures" },
  { src: "alpine-escape/mountain-lake-schilthorn.jpg", aspectRatio: vertical, place: "Schilthorn, Switzerland", year: "2024", description: "Mountain lake." },
  { src: "home-feed/kyiv-ghost-mural-podil.jpg", aspectRatio: horizontal, place: "Podil", year: "2022", description: "Ghost of Kyiv" },
  { src: "european-feel/view-from-bridge-brugges.jpg", aspectRatio: vertical, place: "Bruges", year: "2024", description: "So serene..." },
  { src: "home-feed/fall-leaves-and-sky.jpg", aspectRatio: vertical, year: "2023" },
  { src: "home-feed/sad-kids-in-the-forest-prohorivka.jpg", aspectRatio: horizontal, place: "Prokhorivka, Ukraine", year: "2020", description: "Sad kids" },
  { src: "noir-et-blanc/old-tea-set-bw.jpg", aspectRatio: horizontal, year: "2024", description: "Vintage Tea Set" },
  { src: "home-feed/trash-cans.jpg", aspectRatio: vertical, place: "Royal Leamington Spa", year: "2025" },
  { src: "harman-phoenix/cows-on-the-hill.jpg", aspectRatio: horizontal, place: "Durdle Door, UK", year: "2025", description: "Cows on the hill" },
  { src: "home-feed/cyclist-christmas-amsterdam-pentax17.jpg", aspectRatio: vertical, year: "2024", description: "Christmas in Amsterdam" },
  { src: "jazzy-blues/lady-smelling-roses.jpg", aspectRatio: horizontal, year: "2024" },
  { src: "european-feel/funiculaire-lyon-france.jpg", aspectRatio: vertical, place: "Lyon", year: "2025", description: "Up to Fourvière" },
  { src: "home-feed/china-town-london.jpg", aspectRatio: vertical, place: "London", year: "2025", description: "Chinatown" },
  { src: "home-feed/ruined-brigde-war-kyiv-region.jpg", aspectRatio: horizontal, place: "Irpin, Ukraine", year: "2022", description: "Ruined bridge" },
  { src: "home-feed/bike-corner-canals-amsterdam-pentax17.jpg", aspectRatio: vertical, place: "Amsterdam", year: "2024", description: "Around the corner..." },
  { src: "home-feed/newspapers-dusseldorfer.jpg", aspectRatio: vertical, place: "Düsseldorf, Germany", year: "2024", description: "Düsseldorfer" },
  { src: "alpine-escape/alpine-cow.jpg", aspectRatio: horizontal, place: "Mürren, Switzerland", year: "2024", description: "The locals are very friendly here." },
  { src: "noir-et-blanc/window-rain-plant-bw.jpg", aspectRatio: horizontal, year: "2023", description: "Reflection" },
  { src: "european-feel/croix-rousse-lyon-france.jpg", aspectRatio: vertical, place: "Lyon", year: "2025", description: "Croix-Rousse" },
  { src: "jazzy-blues/flowers-in-focus-jazzy-blues.jpg", aspectRatio: horizontal, year: "2023" },
  { src: "home-feed/woman-making-hair-at-home.jpg", aspectRatio: vertical, place: "Kretinga, Lithuania", year: "2024" },
  { src: "home-feed/girl-in-the-woods.jpg", aspectRatio: horizontal, place: "Prokhorivka, Ukraine", year: "2020" },
  { src: "alpine-escape/cows-in-alps-murren.jpg", aspectRatio: vertical, place: "Mürren, Switzerland", year: "2024", description: "Tinkle of bells..." },
  { src: "harman-phoenix/english-white-houses.jpg", aspectRatio: horizontal, place: "Portland, UK", year: "2025", description: "English white houses" },
  { src: "home-feed/sheep-mother-and-baby-cinestill.jpg", aspectRatio: horizontal, place: "Wersten, Düsseldorf", year: "2023", description: "The sheep mother and baby" },
  { src: "home-feed/purple-flowers.jpg", aspectRatio: horizontal, place: "Spivoche Pole, Kyiv", year: "2021" },
  { src: "harman-phoenix/lether-sheep-maastricht.jpg", aspectRatio: vertical, place: "Maastricht", year: "2025", description: "Sometimes photography is just about the composition, not the context." },
  { src: "home-feed/flowers-in-jars-munster.jpg", aspectRatio: vertical, place: "Münster", year: "2023", description: "Flower jars in winter light" },
  { src: "home-feed/notting-hill.jpg", aspectRatio: vertical, place: "Notting Hill", year: "2025" },
  { src: "jazzy-blues/flower-in-sunlight.jpg", aspectRatio: vertical, place: "Dortmund", year: "2023" },
  { src: "home-feed/vdnh-kyiv-tower.jpg", aspectRatio: vertical, place: "VDNKh, Kyiv", year: "2021", description: "Leftovers of soviet modernism" },
  { src: "home-feed/roesterei-vier-dusseldorf.jpg", aspectRatio: horizontal, place: "Rösterei VIER (RVTC), Düsseldorf", year: "2023" },
  { src: "harman-phoenix/portland-bill.jpg", aspectRatio: vertical, place: "Portland Bill Lighthouse, UK", year: "2025" },
  { src: "european-feel/light-and-shadow-lyon.jpg", aspectRatio: horizontal, place: "Lyon", year: "2025", description: "Light & shadows" },
  { src: "home-feed/rooftop-monk-kretinga.jpg", aspectRatio: vertical, place: "Kretinga, Lithuania", year: "2024", description: "Bernardas" },
  { src: "alpine-escape/people-on-the-rock.jpg", aspectRatio: horizontal, place: "Mount Schilthorn, 2,970 meters", year: "2024", description: "On top of the world." },
  { src: "home-feed/guy-portrait-kyiv-revolog.jpg", aspectRatio: vertical, place: "Bereznyaky, Kyiv", year: "2020", description: "Hore" },
  { src: "alpine-escape/wooden-houses-in-alps.jpg", aspectRatio: horizontal, place: "Lauterbrunnen, Switzerland", year: "2024" },
  { src: "home-feed/soho.jpg", aspectRatio: vertical, place: "Soho, London", year: "2025" },
  { src: "home-feed/mother-and-daughter-revolog.jpg", aspectRatio: horizontal, place: "Bereznyaky, Kyiv", year: "2020" },
  { src: "home-feed/in-house-library.jpg", aspectRatio: horizontal, place: "Notting Hill, London", year: "2025", description: "Home library" },
  { src: "home-feed/dog-in-the-car.jpg", aspectRatio: vertical, place: "ALDI Parking, Unna", year: "2025" },
  { src: "home-feed/reflection-lviv.jpg", aspectRatio: vertical, place: "Lviv, Ukraine", year: "2025", description: "The ability to reproduce energy and feel it beyond yourself." },
  { src: "jazzy-blues/rolls-roys-car.jpg", aspectRatio: horizontal, place: "Düsseldorf, Germany", year: "2023" },
  { src: "noir-et-blanc/road-in-mist-bw.jpg", aspectRatio: vertical, year: "2025", description: "The road leading nowhere…" },
  { src: "home-feed/girl-in-munster.jpg", aspectRatio: vertical, place: "Münster, Germany", year: "2025", description: "Sister in town" },
  { src: "home-feed/hanging-clothes-lviv.jpg", aspectRatio: horizontal, place: "Lviv, Ukraine", year: "2025" },
  { src: "home-feed/smoking-girl-mural.jpg", aspectRatio: vertical, place: "Münster, Germany", year: "2025" },
  { src: "home-feed/durdle-door.jpg", aspectRatio: vertical, place: "Durdle Door, UK", year: "2025" },
  { src: "home-feed/podil-kyiv-sunrise.jpg", aspectRatio: vertical, place: "Podil, Kyiv", year: "2025", description: "View on Kontraktova Square at sunrise" },
  { src: "harman-phoenix/plain-sky-harman.jpg", aspectRatio: horizontal, place: "Above Birmingham, UK", year: "2025" },
  { src: "home-feed/regent-street-lemington.jpg", aspectRatio: horizontal, place: "Royal Leamington Spa", year: "2025", description: "Turns out, London isn't the only place with a Regent Street." },
  { src: "european-feel/hanging-clothes-venice.jpg", aspectRatio: horizontal, place: "Venice, Italy", year: "2024" },
  { src: "alpine-escape/girl-smiling-on-schilthorn.jpg", aspectRatio: horizontal, place: "Schilthorn, Switzerland", year: "2024", description: "It's 5pm and we are still on the very top of the mountain..." },
  { src: "european-feel/canal-boats-old-venice.jpg", aspectRatio: vertical, place: "Venice, Italy", year: "2024" },
  { src: "home-feed/euston-station.jpg", aspectRatio: horizontal, place: "Euston Station, London", year: "2025", description: "Empty at 5am" },
  { src: "jazzy-blues/rolls-roys-car-mirror.jpg", aspectRatio: horizontal, place: "Düsseldorf, Germany", year: "2023" },
  { src: "home-feed/coffee-with-friends.jpg", aspectRatio: vertical, place: "Royal Leamington Spa", year: "2025", description: "The people who make every journey special." },
  { src: "home-feed/boat-water-lake-geneva.jpg", aspectRatio: horizontal, place: "Geneva, Switzerland", year: "2025", description: "The boat" },
  { src: "european-feel/barcelona-cathedral.jpg", aspectRatio: vertical, place: "Barcelona, Spain", year: "2025" },
  { src: "home-feed/lviv-tram-train-station.jpg", aspectRatio: horizontal, place: "Lviv Central Station", year: "2022" },
  { src: "home-feed/road-signs-mcdonalds-kfc.jpg", aspectRatio: vertical, place: "Kamen, Germany", year: "2026" },
  { src: "home-feed/pulpit-rock-portland.jpg", aspectRatio: vertical, place: "Pulpit Rock, Portland", year: "2025" },
  { src: "home-feed/olives-festa-italiana-unna.jpg", aspectRatio: vertical, place: "Unna, Germany", year: "2023", description: "Una Festa Italiana" },
  { src: "home-feed/a-horse-on-film.jpg", aspectRatio: vertical, place: "Unna, Germany", year: "2025", description: "I was amazed by how they take care of horses here..." },
  { src: "home-feed/amsterdam-locals.jpg", aspectRatio: vertical, place: "Amsterdam, Netherlands", year: "2026" },
  { src: "home-feed/amsterdam-tableware.jpg", aspectRatio: horizontal, place: "Tableware, Amsterdam", year: "2026" },
  { src: "home-feed/disnayland-atractions-cart-farther-and-daughter.jpg", aspectRatio: vertical, place: "Disnayland, Paris", year: "2024" },
  { src: "home-feed/berlin-street-bike-passing-by.jpg", aspectRatio: horizontal, place: "Berlin, Germany", year: "2024" },
  { src: "home-feed/cat-covered-in-blanket.jpg", aspectRatio: vertical, place: "Kretinga, Lithuania", year: "2024", description: "Gucci" },
  { src: "home-feed/cirmes-vibes-munster.jpg", aspectRatio: vertical, place: "Münster, Germany", year: "2025", description: "Cirmes Vibes" },
  { src: "home-feed/barcelona-morning-rush-hour.jpg", aspectRatio: horizontal, place: "Barcelona, Spain", year: "2025" },
  { src: "home-feed/dog-im-amsterdam.jpg", aspectRatio: vertical, place: "Amsterdam, Netherlands", year: "2026" },
  { src: "home-feed/dusseldorf-turm-harman.jpg", aspectRatio: vertical, place: "Düsseldorf, Germany", year: "2026" },
  { src: "home-feed/gertrudes-painting-amsterdam-canals-studio.jpg", aspectRatio: horizontal, place: "Gertrud D Galleries, Amsterdam", year: "2023" },
  { src: "alpine-escape/girl-hiking-up-the-mountain.jpg", aspectRatio: vertical, place: "Lauterbrunnen, Switzerland", year: "2024" },
  { src: "home-feed/girl-pumpkin-head-playing-ps.jpg", aspectRatio: horizontal, year: "2025", description: "Halloween Fortnite Round" },
  { src: "home-feed/guys-on-the-boat-amsterdam.jpg", aspectRatio: horizontal, place: "Amsterdam, Netherlands", year: "2026" },
  { src: "home-feed/indian-village-in-lithuania.jpg", aspectRatio: horizontal, place: "Vinetu Kaimas, Lithuania", year: "2024", description: "“Vinetu Village” is an authentic Native American living museum, nestled in the scenic Akmena-Danė river valley near Kretinga." },
  { src: "home-feed/japanese-food.jpg", aspectRatio: vertical, place: "Little Tokyo, Düsseldorf's Japanese quarter", year: "2023" },
  { src: "home-feed/kochem-castle.jpg", aspectRatio: horizontal, place: "Reichsburg Castle, Cochem", year: "2023" },
  { src: "home-feed/love-harman.jpg", aspectRatio: vertical, place: "Düsseldorf, Germany", year: "2025" },
  { src: "home-feed/netherlands-boat-amsterdam.jpg", aspectRatio: vertical, place: "Amsterdam, Netherlands", year: "2026" },
  { src: "home-feed/old-man-sitting-at-the-caffe.jpg", aspectRatio: horizontal, place: "Bath, UK", year: "2025" },
  { src: "home-feed/rhine-sunset-harman.jpg", aspectRatio: horizontal, place: "Düsseldorf, Germany", year: "2026" },
  { src: "home-feed/street-autumn-bike-leaves.jpg", aspectRatio: vertical, place: "Unna, Germany", year: "2023" },
  { src: "home-feed/view-from-the-bus-front-window-london.jpg", aspectRatio: vertical, place: "London, UK", year: "2026" },
  { src: "home-feed/young-couple.jpg", aspectRatio: horizontal, place: "Lviv, Ukraine", year: "2025" },
];

/** The unified Overview feed. Every photo, in the order declared above. */
export const homeFeed = photos;

/** Slugs of the 5 collections that remain browsable under `/collections`. */
export const keptCollectionSlugs = ["noir-et-blanc", "alpine-escape", "harman-phoenix", "european-feel", "jazzy-blues"] as const;
export type CollectionSlug = (typeof keptCollectionSlugs)[number];

/**
 * Collection name/description plus an ORDERED list of `Photo.src` keys. The
 * order here is the collection's own — deliberately not the feed's, since the
 * first entry is both the collection's cover on `/collections` and the frame
 * the collection page's deal-out animation starts from.
 */
interface CollectionData {
  name: string;
  description: string;
  photos: string[];
}

const collectionsData: Record<CollectionSlug, CollectionData> = {
  "noir-et-blanc": {
    name: "Noir et Blanc",
    description: "Fragments of everyday life and small adventures.",
    photos: [
      "noir-et-blanc/road-in-mist-bw.jpg",
      "noir-et-blanc/mohnesee-in-winter-bw.jpg",
      "noir-et-blanc/retro-car-bw.jpg",
      "noir-et-blanc/artist-portrait-pencil-bw.jpg",
      "noir-et-blanc/old-tea-set-bw.jpg",
      "noir-et-blanc/window-rain-plant-bw.jpg",
    ],
  },
  "alpine-escape": {
    name: "Alpine Escape",
    description: "26 kilometers, 2,970 meters, and memories to last a lifetime. This collection documents a trip through the Lauterbrunnen Valley, centered around the hike up Mount Schilthorn.",
    photos: [
      "alpine-escape/wooden-houses-in-alps.jpg",
      "alpine-escape/duck-on-fallen-tree-thun-lake.jpg",
      "alpine-escape/house-in-mountains-with-dog-murren.jpg",
      "alpine-escape/mount-reflection-in-lake-alps.jpg",
      "alpine-escape/mountain-lake-schilthorn.jpg",
      "alpine-escape/alpine-cow.jpg",
      "alpine-escape/cows-in-alps-murren.jpg",
      "alpine-escape/people-on-the-rock.jpg",
      "alpine-escape/girl-smiling-on-schilthorn.jpg",
      "alpine-escape/girl-hiking-up-the-mountain.jpg",
    ],
  },
  "harman-phoenix": {
    name: "Harman Phoenix",
    description: "Exploring the high-contrast world of Harman Phoenix: burning reds and dreamy blue tones...",
    photos: [
      "harman-phoenix/cows-on-the-hill.jpg",
      "harman-phoenix/portland-bill.jpg",
      "harman-phoenix/whaet-filed-harman.jpg",
      "home-feed/kfc-road-sign-harman.jpg",
      "harman-phoenix/berlin-museum-stature.jpg",
      "home-feed/old-man-sitting-at-the-caffe.jpg",
      "harman-phoenix/newspaper-on-the-chair.jpg",
      "harman-phoenix/girl-with-polaroid.jpg",
      "home-feed/dusseldorf-turm-harman.jpg",
      "harman-phoenix/english-white-houses.jpg",
      "harman-phoenix/lether-sheep-maastricht.jpg",
      "harman-phoenix/plain-sky-harman.jpg",
      "home-feed/love-harman.jpg",
      "home-feed/rhine-sunset-harman.jpg",
      "home-feed/road-signs-mcdonalds-kfc.jpg",
    ],
  },
  "european-feel": {
    name: "European Feel",
    description: "“Anyone who keeps the ability to see beauty never grows old.“ — Franz Kafka",
    photos: [
      "european-feel/galeries-lafayette-paris.jpg",
      "european-feel/montmartre-rain-street-paris.jpg",
      "european-feel/rainy-sky-paris-city-center.jpg",
      "european-feel/brugges-city-center.jpg",
      "home-feed/vanice-on-film.jpg",
      "european-feel/view-from-bridge-brugges.jpg",
      "european-feel/funiculaire-lyon-france.jpg",
      "european-feel/croix-rousse-lyon-france.jpg",
      "european-feel/light-and-shadow-lyon.jpg",
      "home-feed/barcelona-morning-rush-hour.jpg",
      "european-feel/lyon-street-in-shadow.jpg",
      "european-feel/hanging-clothes-venice.jpg",
      "home-feed/bike-corner-canals-amsterdam-pentax17.jpg",
      "european-feel/canal-boats-old-venice.jpg",
      "european-feel/venice-first-impression.jpg",
      "european-feel/barcelona-cathedral.jpg",
      "european-feel/hanging-clothes-between-houses-venice.jpg",
      "european-feel/malaga-view-from-the-top.jpg",
      "european-feel/malaga-cathedral.jpg",
      "european-feel/paris-city-bike-french-flag.jpg",
    ],
  },
  "jazzy-blues": {
    name: "Jazzy Blues",
    description: "Years of experimenting with expired ISO 25 film, in a few frames...",
    photos: [
      "jazzy-blues/design-books-jazzy-blues.jpg",
      "jazzy-blues/jazzy-blues-chamomile.jpg",
      "jazzy-blues/plant-stature-amterdam-jazzy-blues.jpg",
      "jazzy-blues/rolls-roys-car-mirror.jpg",
      "jazzy-blues/lady-smelling-roses.jpg",
      "jazzy-blues/flower-in-sunlight.jpg",
      "jazzy-blues/rolls-roys-car.jpg",
      "jazzy-blues/white-cat-walking-jazzy-blues.jpg",
      "jazzy-blues/flowers-in-focus-jazzy-blues.jpg",
    ],
  },
};

export interface Gallery {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
}

const photosBySrc = new Map(photos.map((photo) => [photo.src, photo]));

/**
 * Collections with their `src` keys resolved to the real `Photo` records.
 * Built once at module load; an unknown key is a typo that would otherwise
 * render as a broken tile, so it throws here instead.
 */
export const galleriesData: Record<CollectionSlug, Gallery> = Object.fromEntries(
  keptCollectionSlugs.map((slug) => {
    const { name, description, photos: srcs } = collectionsData[slug];
    return [
      slug,
      {
        id: slug,
        name,
        description,
        photos: srcs.map((src) => {
          const photo = photosBySrc.get(src);
          if (!photo) {
            throw new Error(`Collection "${slug}" lists "${src}", which is not in \`photos\`.`);
          }
          return photo;
        }),
      },
    ];
  })
) as Record<CollectionSlug, Gallery>;
