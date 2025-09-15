//this should be a temporary File.. future needs to be integrated into generateseed

export const DesignsStyleIds = [
  {
    designStyleName: "classical",
    designStyleId: "5ef09090-a44d-4067-bf69-474d2c639d6a",
  },
  {
    designStyleName: "modern minimalism",
    designStyleId: "a4e1b58e-f2d6-423f-a332-2965ddf0f6bc",
  },
  {
    designStyleName: "modern lush",
    designStyleId: "cb520214-6747-4ce4-81d3-305a13c780aa",
  },
  {
    designStyleName: "cottage",
    designStyleId: "84d03225-a2f4-411b-9b19-cd5e31f49bed",
  },
  {
    designStyleName: "naturalistic",
    designStyleId: "8ddbc1dc-bbd3-41b7-929f-46db20f1d53c",
  },
  {
    designStyleName: "naturalistic woodland",
    designStyleId: "853d88c2-ea4f-4fb9-b4ef-f7854d871337",
  },
  {
    designStyleName: "naturalistic prairie",
    designStyleId: "0a1b7ed3-052e-4514-977a-28da75117f42",
  },
];

// Helper function to get design ID by name
export const getDesignId = (name) => {
  const design = DesignsStyleIds.find(
    (d) => d.designStyleName === name.toLowerCase()
  );
  return design ? design.designStyleId : null; // Return null or throw error if not found
};
