//for image_tags, items with one designStyle, the pre-processor file will load all of the relevant tags for its singular designstyle
export const styleQuizContent = [
  {
    id: "cottage-02",
    designStyleNames: ["cottage"],
    image_url: "/cottage02.webp",
    image_tags: [], //for example: the pre-processor will load all of the relevant design tags for "cottage"
  },
  {
    id: "classical-cottage-02",
    designStyleNames: ["cottage", "classical"],
    image_url: "/classical-cottage-02.JPG",
    image_tags: [
      "layered",
      "romantic",
      "whimsical",
      "nostalgic",
      "colorful",
      "fragrant",
      "cottagecore",
      "natural",
      "geometrical",
      "repetition",
      "massing",
      "limited_palette",
    ],
  },
  {
    id: "classical-cottage-01",
    designStyleNames: ["cottage", "classical"],
    image_url: "/classical-cottage-01.JPG",
    image_tags: [
      "overflowing",
      "layered",
      "romantic",
      "whimsical",
      "nostalgic",
      "colorful",
      "fragrant",
      "geometrical",
      "formal_hierarchy",
      "order",
      "repetition",
      "massing",
      "limited_palette",
    ],
  },
  {
    id: "cottage-modernlush-01",
    designStyleNames: ["modern lush", "cottage"],
    image_url:
      "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790677/modernlush02_guoc3m.jpg",
    image_tags: [
      "linear",
      "asymmetrical",
      "informal_hierarchy",
      "odd_spacing",
      "full",
      "textural",
      "dense",
      "continuous_focal_point",
      "overflowing",
      "layered",
      "romantic",
      "whimsical",
      "nostalgic",
      "colorful",
      "fragrant",
      "natural",
    ],
  },

  {
    id: "modernlush02",
    designStyleNames: ["modern lush"],
    image_url: "/modernlush02.jpg",
    image_tags: [],
  },
  {
    id: "modernlush03",
    designStyleNames: ["modern lush"],
    image_url:
      "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790675/modern01_mtihwb.jpg",
    image_tags: [],
  },
  {
    id: "modernminimal01",
    designStyleNames: ["modern minimalism"],
    image_url: "/modernminimal01.jpg",
    image_tags: [],
  },
  {
    id: "modernminimal02",
    designStyleNames: ["modern minimalism"],
    image_url: "/modernminimal02.jpg",
    image_tags: [],
  },
  {
    id: "modernminimal03",
    designStyleNames: ["modern minimalism"],
    image_url: "/modernminimal03.jpg",
    image_tags: [],
  },
  {
    id: "naturalistic-prairie-01",
    designStyleNames: ["naturalistic"],
    image_url: "/naturalistic-prairie-01.jpg",
    image_tags: [],
  },
  {
    id: "naturalistic-prairie-02",
    designStyleNames: ["naturalistic"],
    image_url: "/naturalistic-prairie-02.jpg",
    image_tags: [],
  },
  {
    id: "naturalistic-woodland-01",
    designStyleNames: ["naturalistic"],
    image_url: "/naturalistic-woodland-01.jpg",
    image_tags: [],
  },
  {
    id: "boxwood",
    designStyleNames: ["classical"],
    image_url:
      "https://res.cloudinary.com/dprixcop0/image/upload/v1753128204/boxwood_gqpns0.webp",
    image_tags: ["geometrical"],
  },
  {
    id: "coneflowers",
    designStyleNames: ["cottage", "naturalistic"],
    image_url:
      "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282048/Copy_of_cone-flower_zqcl3s.jpg",
    image_tags: ["wild", "whimsical", "colorful", "clumped", "natural"],
  },
  {
    id: "roses",
    designStyleNames: ["classical", "cottage"],
    image_url:
      "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753395839/Rosa_Ingrid_Bergman_2018-07-16_6611__cropped_i376sl.jpg",
    image_tags: ["formal", "traditional", "romantic", "colorful", "fragrant"],
  },
  {
    id: "yew",
    designStyleNames: ["classical", "modern minimalism", "modern lush"],
    image_url:
      "https://res.cloudinary.com/dprixcop0/image/upload/v1753127016/spreading-japanese-plum-yew_c7753v.webp",
    image_tags: ["geometrical", "formal", "sculptural", "textural"],
  },
  {
    id: "sunflowers",
    designStyleNames: ["cottage", "naturalistic"],
    image_url:
      "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287882/Hairy_Sunflower__1020466042_hodmut.jpg",
    image_tags: [
      "wild",
      "colorful",
      "romantic",
      "whimsical",
      "nostalgic",
      "informal",
      "scattered",
      "clumped",
    ],
  },
  {
    id: "agave",
    designStyleNames: ["modern minimalism"],
    image_url: "/agave.webp",
    image_tags: ["sculptural", "white_space"],
  },
  {
    id: "bamboo_muhly",
    designStyleNames: ["modern lush"],
    image_url:
      "/Muhlenbergia_dumosa_(bamboo_muhly_grass)_at_Mounts_Botanical_Garden_in_West_Palm_Beach,_FL_USA.jpg",
    image_tags: ["abstraction", "massing", "full", "textural"],
  },
];

