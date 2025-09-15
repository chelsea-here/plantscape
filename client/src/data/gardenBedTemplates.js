// Ideally, the garden bed templates would be part of the generateSeed.js function.
// I've created a utility function to process the designStyleNames and find their ids

export const gardenBedTemplates = [
  {
    id: "template-1",
    name: "Classically Arranged",
    designStyleName: "classical", // Added for display
    bedSize: { bedWidth: 12, bedDepth: 6 },
    image_url:
      "https://ecogardenconstruct.com/wp-content/uploads/2023/01/amenajare-peisagistica-bg.jpg",
    placedPlants: [
      {
        id: 1,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 6, //length/2
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 2,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 8, //length/2+1*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 3,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 4, //length/2-1*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 4,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 10, //length/2+2*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 5,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 2, //length/2-2*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      //next row loops through next tallest plant
      {
        id: 6,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 4.5, //length/2-radius (optimized for max # of widest plant to start off-center)
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 7,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 7.5, //length/2+radius
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 8,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 10.5, //length/2+radius+diameter
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 9,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 1.5, //length/2-radius-diameter
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 10,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 1,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 11,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 2,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 12,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 3,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 12,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 4,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 13,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 5,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 14,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 6,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 15,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 7,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 16,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 8,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 17,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 9,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 18,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 10,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 19,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 11,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
    ],
    isTemplate: true,
  },
  {
    id: "template-2",
    name: "Prairie Paradise",
    designStyleName: "naturalistic prairie", // Added for display
    bedSize: { bedWidth: 12, bedDepth: 6 },
    image_url:
      "https://www.epicgardening.com/wp-content/uploads/2023/09/Herb-garden-with-ornamental-grasses-and-herbs-in-autumn-1200x667.jpg",
    placedPlants: [
      {
        id: 1,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 6, //length/2
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 2,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 8, //length/2+1*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 3,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 4, //length/2-1*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 4,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 10, //length/2+2*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      {
        id: 5,
        name: "boxwood",
        diameter: 2,
        height: 5,
        x: 2, //length/2-2*diameter
        y: 1, //tallest plant goes in back, so, just diameter/2
        color: "#6FC500",
        accent_color: "",
      },
      //next row loops through next tallest plant
      {
        id: 6,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 4.5, //length/2-radius (optimized for max # of widest plant to start off-center)
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 7,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 7.5, //length/2+radius
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 8,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 10.5, //length/2+radius+diameter
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 9,
        name: "spreading plum yew",
        diameter: 3,
        height: 3,
        x: 1.5, //length/2-radius-diameter
        y: 3.5, // diameter of previous plant + diameter/2
        color: "#ABD726",
        accent_color: "",
      },
      {
        id: 10,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 1,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 11,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 2,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 12,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 3,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 12,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 4,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 13,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 5,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 14,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 6,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 15,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 7,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 16,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 8,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 17,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 9,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 18,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 10,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
      {
        id: 19,
        name: "japanese painted fern",
        diameter: 1,
        height: 1,
        x: 11,
        y: 5.5, //sum of diameter of previous plants + diameter/2
        accent_color: "#E7FF9E",
        color: "#683A45",
      },
    ],
    isTemplate: true,
  },
  {
    id: "template-3",
    name: "Native Woodland",
    designStyleName: "naturalistic woodland", // Added for display
    bedSize: { bedWidth: 12, bedDepth: 6 },
    image_url:
      "https://hips.hearstapps.com/hmg-prod/images/woodland-garden-ideas-ground-1618242057.jpg?crop=1xw:1xh;center,top&resize=980:*",
    placedPlants: [], // Added empty array
  },
  {
    id: "template-4",
    name: "Cottagecore",
    designStyleName: "cottage", // Added for display
    bedSize: { bedWidth: 12, bedDepth: 6 },
    image_url:
      "https://cdn.shopify.com/s/files/1/0593/3265/7306/files/01-pollinator-flower-bed.png?v=1727708811",
    placedPlants: [], // Added empty array
  },
  {
    id: "template-5",
    name: "Modern Minimalism",
    designStyleName: "modern minimalism", // Added for display
    bedSize: { bedWidth: 8, bedDepth: 5 },
    image_url:
      "https://www.almanac.com/sites/default/files/users/The%20Editors/rock-garden-house-shutterstock_1948570909.jpg",
    placedPlants: [], // Added empty array
  },
  {
    id: "template-6",
    name: "Modern Lush",
    designStyleName: "modern lush", // Added for display
    bedSize: { bedWidth: 15, bedDepth: 10 },
    image_url:
      "https://www.monrovia.com/media/amasty/blog/1024x577_Robin_Parsons_garden_designer_-_West_Seattle_project_2514PM_copy.jpg",
    placedPlants: [], // Added empty array
  },
];
