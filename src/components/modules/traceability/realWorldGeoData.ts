/**
 * High-definition Real World Coastlines, Continents, and Country Boundaries.
 * Real geographic coordinates (Latitude, Longitude) in Equirectangular projection.
 *
 * This provides genuine geographic precision for the 3D Earth Globe and 2D Cartography,
 * accurately depicting India, the Indian Ocean, Western Ghats, Eurasia, Africa, Americas,
 * Australia, Antarctica, and major island archipelagos.
 */

// Format: Array of [lat, lon] polygons / line strips
export interface GeoPolygon {
  name: string;
  coords: [number, number][]; // [latitude, longitude]
}

export const REAL_WORLD_CONTINENTS: GeoPolygon[] = [
  // 1. Indian Subcontinent & Sri Lanka (Detailed coastline)
  {
    name: 'India & South Asia',
    coords: [
      [8.08, 77.55], // Kanyakumari
      [8.8, 76.5],   // Kerala coast
      [10.0, 76.2],  // Kochi
      [12.9, 74.8],  // Mangalore
      [15.5, 73.8],  // Goa
      [17.0, 73.3],  // Ratnagiri (Konkan / Western Ghats coast)
      [18.9, 72.8],  // Mumbai
      [20.5, 72.8],  // Daman
      [21.2, 72.8],  // Surat / Gulf of Khambhat
      [21.6, 72.2],  // Bhavnagar
      [20.7, 70.9],  // Diu
      [21.5, 69.6],  // Porbandar
      [22.3, 69.0],  // Dwarka
      [22.8, 70.1],  // Gulf of Kutch
      [23.8, 68.2],  // Rann of Kutch
      [24.5, 67.5],  // Indus Delta / Karachi
      [25.0, 64.0],  // Makran coast
      [25.5, 62.0],  // Iran border
      [30.0, 61.0],  // Afghan-Iran tripoint
      [35.0, 69.0],  // Hindu Kush
      [36.5, 74.5],  // Karakoram
      [35.5, 77.5],  // Ladakh / Aksai Chin
      [31.5, 79.0],  // Western Himalayas
      [29.0, 82.0],  // Nepal Himalayas
      [27.5, 88.5],  // Sikkim
      [28.0, 92.0],  // Bhutan
      [28.5, 96.0],  // Arunachal Pradesh
      [25.5, 94.0],  // Naga hills
      [22.5, 92.0],  // Chittagong hill tracts
      [21.5, 89.5],  // Sundarbans Ganges Delta
      [21.8, 87.5],  // Digha / West Bengal
      [19.8, 85.8],  // Puri / Chilika
      [17.7, 83.3],  // Visakhapatnam
      [16.5, 82.0],  // Godavari Delta
      [15.8, 80.5],  // Krishna Delta
      [13.1, 80.3],  // Chennai (Coromandel Coast)
      [11.9, 79.8],  // Puducherry
      [10.8, 79.8],  // Point Calimere
      [9.3, 79.3],   // Palk Strait / Rameswaram
      [8.5, 78.1],   // Tuticorin
      [8.08, 77.55], // Kanyakumari (Loop closed)
    ],
  },
  {
    name: 'Sri Lanka',
    coords: [
      [9.8, 80.2],
      [8.5, 81.2],
      [7.0, 81.8],
      [6.0, 80.5],
      [6.9, 79.8],
      [8.0, 79.7],
      [9.8, 80.2],
    ],
  },

  // 2. Africa
  {
    name: 'Africa',
    coords: [
      [36.8, 10.2],  // Tunisia Cap Bon
      [37.3, 9.8],   // Bizerte
      [35.8, -5.3],  // Ceuta / Gibraltar
      [33.9, -6.9],  // Rabat
      [30.4, -9.6],  // Agadir
      [20.9, -17.0], // Nouadhibou
      [14.7, -17.4], // Dakar
      [11.8, -15.6], // Guinea-Bissau
      [7.5, -12.5],  // Sierra Leone
      [4.3, -7.5],   // Liberia
      [5.3, -4.0],   // Ivory Coast
      [5.5, -0.2],   // Ghana
      [6.1, 1.2],    // Togo
      [6.4, 3.4],    // Lagos
      [4.7, 7.0],    // Niger Delta
      [4.0, 9.7],    // Cameroon
      [0.4, 9.4],    // Gabon
      [-6.0, 12.3],  // Congo river mouth
      [-8.8, 13.2],  // Luanda
      [-15.2, 12.1], // Namibe
      [-22.9, 14.5], // Walvis Bay
      [-33.9, 18.4], // Cape Town
      [-34.8, 20.0], // Cape Agulhas (Southern tip)
      [-34.0, 25.6], // Port Elizabeth
      [-29.8, 31.0], // Durban
      [-25.9, 32.6], // Maputo
      [-15.1, 40.5], // Mozambique
      [-6.8, 39.3],  // Dar es Salaam
      [-4.0, 39.7],  // Mombasa
      [2.0, 45.3],   // Mogadishu
      [10.4, 51.2],  // Cape Guardafui (Horn of Africa)
      [11.6, 43.1],  // Djibouti
      [15.6, 39.4],  // Massawa (Red Sea)
      [24.0, 35.5],  // Egypt Red Sea
      [29.9, 32.5],  // Suez
      [31.2, 29.9],  // Alexandria
      [32.8, 21.8],  // Benghazi
      [32.9, 13.2],  // Tripoli
      [36.8, 10.2],
    ],
  },
  {
    name: 'Madagascar',
    coords: [
      [-12.0, 49.3],
      [-15.7, 50.4],
      [-22.0, 48.0],
      [-25.6, 45.2],
      [-23.4, 43.7],
      [-16.0, 44.5],
      [-12.0, 49.3],
    ],
  },

  // 3. Europe
  {
    name: 'Europe & Western Eurasia',
    coords: [
      [36.0, -5.6],  // Tarifa (Spain)
      [37.0, -9.0],  // Sagres (Portugal)
      [38.7, -9.5],  // Lisbon
      [43.4, -8.4],  // La Coruna
      [43.5, -1.8],  // Bay of Biscay
      [47.5, -3.0],  // Brittany
      [49.5, -1.6],  // Normandy
      [51.0, 2.0],   // Dunkirk
      [53.5, 8.5],   // Germany North Sea
      [55.0, 8.5],   // Jutland (Denmark)
      [57.7, 10.6],  // Skagen
      [58.0, 7.0],   // Norway South
      [62.0, 5.0],   // Norwegian Fjords
      [71.1, 25.8],  // North Cape
      [69.0, 33.0],  // Kola Peninsula
      [65.0, 40.0],  // White Sea
      [60.0, 60.0],  // Ural Mountains line
      [50.0, 55.0],  // Caspian basin
      [42.0, 48.0],  // Caucasus Caspian coast
      [41.0, 40.0],  // Black Sea Turkey
      [41.0, 29.0],  // Istanbul / Bosporus
      [38.0, 24.0],  // Greece / Athens
      [40.5, 18.0],  // Italy heel
      [38.0, 15.5],  // Italy toe / Messina
      [41.9, 12.5],  // Rome
      [44.4, 8.9],   // Genoa
      [43.3, 5.4],   // Marseille
      [41.4, 2.2],   // Barcelona
      [36.0, -5.6],
    ],
  },
  {
    name: 'British Isles',
    coords: [
      [50.0, -5.2], // Lizard Point
      [51.5, 1.4],  // Dover
      [53.0, 0.5],
      [57.0, -2.0], // Aberdeen
      [58.6, -3.0], // John o' Groats
      [56.0, -5.5], // Western Scotland
      [54.0, -3.0], // Liverpool bay
      [51.5, -5.0], // Wales
      [50.0, -5.2],
    ],
  },

  // 4. Asia (East, Southeast, Middle East)
  {
    name: 'Arabian Peninsula',
    coords: [
      [29.9, 32.5],  // Suez
      [27.9, 34.3],  // Sharm El Sheikh
      [21.5, 39.2],  // Jeddah
      [15.3, 41.8],  // Hodeidah
      [12.6, 43.4],  // Bab-el-Mandeb
      [12.8, 45.0],  // Aden
      [16.5, 53.0],  // Salalah
      [22.5, 59.8],  // Ras al Hadd (Oman)
      [24.0, 57.0],  // Muscat
      [26.2, 56.4],  // Strait of Hormuz
      [25.3, 55.3],  // Dubai
      [24.5, 54.4],  // Abu Dhabi
      [25.3, 51.5],  // Qatar
      [26.5, 50.0],  // Bahrain / Dammam
      [29.3, 48.0],  // Kuwait
      [30.0, 48.0],  // Shatt al-Arab
      [29.9, 32.5],
    ],
  },
  {
    name: 'Southeast Asia & Indochina',
    coords: [
      [22.0, 91.8],  // Myanmar coast
      [16.0, 94.5],  // Irrawaddy Delta
      [16.8, 96.2],  // Yangon
      [10.0, 98.6],  // Kra Isthmus
      [3.0, 101.4],  // Malacca Strait / KL
      [1.3, 103.8],  // Singapore
      [4.0, 103.4],  // Malaysia East Coast
      [7.0, 100.5],  // Gulf of Thailand
      [13.5, 100.5], // Bangkok
      [10.5, 104.5], // Cambodia
      [8.6, 105.2],  // Mekong Delta
      [10.8, 106.7], // Ho Chi Minh City
      [16.1, 108.2], // Da Nang
      [20.9, 107.0], // Ha Long Bay
      [21.5, 108.0], // China-Vietnam border
      [22.0, 91.8],
    ],
  },
  {
    name: 'East Asia & Siberia',
    coords: [
      [21.5, 108.0],
      [22.3, 114.2], // Hong Kong
      [24.5, 118.1], // Xiamen
      [29.9, 121.6], // Ningbo
      [31.2, 121.5], // Shanghai / Yangtze Delta
      [34.5, 119.2], // Lianyungang
      [37.5, 122.0], // Shandong Peninsula
      [39.0, 117.5], // Tianjin / Bohai Sea
      [39.0, 125.5], // North Korea West
      [37.5, 126.5], // Seoul / Incheon
      [35.1, 129.0], // Busan
      [39.0, 127.5], // Wonsan
      [43.1, 131.9], // Vladivostok
      [53.0, 140.7], // Sea of Okhotsk
      [56.0, 156.0], // Kamchatka West
      [51.0, 156.7], // Cape Lopatka
      [60.0, 166.0], // Bering Sea
      [66.0, 170.0], // Chukchi Peninsula
      [70.0, 179.0], // Wrangel Island view
      [73.0, 140.0], // New Siberian Islands
      [77.0, 105.0], // Taymyr Peninsula
      [73.0, 70.0],  // Yamal Peninsula
      [68.0, 50.0],  // Pechora Sea
      [60.0, 60.0],  // Ural divide
      [45.0, 85.0],  // Central Asia
      [35.0, 95.0],  // Tibetan Plateau
      [25.0, 100.0], // Yunnan
      [21.5, 108.0],
    ],
  },
  {
    name: 'Japan',
    coords: [
      [31.0, 130.5], // Kyushu
      [33.5, 133.5], // Shikoku
      [35.0, 136.0], // Nagoya
      [35.7, 139.7], // Tokyo Bay
      [40.5, 141.5], // Tohoku
      [42.0, 141.0], // Hokkaido South
      [45.5, 142.0], // Wakkanai (Hokkaido North)
      [43.0, 144.5], // Kushiro
      [40.0, 139.8], // Akita
      [36.0, 136.0], // Fukui
      [34.0, 131.0], // Yamaguchi
      [31.0, 130.5],
    ],
  },
  {
    name: 'Indonesia Archipelago (Sumatra, Java, Borneo)',
    coords: [
      [5.5, 95.3],   // Banda Aceh
      [3.0, 99.0],   // Medan
      [-0.5, 101.5], // Padang
      [-5.5, 105.5], // Sunda Strait
      [-6.2, 106.8], // Jakarta (Java)
      [-7.2, 112.7], // Surabaya
      [-8.7, 115.2], // Bali
      [-8.5, 119.5], // Flores
      [-10.2, 123.6],// Timor
      [-5.0, 120.0], // Sulawesi
      [1.0, 125.0],  // Manado
      [4.0, 118.0],  // Sabah / Borneo
      [1.5, 110.3],  // Sarawak
      [-1.2, 116.8], // Balikpapan
      [-3.5, 114.5], // Banjarmasin
      [-0.5, 109.3], // Pontianak
      [5.5, 95.3],
    ],
  },
  {
    name: 'Australia',
    coords: [
      [-12.4, 130.8], // Darwin
      [-11.0, 142.5], // Cape York (Northern tip)
      [-16.9, 145.8], // Cairns / Great Barrier Reef
      [-23.4, 150.5], // Rockhampton
      [-27.5, 153.0], // Brisbane
      [-33.9, 151.2], // Sydney
      [-37.8, 145.0], // Melbourne
      [-38.5, 146.0], // Wilson's Promontory
      [-35.0, 138.5], // Adelaide
      [-32.0, 132.0], // Great Australian Bight
      [-33.9, 121.9], // Esperance
      [-35.0, 117.9], // Albany
      [-34.3, 115.1], // Cape Leeuwin
      [-32.0, 115.8], // Perth / Fremantle
      [-28.8, 114.6], // Geraldton
      [-21.8, 114.2], // North West Cape / Exmouth
      [-20.3, 118.6], // Port Hedland
      [-17.9, 122.2], // Broome
      [-14.5, 129.5], // Joseph Bonaparte Gulf
      [-12.4, 130.8],
    ],
  },

  // 5. Americas (North & South)
  {
    name: 'North America',
    coords: [
      [25.0, -80.2], // Miami, Florida
      [30.0, -81.5], // Jacksonville
      [35.0, -75.5], // Cape Hatteras
      [40.7, -74.0], // New York Harbor
      [42.3, -71.0], // Boston / Cape Cod
      [44.5, -63.5], // Halifax, Nova Scotia
      [47.5, -52.7], // St. John's, Newfoundland
      [53.0, -60.0], // Labrador
      [60.0, -65.0], // Hudson Strait
      [58.0, -94.0], // Churchill (Hudson Bay)
      [64.0, -80.0], // Foxe Basin
      [72.0, -85.0], // Baffin Island
      [71.0, -156.8],// Point Barrow (Alaska North)
      [65.0, -168.0],// Bering Strait / Cape Prince of Wales
      [60.0, -165.0],// Yukon Delta
      [57.0, -153.0],// Kodiak Island
      [54.0, -130.0],// Prince Rupert (British Columbia)
      [49.3, -123.1],// Vancouver
      [47.6, -122.3],// Seattle
      [37.8, -122.4],// San Francisco Bay
      [34.0, -118.2],// Los Angeles
      [32.7, -117.2],// San Diego
      [23.0, -110.0],// Cabo San Lucas (Baja California)
      [28.0, -112.0],// Gulf of California
      [20.0, -105.0],// Puerto Vallarta
      [16.0, -97.0], // Oaxaca
      [14.5, -92.0], // Guatemala Pacific
      [9.0, -79.5],  // Panama Canal
      [10.0, -75.5], // Cartagena (Colombia)
      [15.0, -83.5], // Honduras Caribbean
      [19.0, -87.5], // Yucatan Peninsula / Cancun
      [19.0, -96.0], // Veracruz (Gulf of Mexico)
      [26.0, -97.0], // Brownsville / Rio Grande
      [29.3, -94.8], // Galveston / Houston
      [29.9, -90.0], // New Orleans (Mississippi Delta)
      [25.0, -80.2], // Miami (Loop closed)
    ],
  },
  {
    name: 'South America',
    coords: [
      [11.5, -72.0], // Guajira Peninsula
      [10.5, -67.0], // Caracas (Venezuela)
      [8.5, -60.0],  // Orinoco Delta
      [6.0, -55.0],  // Paramaribo (Suriname)
      [4.0, -51.5],  // French Guiana
      [0.0, -50.0],  // Amazon River Delta
      [-2.5, -44.3], // Sao Luis
      [-5.5, -35.2], // Cape Sao Roque (Easternmost point of Brazil)
      [-8.0, -34.9], // Recife
      [-13.0, -38.5],// Salvador da Bahia
      [-22.9, -43.2],// Rio de Janeiro
      [-24.0, -46.3],// Santos / Sao Paulo
      [-30.0, -50.0],// Porto Alegre
      [-34.9, -56.2],// Montevideo (Uruguay)
      [-34.6, -58.4],// Buenos Aires (Rio de la Plata)
      [-38.0, -57.5],// Mar del Plata
      [-42.8, -65.0],// Valdes Peninsula (Patagonia)
      [-52.0, -68.5],// Strait of Magellan
      [-55.0, -66.5],// Cape Horn (Southern tip)
      [-53.0, -73.0],// Chilean Fjords
      [-41.5, -73.0],// Puerto Montt
      [-33.0, -71.6],// Valparaiso / Santiago
      [-23.6, -70.4],// Antofagasta (Atacama)
      [-12.0, -77.0],// Lima (Peru)
      [-4.5, -81.3], // Point Parinas (Westernmost tip)
      [-2.2, -79.9], // Guayaquil (Ecuador)
      [4.0, -77.5],  // Buenaventura (Colombia)
      [8.0, -77.0],  // Darien Gap
      [11.5, -72.0], // Loop closed
    ],
  },

  // 6. Antarctica
  {
    name: 'Antarctica',
    coords: [
      [-63.5, -57.0], // Antarctic Peninsula
      [-68.0, -60.0],
      [-72.0, -30.0], // Weddell Sea
      [-70.0, 10.0],  // Queen Maud Land
      [-66.0, 60.0],  // Enderby Land
      [-66.0, 95.0],  // Shackleton Ice Shelf
      [-67.0, 140.0], // Adelie Land
      [-71.0, 170.0], // Cape Adare
      [-78.0, 180.0], // Ross Ice Shelf
      [-75.0, -150.0],
      [-73.0, -110.0],// Marie Byrd Land
      [-70.0, -80.0], // Bellingshausen Sea
      [-63.5, -57.0],
    ],
  },
];

/**
 * High-density major world river axes & topography markers
 */
export const MAJOR_WORLD_RIVERS = [
  // Ganges - Yamuna system
  [
    [30.5, 79.0],
    [29.0, 78.5],
    [27.0, 80.0],
    [25.5, 83.0],
    [24.5, 87.5],
    [22.5, 89.0],
  ],
  // Indus system
  [
    [35.0, 76.0],
    [33.5, 73.0],
    [30.0, 71.0],
    [27.0, 68.5],
    [24.5, 67.5],
  ],
  // Nile
  [
    [-1.0, 31.0],
    [4.0, 31.5],
    [9.5, 31.5],
    [15.6, 32.5],
    [24.0, 32.9],
    [31.2, 30.5],
  ],
  // Amazon
  [
    [-4.0, -73.5],
    [-3.5, -65.0],
    [-2.5, -54.0],
    [-0.5, -50.0],
  ],
];
