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
    description: "Series of photos captured in 2024 during a trip with friends to Lauterbrunnen region, Switzerland. These images hold memories and impressions from an unforgettable 26 km hike up Mount Schilthorn (2,970 meters) and surroundings.",
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
  'moments-of-stillness': {
    id: 'moments-of-stillness',
    name: "Moments of Stillness",
    description: "If you look closely, you'll find images captured across the changing seasons. My personal favourite: three flowers hanging in jars, still blooming in winter's cold and glowing in the golden hour light. This collection is dedicated to the nature and quiet life around us.",
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
  'european-feel': {
    id: 'european-feel',
    name: "European Feel",
    description: "A collection of travel moments from Paris, Lyon, Venice, and Bruges, captured in 2023-2025",
    photos: [
      { aspectRatio: vertical, path: "galeries-lafayette-paris.jpg", place: "Paris, France", year: "2023", description: "Looking down." },
      { aspectRatio: vertical, path: "montmartre-rain-street-paris.jpg", place: "Paris, France", year: "2023", description: "Rainy Montmartre." },
      { aspectRatio: vertical, path: "rainy-sky-paris-city-center.jpg", place: "Paris, France", year: "2023", description: "Grey skies over the Seine." },
      { aspectRatio: horizontal, path: "brugges-city-center.jpg", place: "Bruges, Belgium", year: "2024", description: "Fairytale streets." },
      { aspectRatio: vertical, path: "view-from-bridge-brugges.jpg", place: "Bruges, Belgium", year: "2024", description: "Canal reflections." },
      { aspectRatio: vertical, path: "funiculaire-lyon-france.jpg", place: "Lyon, France", year: "2023", description: "Up to Fourvière." },
      { aspectRatio: vertical, path: "croix-rousse-lyon-france.jpg", place: "Lyon, France", year: "2023", description: "The hills of Lyon." },
      { aspectRatio: horizontal, path: "light-and-shadow-lyon.jpg", place: "Lyon, France", year: "2025", description: "Domestic details." },
      { aspectRatio: vertical, path: "lyon-street-in-shadow.jpg", place: "Lyon, France", year: "2025", description: "Domestic details." },
      { aspectRatio: horizontal, path: "hanging-clothes-venice.jpg", place: "Venice, Italy", year: "2024", description: "Domestic details." },
      { aspectRatio: vertical, path: "hanging-clothes-between-houses-venice.jpg", place: "Venice, Italy", year: "2024", description: "Old world charm." },
      { aspectRatio: vertical, path: "canal-boats-old-venice.jpg", place: "Venice, Italy", year: "2024", description: "Gondolas at rest." },
      { aspectRatio: vertical, path: "venice-first-impression.jpg", place: "Venice, Italy", year: "2024", description: "Gondolas at rest." },
      { aspectRatio: vertical, path: "barcelona-cathedral.jpg", place: "Barcelona, Spain", year: "2025", description: "Gondolas at rest." },
      { aspectRatio: horizontal, path: "malaga-view-from-the-top.jpg", place: "Malaga, Spain", year: "2023", description: "Gondolas at rest." },
      { aspectRatio: vertical, path: "malaga-cathedral.jpg", place: "Malaga, Spain", year: "2023", description: "Gondolas at rest." },
    ],
  },
  'grain-of-ukraine': {
    id: 'grain-of-ukraine',
    name: "Grain of Ukraine",
    description: "Ukraine on film, Kyiv and Kyiv region mostly...",
    photos: [
      { aspectRatio: vertical, path: "podil-kyiv-sunrise.jpg", place: "Kyiv, Ukraine", year: "2021", description: "Street art on the cycle track." },
      { aspectRatio: horizontal, path: "kyiv-velotrek-mural.jpg", place: "Kyiv, Ukraine", year: "2021", description: "Street art on the cycle track." },
      { aspectRatio: horizontal, path: "kyiv-ghost-mural-podil.jpg", place: "Kyiv, Ukraine", year: "2021", description: "Murals of Podil." },
      { aspectRatio: horizontal, path: "ukraine-landscape-kyiv-region.jpg", place: "Kyiv Region, Ukraine", year: "2021", description: "Vast horizons." },
      { aspectRatio: horizontal, path: "ruined-brigde-war-kyiv-region.jpg", place: "Irpin, Ukraine", year: "2022", description: "Witness of history." },
      { aspectRatio: horizontal, path: "purple-flowers.jpg", place: "Kyiv, Ukraine", year: "2021", description: "Soviet modernism." },
      { aspectRatio: horizontal, path: "hanging-clothes-lviv.jpg", place: "Lviv, Ukraine", year: "2022", description: "Witness of history." },
      { aspectRatio: vertical, path: "reflection-lviv.jpg", place: "Lviv, Ukraine", year: "2022", description: "Soviet modernism." },
      { aspectRatio: horizontal, path: "lviv-tram-train-station.jpg", place: "Lviv, Ukraine", year: "2022", description: "Witness of history." },
      { aspectRatio: vertical, path: "vdnh-kyiv-tower.jpg", place: "Kyiv, Ukraine", year: "2021", description: "Soviet modernism." },
    ],
  },
  'jazzy-blues': {
    id: 'jazzy-blues',
    name: "Jazzy Blues",
    description: "Ever heard of the 25 ISO Jazzy Blues film roll? You'll be lucky if at least half of it ends up properly exposed. I shot one roll a year, and this is all I can share after two years of experimenting. The last two shots were taken in Kyiv in 2020 with my first camera — FED-5 and a Revolog roll. Feels a little jazzy, doesn't it?",
    photos: [
      { aspectRatio: vertical, path: "plant-stature-amterdam-jazzy-blues.jpg", place: "Amsterdam, Netherlands", year: "2023", description: "Experimental colors." },
      { aspectRatio: horizontal, path: "jazzy-blues-chamomile.jpg", place: "Düsseldorf, Germany", year: "2023", description: "Field of flowers." },
      { aspectRatio: vertical, path: "design-books-jazzy-blues.jpg", place: "Düsseldorf, Germany", year: "2023", description: "Colorful spines." },
      { aspectRatio: horizontal, path: "white-cat-walking-jazzy-blues.jpg", place: "Düsseldorf, Germany", year: "2023", description: "Stalking in the grass." },
      { aspectRatio: horizontal, path: "lady-smelling-roses.jpg", place: "Düsseldorf, Germany", year: "2023", description: "Fragrance of summer." },
      { aspectRatio: horizontal, path: "flowers-in-focus-jazzy-blues.jpg", place: "Unna, Germany", year: "2023", description: "Fragrance of summer." },
      { aspectRatio: vertical, path: "flower-in-sunlight.jpg", place: "Dortmund, Germany", year: "2023", description: "Fragrance of summer." },
      { aspectRatio: horizontal, path: "rolls-roys-car.jpg", place: "Unna, Germany", year: "2023", description: "Fragrance of summer." },
      { aspectRatio: horizontal, path: "rolls-roys-car-mirror.jpg", place: "Unna, Germany", year: "2023", description: "Fragrance of summer." },
    ],
  },
  'faces-and-places': {
    id: 'faces-and-places',
    name: "Faces and Places",
    description: "Pictures of people I know, strangers I met and moments that tell a story...",
    photos: [
      { aspectRatio: vertical, path: "olives-festa-italiana-unna.jpg", place: "Unna, Germany", year: "2024", description: "Italian festival." },
      { aspectRatio: horizontal, path: "girl-with-dogs-prohorivka.jpg", place: "Prokhorivka, Ukraine", year: "2021", description: "Summer by the river." },
      { aspectRatio: horizontal, path: "guys-on-the-beach-italy.jpg", place: "Rimini, Italy", year: "2023", description: "Beach days." },
      { aspectRatio: horizontal, path: "sad-kids-in-the-forest-prohorivka.jpg", place: "Prokhorivka, Ukraine", year: "2021", description: "Forest exploring." },
      { aspectRatio: horizontal, path: "girl-in-the-woods.jpg", place: "Prokhorivka, Ukraine", year: "2021", description: "Quiet moments." },
      { aspectRatio: vertical, path: "rooftop-monk-kretinga.jpg", place: "Kretinga, Lithuania", year: "2023", description: "Perspective." },
      { aspectRatio: horizontal, path: "roesterei-vier-dusseldorf.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Coffee culture." },
      { aspectRatio: horizontal, path: "mother-and-daughter-revolog.jpg", place: "Kyiv, Ukraine", year: "2020", description: "Early experiments." },
      { aspectRatio: vertical, path: "guy-portrait-kyiv-revolog.jpg", place: "Kyiv, Ukraine", year: "2020", description: "Portrait on FED-5." },
      { aspectRatio: vertical, path: "girl-in-munster.jpg", place: "Münster, Germany", year: "2024", description: "Portrait on FED-5." },
      { aspectRatio: vertical, path: "smoking-girl-mural.jpg", place: "Münster, Germany", year: "2024", description: "Portrait on FED-5." },
    ],
  },
  'mind-the-gap-son': {
    id: 'mind-the-gap-son',
    name: "Mind the Gap, Son",
    description: "A collection of photos from my trips to UK in 2025.",
    photos: [
      { aspectRatio: vertical, path: "china-town-london.jpg", place: "London, UK", year: "2024", description: "Vibrant streets." },
      { aspectRatio: vertical, path: "bath-market-uk.jpg", place: "Bath, UK", year: "2024", description: "Market day." },
      { aspectRatio: vertical, path: "book-store-bath-market-uk.jpg", place: "Bath, UK", year: "2024", description: "A haven for book lovers." },
      { aspectRatio: horizontal, path: "charity-shop-vinyl.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: vertical, path: "trash-cans.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: vertical, path: "notting-hill.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: horizontal, path: "in-house-library.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: horizontal, path: "euston-station.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: vertical, path: "soho.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: horizontal, path: "regent-street-lemington.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: vertical, path: "durdle-door.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: vertical, path: "pulpit-rock-portland.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
      { aspectRatio: vertical, path: "coffee-with-friends.jpg", place: "Düsseldorf, Germany", year: "2024", description: "Finding treasures." },
    ],
  },
  'harman-phoenix': {
    id: 'harman-phoenix',
    name: "Harman Phoenix",
    description: "A collection of photos shot on Harman Phoenix 200 film, a black and white film with a unique character. These images capture the beauty of the country and its people, and serve as a reminder of what was lost.",
    photos: [
      { aspectRatio: horizontal, path: "berlin-museum-stature.jpg", place: "Berlin, Germany", year: "2025", description: "Berlin's museum stature." },
      { aspectRatio: vertical, path: "whaet-filed-harman.jpg", place: "NRW, Germany", year: "2025", description: "Golden fields." },
      { aspectRatio: horizontal, path: "newspaper-on-the-chair.jpg", place: "Düsseldorf, Germany", year: "2025", description: "Newspaper on the chair." },
      { aspectRatio: horizontal, path: "girl-with-polaroid.jpg", place: "Ringstead Bay, UK", year: "2025", description: "Girl with polaroid." },
      { aspectRatio: horizontal, path: "cows-on-the-hill.jpg", place: "Durdle Door, UK", year: "2025", description: "Cows on the hill." },
      { aspectRatio: horizontal, path: "english-white-houses.jpg", place: "Birmingham, UK", year: "2025", description: "English white houses." },
      { aspectRatio: vertical, path: "lether-sheep-maastricht.jpg", place: "Maastricht, Netherlands", year: "2025", description: "Lether sheep." },
      { aspectRatio: vertical, path: "portland-bill.jpg", place: "Portland Bill Lighthouse, UK", year: "2025", description: "Portland Bill Lighthouse." },
      { aspectRatio: horizontal, path: "plain-sky-harman.jpg", place: "Birmingham, UK", year: "2025", description: "Plain sky." },
    ],
  },
};