//TODO: helper function which inputs designStyleNames (maybe in future image_tags) and outputs designStyleRanking for each design style
//TODO: i think.. ideally the image_url, quote, and attribution would be part of the back_end DB for styles
export const styleQuizResults = [
  {
    result_blurb:
      "You love the sharp lines of the modern style when set against the softness of nature.",
    style: "modern lush",
    image_url: "/modernlush01.jpg",
    quote: `More and more, there is a move away from tamed, manicured landscapes towards something more connected to a larger ecological condition. There is an impulse for the garden to be legible as a part of nature.`,
    author: "Surfacedesign partner Roderick Wyllie, The Architect's Newspaper",
  },
  {
    result_blurb: "You prefer clean lines and sculptural abstractions.",
    style: "modern minimimalism",
    image_url:
      "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790674/modern-minimal-04_wtosek.webp",
    quote: `Looking at your garden should not make you think of your to-do list. It should actually be the opposite. [A minimalist garden] is powerful and beautiful.`,
    attribution: `Jule Farris, Architectural Digest`,
  },
  {
    result_blurb:
      "You love order, symmetry, and appreciate hierarchical expressions of nature.",
    style: "classical",
    image_url: "/classical01.jpg",
    quote: `The art of composing a garden is a question first of selection and then of emphasis.`,
    attribution: `Russell Page`,
  },
  {
    result_blurb:
      "You love to see nature arranged in it's most idealized form. Raw, wild, and magical.",
    style: "cottage",
    image_url: "/cottage01.JPG",
    quote: `It’s a style of gardening that can feel very personal, where you can always tuck in a new plant easily here or there. It’s a magical space that feels more to me like a diary filled with memories.`,
    attribution: `Rebecca Sweet, monrovia.com`,
  },
  {
    result_blurb: "You have a deep appreciation for the wisdom of nature.",
    style: "naturalistic",
    image_url: "/naturalistic01.jpg",
    quote: `It’s about setting aside our desire for control to instead work in partnership with nature.`,
    attribution: `Naturalistic-ish at Heart: Naturalistic planting design`,
  },
];

// modern minimalism:
// linear, asymmetrical, informal_hierarchy, odd_spacing, abstraction, rhythm, massing, limited_palette, white_space, restraint, sparse, sculptural

// modern lush:
// linear, asymmetrical, informal_hierarchy, odd_spacing, abstraction, rhythm, massing, limited_palette, full, textural, dense, continuous_focal_point'

// cottage:
// overflowing, layered, romantic, whimsical, nostalgic, informal, colorful, fragrant, cottagecore, natural

// naturalistic:
// meandering, random, lack_of_hierarchy, no_spacing_rules, wild, scattered, clumped, large_palette

// classical:
// geometrical, symmetrical, formal_hierarchy, even_spacing, order, repetition, massing, limited_palette, formal, traditional
