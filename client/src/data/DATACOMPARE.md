#COMPARING FRONT AND BACKEND DATA

##PLANTS
###current backend:
createPlant({
id: uuidv4(),
plant_name: "Boxwood",
plant_type: "Shrub",
toxic: false,
size: 2,
}),

###current frontend:
id: uuidv4(),
plant_name: VARCHAR,
NEW technical_name: VARCHAR
plant_type: "Shrub", in growth_habit
toxic: false,
NEW diameter_min_ft: #
NEW diameter_max_ft: #
NEW height_min_ft: #
NEW height_max_ft: #
NEW sunlight: []'

###update to backend:

NEW adaptable_styles: ON BACKEND THIS IS plant_Design_Type
//

//SAME AS

plant_layout ~ "placedPlants"
plant_Design_Type ~ thru table for "adaptable_styles"
