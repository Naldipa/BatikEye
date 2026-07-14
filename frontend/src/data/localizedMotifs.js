import { motifMetadata, motifs } from "./motifs";

const normalizeKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const getLanguageCode = (language) =>
  String(language || "").startsWith("en") ? "en" : "id";

const englishMotifMetadata = {
  Parang: {
    name: "Parang",
    origin: "Yogyakarta / Solo",
    philosophy:
      "A symbol of strength, courage, and continuity in life struggles.",
    colors: ["Brown", "Black", "White"],
    history:
      "A legendary motif from the Yogyakarta Palace that was once reserved for the king and his family.",
    usage: "Royal ceremonies, traditional weddings, and high-level formal events.",
  },
  Kawung: {
    name: "Kawung",
    origin: "Solo",
    philosophy:
      "Purity, balance, justice, and the ideal of becoming useful to others.",
    colors: ["White", "Brown", "Black", "Gold"],
    history:
      "One of the oldest Javanese motifs, inspired by palm fruit and often associated with the four cardinal directions.",
    usage: "Religious ceremonies and meditative occasions.",
  },
  "Mega Mendung": {
    name: "Mega Mendung",
    origin: "Cirebon, West Java",
    philosophy:
      "Patience and self-control, represented by calming cloudy skies.",
    colors: ["Blue", "White", "Red", "Black", "Green"],
    history:
      "A Cirebon motif known for blue color gradations and Chinese cultural influence.",
    usage: "Formal clothing of the Cirebon Sultanate and traditional events.",
  },
  Jumputan: {
    name: "Jumputan",
    origin: "Pekalongan, Central Java",
    philosophy: "Luck, happiness, and beauty in simplicity.",
    colors: ["Red", "Yellow", "Green", "Blue"],
    history:
      "Inspired by the tie-dye technique that creates unique and brightly colored patterns.",
    usage: "Daily wear, cultural events, and modern fashion.",
  },
  "Bokor Kencono": {
    name: "Bokor Kencono",
    origin: "Solo",
    philosophy: "A symbol of luxury, glory, and royal power.",
    colors: ["Gold", "Brown", "Black"],
    history:
      "Traditionally worn by royal families during important state ceremonies.",
    usage: "Royal ceremonies and traditional ceremonial attire.",
  },
  SidoLuhur: {
    name: "Sido Luhur",
    origin: "Solo",
    philosophy:
      "A hope to attain noble character and an honorable position in life.",
    colors: ["Brown", "Cream", "Gold"],
    history: "A classical motif associated with noble circles.",
    usage: "Wedding ceremonies and promotion-related celebrations.",
  },
  Truntum: {
    name: "Truntum",
    origin: "Solo",
    philosophy:
      "A symbol of love that grows and develops like stars in the sky.",
    colors: ["Brown", "White", "Black", "Gold"],
    history:
      "Created by Queen Kencana as an expression of enduring love.",
    usage: "Worn by parents of the bride and groom in Javanese weddings.",
  },
  Sidomukti: {
    name: "Sidomukti",
    origin: "Solo",
    philosophy: "A symbol of a happy and prosperous life.",
    colors: ["Brown", "White", "Gold"],
    history:
      "A motif associated with good fortune and prosperity.",
    usage: "Weddings and thanksgiving ceremonies.",
  },
  Sidomulyo: {
    name: "Sidomulyo",
    origin: "Solo",
    philosophy: "A hope for a prosperous and joyful future.",
    colors: ["Yellow", "White", "Brown"],
    history:
      "A traditional motif for young couples in wedding processions.",
    usage: "Weddings and family events.",
  },
  Srikaton: {
    name: "Srikaton",
    origin: "Yogyakarta",
    philosophy: "Elegance and captivating beauty.",
    colors: ["Pink", "Purple", "Brown"],
    history:
      "A favorite motif among noble women in the royal court.",
    usage: "Women's traditional attire and palace-related events.",
  },
  SekarJagad: {
    name: "Sekar Jagad",
    origin: "Solo, Central Java",
    philosophy: "Represents the beauty and diversity of the world.",
    colors: ["Red", "White", "Blue"],
    history: "Inspired by the natural beauty of the Indonesian archipelago.",
    usage: "Cultural events and festivals.",
  },
  Tribusono: {
    name: "Tribusono",
    origin: "Solo",
    philosophy: "Harmony between humans, nature, and God.",
    colors: ["Brown", "White", "Black"],
    history: "A classical motif used by spiritual figures in the royal court.",
    usage: "Meditation and spiritual ceremonies.",
  },
  "Wahyu Tumurun": {
    name: "Wahyu Tumurun",
    origin: "Surakarta",
    philosophy:
      "A hope for blessings and divine guidance to descend from above.",
    colors: ["Black", "Gold", "Brown"],
    history:
      "A sacred motif believed to carry divine guidance and blessings.",
    usage: "Religious ceremonies and traditional rituals.",
  },
  Wirasat: {
    name: "Wirasat",
    origin: "Yogyakarta",
    philosophy:
      "Guidance and inherited wisdom for descendants in living their lives.",
    colors: ["Brown", "White", "Red"],
    history:
      "Worn by parents as a symbol of blessing for their children.",
    usage: "Family ceremonies and wedding blessings.",
  },
  "Pintu Aceh": {
    name: "Pintu Aceh",
    origin: "Banda Aceh",
    philosophy:
      "Humility, patience, caution toward strangers, and warmth once trust is formed.",
    colors: ["Red", "Yellow", "Green", "Black"],
    history:
      "Inspired by Acehnese house architecture and Acehnese cultural symbols.",
    usage: "Formal wear, regional uniforms, and cultural souvenirs.",
  },
  "Bungong Jeumpa": {
    name: "Bungong Jeumpa",
    origin: "Aceh",
    philosophy:
      "Beauty, purity, fragrance, and the identity of Acehnese women.",
    colors: ["Yellow", "Red", "Green"],
    history:
      "Inspired by the champaca flower, an important symbol in Acehnese culture.",
    usage: "Traditional attire, cultural events, and modern fashion.",
  },
  "Gorga Batak": {
    name: "Gorga Batak",
    origin: "North Sumatra / Medan-Toba",
    philosophy: "Strength, protection, and Batak cultural identity.",
    colors: ["Red", "White", "Black"],
    history:
      "Adapted from gorga ornaments found on traditional Batak houses.",
    usage: "Regional uniforms, cultural fabrics, and traditional events.",
  },
  "Pucuk Rebung Riau": {
    name: "Pucuk Rebung Riau",
    origin: "Riau / Pekanbaru",
    philosophy:
      "Determination, hope, good fortune, and unity in Malay society.",
    colors: ["Green", "Yellow", "Red", "Brown"],
    history:
      "Inspired by bamboo shoots, symbolizing life and growth.",
    usage: "Malay clothing, traditional events, and official uniforms.",
  },
  "Tanah Liek": {
    name: "Tanah Liek",
    origin: "West Sumatra / Minangkabau",
    philosophy: "Harmony, balance, and the relationship between humans and nature.",
    colors: ["Earth brown", "Black", "Cream"],
    history:
      "Represents fertile soil and the life of Minangkabau society.",
    usage: "Traditional cloth, ethnic clothing, and cultural collections.",
  },
  "Angso Duo": {
    name: "Angso Duo",
    origin: "Jambi",
    philosophy: "Strength, courage, and beauty in life.",
    colors: ["Red", "Yellow", "Blue", "Green"],
    history:
      "Inspired by a pair of swans associated with the founding of Jambi City, symbolizing beauty and strength in Jambi culture.",
    usage: "Traditional clothing, cultural ceremonies, and modern fashion.",
  },
  Besurek: {
    name: "Besurek",
    origin: "Bengkulu",
    philosophy:
      "Islamic identity, prayer, blessing, and Bengkulu's natural richness.",
    colors: ["Red", "Blue", "Purple", "Black"],
    history:
      "Inspired by Arabic calligraphy combined with flora and fauna such as Rafflesia, reflecting Bengkulu's cultural richness.",
    usage: "Traditional ceremonies, regional clothing, shawls, and fashion products.",
  },
  Lasem: {
    name: "Lasem",
    origin: "Lasem, Central Java",
    philosophy: "Javanese-Chinese acculturation, courage, and prosperity.",
    colors: ["Deep red", "Blue", "Cream", "Brown"],
    history:
      "Inspired by the blending of Chinese and Javanese cultures in Lasem, known for vivid colors and intricate details.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Mahkota Siger": {
    name: "Mahkota Siger",
    origin: "Lampung",
    philosophy:
      "Femininity, strength, elegance, and the important role of women.",
    colors: ["Red", "Gold", "Yellow", "Black"],
    history:
      "Inspired by the siger crown worn by Lampung women, a symbol of social status and beauty in Lampung culture.",
    usage: "Traditional clothing, cultural ceremonies, and modern fashion.",
  },
  Simbut: {
    name: "Simbut",
    origin: "Banten",
    philosophy: "Strength, courage, and beauty in life.",
    colors: ["Brown", "Blue", "Black", "Cream"],
    history:
      "Inspired by taro leaves and Baduy/Banten culture, symbolizing firmness, simplicity, and beauty in Banten society.",
    usage: "Traditional cloth, regional uniforms, and cultural events.",
  },
  "Ondel-ondel Betawi": {
    name: "Ondel-ondel Betawi",
    origin: "Jakarta",
    philosophy: "Protection, courage, and Betawi cultural identity.",
    colors: ["Red", "Yellow", "Green", "Blue", "Black"],
    history:
      "Inspired by ondel-ondel, giant Betawi puppets used in traditional performances to ward off evil spirits and protect the community.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Kujang Kijang": {
    name: "Kujang Kijang",
    origin: "Bogor, West Java",
    philosophy: "Strength, courage, and beauty in life.",
    colors: ["Brown", "Green", "Yellow", "Black"],
    history:
      "Inspired by kujang, a traditional Sundanese weapon symbolizing strength and courage, combined with Bogor's flora and fauna elements.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Tujuh Rupa": {
    name: "Tujuh Rupa",
    origin: "Pekalongan, Central Java",
    philosophy: "Diversity, beauty, and the richness of Indonesian culture.",
    colors: ["Red", "Yellow", "Green", "Blue"],
    history:
      "Inspired by Pekalongan's colorful traditional ornaments and forms, reflecting Indonesia's cultural diversity.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  Gentongan: {
    name: "Gentongan",
    origin: "Madura / Tanjung Bumi",
    philosophy: "Strength, courage, and beauty in life.",
    colors: ["Red", "Green", "Blue", "Black"],
    history:
      "Inspired by gentongan, a traditional Madurese water container, reflecting the strength and beauty of Madurese culture.",
    usage: "Traditional clothing, cultural events, and hand-drawn batik collections.",
  },
  "Barong Bali": {
    name: "Barong Bali",
    origin: "Bali / Denpasar",
    philosophy:
      "Protection, balance, and spirituality in Balinese culture.",
    colors: ["Red", "Gold", "White", "Black"],
    history:
      "Inspired by Barong, a Balinese mythological figure symbolizing goodness and protection.",
    usage: "Cultural ceremonies, ethnic clothing, and souvenirs.",
  },
  "Tampuk Manggis Sasirangan": {
    name: "Tampuk Manggis Sasirangan",
    origin: "South Kalimantan / Banjarmasin",
    philosophy: "Strength, courage, and beauty in life.",
    colors: ["Purple", "Red", "Yellow", "Green"],
    history:
      "Inspired by the crown-like top of the mangosteen fruit, symbolizing strength and the beauty of South Kalimantan culture.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Enggang Dayak": {
    name: "Enggang Dayak",
    origin: "Kalimantan",
    philosophy:
      "Majesty, leadership, the upper world, and respect for ancestors.",
    colors: ["Red", "Black", "White", "Yellow"],
    history:
      "Inspired by the hornbill, an important symbol in Dayak culture representing strength, courage, and Kalimantan's natural beauty.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Tengkawang Ampiek": {
    name: "Tengkawang Ampiek",
    origin: "West Kalimantan",
    philosophy:
      "Nature, life, and forest resources as sources of prosperity.",
    colors: ["Brown", "Green", "Yellow"],
    history:
      "Inspired by the tengkawang tree, a distinctive Kalimantan plant associated with life and forest abundance.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  Tongkonan: {
    name: "Tongkonan",
    origin: "Toraja, South Sulawesi",
    philosophy:
      "Life, death, and the relationship between humans and ancestors.",
    colors: ["Red", "Black", "White", "Yellow"],
    history:
      "Inspired by the Tongkonan traditional house, an important symbol in Toraja culture.",
    usage: "Traditional ceremonies, cultural clothing, and Toraja tourism products.",
  },
  "Pala Banda": {
    name: "Pala Banda",
    origin: "Banda, Maluku",
    philosophy:
      "Beauty, natural wealth, and the cultural identity of Maluku.",
    colors: ["Red", "Green", "Brown", "Cream"],
    history:
      "Inspired by nutmeg, a signature spice of Maluku that reflects natural richness and cultural beauty.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Cengkeh Ternate": {
    name: "Cengkeh Ternate",
    origin: "Ternate, North Maluku",
    philosophy: "Prosperity, spice history, and maritime glory.",
    colors: ["Red", "Black", "Yellow", "Brown"],
    history:
      "Inspired by cloves as a symbol of North Maluku's spice trade history and natural wealth.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  Sasambo: {
    name: "Sasambo",
    origin: "Lombok, West Nusa Tenggara",
    philosophy:
      "Natural beauty, unity of Sasak-Samawa-Mbojo, and NTB identity.",
    colors: ["Blue", "Green", "Brown", "Yellow"],
    history:
      "Inspired by Sasambo cultural identity, representing the beauty and diversity of West Nusa Tenggara.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Asmat Papua": {
    name: "Asmat Papua",
    origin: "Papua / Timika-Asmat",
    philosophy:
      "Spirituality, tribal strength, and the relationship between humans, nature, and ancestors.",
    colors: ["Brown", "Terracotta", "Black", "White"],
    history:
      "Inspired by Asmat woodcarving art and culture; Papuan batik has developed since 1985.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  Cenderawasih: {
    name: "Cenderawasih",
    origin: "Papua",
    philosophy:
      "Beauty, nobility, elegance, and Papua's natural richness.",
    colors: ["Green", "Red", "Gold", "Black"],
    history:
      "Inspired by the bird-of-paradise, an important symbol of beauty, elegance, and Papua's unique natural environment.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
  "Raja Ampat": {
    name: "Raja Ampat",
    origin: "Raja Ampat, Southwest Papua",
    philosophy:
      "Natural beauty, marine richness, and Raja Ampat cultural identity.",
    colors: ["Blue", "Turquoise", "White", "Yellow"],
    history:
      "Inspired by Raja Ampat's underwater beauty, symbolizing natural wealth and local cultural identity.",
    usage: "Traditional clothing, cultural events, and modern fashion.",
  },
};

const metadataKeyByNormalizedKey = Object.keys(motifMetadata).reduce(
  (lookup, name) => ({
    ...lookup,
    [normalizeKey(name)]: name,
  }),
  {},
);

const motifByNormalizedKey = motifs.reduce(
  (lookup, motif) => ({
    ...lookup,
    [normalizeKey(motif.name)]: motif,
  }),
  {},
);

const translationKeyByNormalizedKey = Object.keys(englishMotifMetadata).reduce(
  (lookup, name) => ({
    ...lookup,
    [normalizeKey(name)]: name,
  }),
  {},
);

const findMetadataKey = (name) => {
  const normalized = normalizeKey(name);
  return (
    metadataKeyByNormalizedKey[normalized] ||
    translationKeyByNormalizedKey[normalized]
  );
};

export const getLocalizedMotifByName = (name, language = "id") => {
  const lang = getLanguageCode(language);
  const normalized = normalizeKey(name);
  const metadataKey = findMetadataKey(name);
  const baseInfo = motifMetadata[metadataKey] || {};
  const baseMotif =
    motifByNormalizedKey[normalized] ||
    motifByNormalizedKey[normalizeKey(metadataKey)] ||
    {};
  const originalName = baseMotif.name || metadataKey || name;
  const translation =
    lang === "en"
      ? englishMotifMetadata[
          translationKeyByNormalizedKey[normalized] ||
            translationKeyByNormalizedKey[normalizeKey(metadataKey)]
        ] || {}
      : {};

  if (!metadataKey && !baseMotif.name && !translation.name) return null;

  return {
    originalName,
    name: translation.name || originalName,
    origin: translation.origin || baseInfo.origin || baseMotif.origin,
    philosophy: translation.philosophy || baseInfo.philosophy,
    colors: translation.colors || baseInfo.colors,
    history: translation.history || baseInfo.history,
    usage: translation.usage || baseInfo.usage,
    image: baseMotif.image,
    position: baseMotif.position,
  };
};

export const getLocalizedMotifMetadata = (language = "id") =>
  Object.entries(motifMetadata).reduce((localizedMetadata, [name]) => {
    const localizedMotif = getLocalizedMotifByName(name, language);

    return {
      ...localizedMetadata,
      [name]: localizedMotif,
    };
  }, {});

export const getLocalizedMotifs = (language = "id") =>
  motifs.map((motif) => {
    const localizedMotif = getLocalizedMotifByName(motif.name, language);

    return {
      ...motif,
      originalName: motif.name,
      name: localizedMotif?.name || motif.name,
      origin: localizedMotif?.origin || motif.origin,
    };
  });
