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
    'mind-the-gap': {
    id: 'mind-the-gap',
    name: "Mind the Gap",
    description: "A collection of photographs from multiple journeys across the United Kingdom, exploring the architecture, landscapes, and daily life of the British Isles.",
    photos: [
      { aspectRatio: vertical, path: "china-town-london.jpg", place: "Chinatown, London", year: "2025", description: "" },
      { aspectRatio: vertical, path: "bath-market-uk.jpg", place: "Bath Guildhall Market", year: "2025", description: "Belts cut to size" },
      { aspectRatio: vertical, path: "book-store-bath-market-uk.jpg", place: "Bath Guildhall Market", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "charity-shop-vinyl.jpg", place: "Charity Shop, Royal Leamington Spa", year: "2025", description: "In search of treasures" },
      { aspectRatio: vertical, path: "trash-cans.jpg", place: "Royal Leamington Spa", year: "2025", description: "This view caught my eye during several trips, through both summer and winter. I'm glad I finally had my camera with me to capture this moment forever." },
      { aspectRatio: vertical, path: "notting-hill.jpg", place: "Notting Hill, London", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "in-house-library.jpg", place: "Notting Hill, London", year: "2025", description: "Home library" },
      { aspectRatio: horizontal, path: "euston-station.jpg", place: "Euston Station, London", year: "2025", description: "Empty at 5am" },
      { aspectRatio: vertical, path: "soho.jpg", place: "Soho, London", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "regent-street-lemington.jpg", place: "Royal Leamington Spa", year: "2025", description: "Turns out, London isn't the only place with a Regent Street." },
      { aspectRatio: vertical, path: "durdle-door.jpg", place: "Durdle Door, UK", year: "2025", description: "" },
      { aspectRatio: vertical, path: "pulpit-rock-portland.jpg", place: "Pulpit Rock, Portland", year: "2025", description: "" },
      { aspectRatio: vertical, path: "coffee-with-friends.jpg", place: "Royal Leamington Spa", year: "2025", description: "The people who make every journey special." },
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
  'moments-of-stillness': {
    id: 'moments-of-stillness',
    name: "Moments of Stillness",
    description: "Capturing the shifting seasons and moments in between. My personal favourite: three flowers hanging in jars, still blooming in winter's cold and glowing in the golden hour light. This collection is dedicated to the nature and quiet life around us.",
    photos: [
      { aspectRatio: vertical, path: "braun-leaves-lake-water-backdrop.jpg", place: "Möhnesee, Germany", year: "2025", description: "" },
      { aspectRatio: horizontal, path: "cat-on-the-beach-malaga.jpg", place: "Malaga, Spain", year: "2023", description: "A cat on the beach" },
      { aspectRatio: horizontal, path: "spring-mognolia-blooming.jpg", place: "Unna, Germany", year: "2025", description: "Mognolia blossoms" },
      { aspectRatio: vertical, path: "spring-blooming-trees.jpg", place: "Unna, Germany", year: "2023", description: "" },
      { aspectRatio: vertical, path: "small-river-in-the-forest.jpg", place: "NRW, Germany", year: "2023", description: "" },
      { aspectRatio: vertical, path: "fall-leaves-and-sky.jpg", place: "Unna, Germany", year: "2023", description: "" },
      { aspectRatio: horizontal, path: "sheep-mother-and-baby-cinestill.jpg", place: "Wersten, Düsseldorf", year: "2023", description: "The sheep mother and baby" },
      { aspectRatio: vertical, path: "flowers-in-jars-munster.jpg", place: "Münster, Germany", year: "2023", description: "Flower jars in winter light" },
      { aspectRatio: horizontal, path: "boat-water-lake-geneva.jpg", place: "Geneva, Switzerland", year: "2025", description: "The boat" },
      { aspectRatio: vertical, path: "dog-in-the-car.jpg", place: "ALDI Parking, Unna", year: "2025", description: "" },
    ],
  },
  'grain-of-ukraine': {
    id: 'grain-of-ukraine',
    name: "Grain of Ukraine",
    description: "Ukraine on film. Looking back, I realize I didn't shoot nearly as much as I should have when I lived there. These images, taken both before and during the full-scale invasion, include my life as a local and many trips back home. After years abroad, returning to these well-known places gave me a completely different perspective...",
    photos: [
      { aspectRatio: vertical, path: "podil-kyiv-sunrise.jpg", place: "Podil, Kyiv", year: "2025", description: "View on Kontraktova Square at sunrise" },
      { aspectRatio: horizontal, path: "kyiv-velotrek-mural.jpg", place: "Kyiv Cycle Track", year: "2020", description: "" },
      { aspectRatio: horizontal, path: "kyiv-ghost-mural-podil.jpg", place: "Podil, Kyiv", year: "2022", description: "Ghost of Kyiv" },
      { aspectRatio: horizontal, path: "ukraine-landscape-kyiv-region.jpg", place: "Ukraine", year: "2022", description: "" },
      { aspectRatio: horizontal, path: "ruined-brigde-war-kyiv-region.jpg", place: "Irpin, Ukraine", year: "2022", description: "Ruined bridge" },
      { aspectRatio: horizontal, path: "purple-flowers.jpg", place: "Spivoche Pole, Kyiv", year: "2021", description: "" },
      { aspectRatio: horizontal, path: "hanging-clothes-lviv.jpg", place: "Lviv, Ukraine", year: "2025", description: "" },
      { aspectRatio: vertical, path: "reflection-lviv.jpg", place: "Lviv, Ukraine", year: "2025", description: "The ability to reproduce energy and feel it beyond yourself." },
      { aspectRatio: horizontal, path: "lviv-tram-train-station.jpg", place: "Lviv Central Station", year: "2022", description: "" },
      { aspectRatio: vertical, path: "vdnh-kyiv-tower.jpg", place: "VDNKh, Kyiv", year: "2021", description: "Leftovers of soviet modernism. Last Christmas before full-scale invasion." },
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
  'pentax-17': {
    id: 'pentax-17',
    name: "Pentax 17",
    description: "A collection of picture made on Pentax 17. Explore the uniqueness of half-frame format, the grain of 35mm film split in two...",
    photos: [
      { aspectRatio: vertical, path: "night-eiffel-tower-paris-pentax17.jpg", place: "Paris, France", year: "2024", description: "The Eiffel Tower at night." },
      { aspectRatio: vertical, path: "man-with-pipe-big-shot-coffee-paris-pentax17.jpg", place: "Paris, France", year: "2024", description: "Leaving Paris, I asked an elderly man outside a café for a portrait. He tried to put his pipe away, but I insisted he keep smoking and ignore me. Despite my usual nerves, I took the shot, said a quick Merci, and hurried off. After sharing the scan with @bigshotcoffee.paris, I learned he was the father of one of the owners. Knowing the photo meant as much to them as it did to me turned a simple frame into a beautiful story." },
      { aspectRatio: vertical, path: "golden-hour-canal-venice-pentax17.jpg", place: "Venice, Italy", year: "2024", description: "Golden hour on the canal." },
      { aspectRatio: vertical, path: "night-canal-boat-venice-pentax17.jpg", place: "Venice, Italy", year: "2024", description: "" },
      { aspectRatio: vertical, path: "cyclist-christmas-amsterdam-pentax17.jpg", place: "Amsterdam, Netherlands", year: "2024", description: "Christmas in Amsterdam" },
      { aspectRatio: vertical, path: "bike-corner-canals-amsterdam-pentax17.jpg", place: "Amsterdam, Netherlands", year: "2024", description: "Around the corner..." },
    ],
  },
  'faces-and-places': {
    id: 'faces-and-places',
    name: "Faces and Places",
    description: "Pictures of people I know, strangers I met and moments that tell a story...",
    photos: [
      { aspectRatio: vertical, path: "olives-festa-italiana-unna.jpg", place: "Unna, Germany", year: "2023", description: "Una Festa Italiana" },
      { aspectRatio: horizontal, path: "girl-with-dogs-prohorivka.jpg", place: "Prokhorivka, Ukraine", year: "2021", description: "The dog lady" },
      { aspectRatio: horizontal, path: "guys-on-the-beach-italy.jpg", place: "Duna Verde, Italy", year: "2024", description: "" },
      { aspectRatio: horizontal, path: "sad-kids-in-the-forest-prohorivka.jpg", place: "Prokhorivka, Ukraine", year: "2020", description: "Sad kids" },
      { aspectRatio: horizontal, path: "girl-in-the-woods.jpg", place: "Prokhorivka, Ukraine", year: "2020", description: "" },
      { aspectRatio: vertical, path: "rooftop-monk-kretinga.jpg", place: "Kretinga, Lithuania", year: "2024", description: "Bernardas" },
      { aspectRatio: horizontal, path: "roesterei-vier-dusseldorf.jpg", place: "Rösterei VIER (RVTC), Düsseldorf", year: "2023", description: "" },
      { aspectRatio: horizontal, path: "mother-and-daughter-revolog.jpg", place: "Bereznyaky, Kyiv", year: "2020", description: "" },
      { aspectRatio: vertical, path: "guy-portrait-kyiv-revolog.jpg", place: "Bereznyaky, Kyiv", year: "2020", description: "Hore" },
      { aspectRatio: vertical, path: "girl-in-munster.jpg", place: "Münster, Germany", year: "2025", description: "Sister in town" },
      { aspectRatio: vertical, path: "smoking-girl-mural.jpg", place: "Münster, Germany", year: "2025", description: "" },
    ],
  },
};
