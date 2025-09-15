-- SQL SEED File generated on 2025-07-27T04:56:01.554Z


DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS plant_layout;
DROP TABLE IF EXISTS layouts;
DROP TABLE IF EXISTS favorite_plants;
DROP TABLE IF EXISTS plant_Design_Types;
DROP TABLE IF EXISTS fave_design;
DROP TABLE IF EXISTS plants;
DROP TABLE IF EXISTS designs;
DROP TABLE IF EXISTS users;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE designs(
    id UUID PRIMARY KEY,
    design_style_name VARCHAR(50) UNIQUE NOT NULL,
    design_attributes VARCHAR(255),    -- short description
    design_description TEXT,           -- long description
    design_tags TEXT                   -- tags
);

CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY,
    plant_name VARCHAR(255) UNIQUE NOT NULL,
    other_common_names TEXT,
    technical_name VARCHAR(255),
    growth_form VARCHAR(50),
    is_toxic BOOLEAN DEFAULT false NOT NULL,
    sun_requirements TEXT,
    height_min_ft NUMERIC(5, 2),
    height_max_ft NUMERIC(5, 2),
    width_min_ft NUMERIC(5, 2),
    width_max_ft NUMERIC(5, 2),
    seasonal_interest TEXT,
    primary_color VARCHAR(50),
    accent_color VARCHAR(50),
    image_url TEXT
);

CREATE TABLE favorite_plants(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    plant_id UUID REFERENCES plants(id),
    CONSTRAINT user_and_plant_id UNIQUE(user_id, plant_id)
);

CREATE TABLE plant_Design_Types(
    id UUID PRIMARY KEY,
    plant_id UUID REFERENCES plants(id),
    design_id UUID REFERENCES designs(id),
    UNIQUE (plant_id, design_id)
);


CREATE TABLE projects(
    id UUID PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id)
);

CREATE TABLE layouts(
    id UUID PRIMARY KEY,
    layout_name varchar(100) NOT NULL,
    bed_length INTEGER NOT NULL,
    bed_depth INTEGER NOT NULL,
    design_type UUID REFERENCES designs(id),
    projects_id UUID REFERENCES projects(id)
);

CREATE TABLE plant_layout(
    id UUID PRIMARY KEY,
    plant_id UUID REFERENCES plants(id),
    layout_id UUID REFERENCES layouts(id),
    x_coord NUMERIC(10, 2) NOT NULL,
    y_coord NUMERIC(10, 2) NOT NULL,
    diameter NUMERIC(5, 2) NOT NULL,
    height NUMERIC(5, 2) NOT NULL
);

CREATE TABLE fave_design(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    design_id UUID REFERENCES designs(id)
);


-- Users Inserts
INSERT INTO users (id, username, password, is_admin) VALUES ('78a014bd-35fb-49f4-877f-8c8a1dc510ff', 'Justin', '$2b$07$i38oShQ2oR0XQ.7JzrQFj.aVIXJeAma.aREWSnosP28lvZ1q/cvAa', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, is_admin) VALUES ('8fb79eca-5262-4d99-9e29-9afc283cb5f8', 'Chelsea', '$2b$07$6x1o2yo9NjXN3eh/51LxWeDou4p.vSLYeGaT0Y0TdoPbF7AA0TjXu', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, is_admin) VALUES ('85b7edfd-d0be-4156-933a-40004a3c38c5', 'Callen', '$2b$07$Q7la.MWknYpVOjchFiv87ek3kwEStrZDIlW1CsCCLfWpeVYRm57ZC', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, is_admin) VALUES ('08f778c7-b10a-4d1b-bee1-4f8635233da3', 'Ellie', '$2b$07$6yIjU7pSdt24F9fq2vtkUup2JLZwG/VXLwUI8Po7vkfRTV.Dj1AT.', TRUE) ON CONFLICT (id) DO NOTHING;

-- Designs Inserts
INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (
  'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc',
  'modern minimalism',
  'A sleek, refined space defined by sculptural plants, white space, and minimal materials. Focused on balance, simplicity, and restraint.',
  'A Modern Minimalist garden distills modern design to its purest form. It emphasizes sculptural simplicity, white space, and deliberate restraint in both planting and materials. With sparse, architectural elements and a limited palette, the space feels quiet and refined. Negative space is used as intentionally as the plantings, celebrating geometry, balance, and thoughtful reduction.',
  'linear, asymmetrical, informal_hierarchy, odd_spacing, abstraction, rhythm, massing, limited_palette, white_space, restraint, sparse, sculptural'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (
  'cb520214-6747-4ce4-81d3-305a13c780aa',
  'modern lush',
  'Blends modern structure with rich, dense planting. A limited palette and strong forms create rhythm and depth, achieving a lush, immersive feel without visual clutter.',
  'A Modern Lush garden blends the clean lines and structured aesthetic of modern design with rich, textural planting. While maintaining asymmetry and abstraction, this style embraces fullness—layering dense foliage and masses of plants to create a continuous visual rhythm. It incorporates restraint through a curated color palette and thoughtful repetition, achieving a lush, immersive effect without visual clutter. The result is a sophisticated, tactile space where structure meets abundance.',
  'linear, asymmetrical, informal_hierarchy, odd_spacing, abstraction, rhythm, massing, limited_palette, full, textural, dense, continuous_focal_point'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (
  '5ef09090-a44d-4067-bf69-474d2c639d6a',
  'classical',
  'Emphasizes symmetry, order, and geometry with manicured lawns, sculpted shrubs, and a restrained palette. Formal structure and repetition create timeless elegance.',
  'A Classical garden emphasizes structure, balance, and timeless elegance. Rooted in symmetry and formal hierarchy, this style features linear layouts, geometric planting patterns, and meticulously defined borders—often through evergreen hedges or hardscaping that remain present year-round. Gardens are typically curated around a formal path system that leads the eye toward focal points such as fountains, sculptures, or neatly clipped topiary. Plantings follow a limited color palette, typically favoring greens and whites, with repetition and order reinforcing a sense of calm and control. Manicured lawns, sculpted shrubs, and ornamental elements lend a sense of refinement and grandeur.',
  'geometrical, symmetrical, formal_hierarchy, even_spacing, order, repetition, massing, limited_palette, formal, traditional'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (
  '84d03225-a2f4-411b-9b19-cd5e31f49bed',
  'cottage',
  'A colorful, romantic garden filled with densely layered flowers and herbs. Informal and abundant, it blends ornament and utility with personal charm.',
  'While it shares the wild charm and informality of a naturalistic garden, the Cottage garden adds a distinctly romantic and curated flair. Overflowing with color, scent, and personality, this style mixes edible and ornamental plants in a dense, layered fashion that feels spontaneous but often reflects human intention. Cottage gardens typically favor traditional favorites—roses, herbs, and self-seeding perennials—arranged in a way that suggests abundance and lived-in comfort. Unlike naturalistic gardens, which aim to mimic native ecosystems, cottage gardens lean into nostalgic beauty and personal expression, with a looser relationship to ecological function.',
  'overflowing, layered, romantic, whimsical, nostalgic, informal, colorful, fragrant, cottagecore, natural'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (
  '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c',
  'naturalistic',
  'A relaxed, organic garden inspired by native landscapes. Flowing plant groupings and natural materials create a vibrant, ever-changing space full of life and movement.',
  'A Naturalistic garden embraces the untamed beauty of nature, blurring the boundary between cultivated space and wild landscape. Inspired by native ecosystems—from sun-drenched prairies to shaded woodlands—this style prioritizes biodiversity, habitat creation, and ecological harmony. Plants are arranged in loose, organic patterns that mimic natural plant communities, with clumped or scattered groupings and no formal hierarchy. Materials like stone, wood, and gravel blend seamlessly into the environment, while color, texture, and form follow the rhythms of the surrounding landscape. Whether open and airy or densely layered, naturalistic gardens evolve with the seasons and invite both people and wildlife into a living, dynamic space.',
  'meandering, random, lack_of_hierarchy, no_spacing_rules, wild, scattered, clumped, large_palette'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (
  '853d88c2-ea4f-4fb9-b4ef-f7854d871337',
  'naturalistic woodland',
  'Shade-loving native plants arranged in soft layers under trees. Inspired by forest floors, it feels quiet, textured, and seasonal.',
  'Shaded and serene, the Woodland naturalistic garden draws inspiration from forest understories and dappled glades. Plantings emphasize shade-loving natives such as ferns, groundcovers, woodland grasses, and spring ephemerals, arranged in loose layers that follow the natural contours of the land. Trees and understory shrubs provide vertical structure, while mosses, leaf litter, and natural stone pathways create a grounded, organic feel. Designed to feel untouched and timeless, this garden thrives in full to partial shade and encourages seasonal shifts, from early spring blooms to the golden tones of fall.',
  'meandering, random, lack_of_hierarchy, no_spacing_rules, wild, scattered, clumped, large_palette, full-shade'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (
  '0a1b7ed3-052e-4514-977a-28da75117f42',
  'naturalistic prairie',
  'Sun-loving grasses and wildflowers arranged in natural drifts. A dynamic, low-intervention garden full of movement, color, and habitat value.',
  'Expansive, sun-filled, and dynamic, the Prairie naturalistic garden mimics the beauty and resilience of native grasslands. Tall and short grasses—such as little bluestem or switchgrass—sway among vibrant wildflowers in irregular, intermingled groupings. Designed for full sun and open exposure, this style values movement, pollinator support, and long-season interest. Drifts of color, clumps of texture, and soft transitions between plants create a living tapestry that changes daily. Hardscaping is minimal, allowing the planting palette and the play of wind and light to take center stage.',
  'meandering, random, lack_of_hierarchy, no_spacing_rules, wild, scattered, clumped, large_palette, full-sun'
) ON CONFLICT (id) DO NOTHING;

-- Plants Inserts
INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '9a38f7c7-789c-4e72-8a68-a386c23897ff',
  'prairie acacia',
  NULL,
  'acacia angustissima',
  'shrub',
  TRUE,
  'full-sun, part-shade',
  1,
  4,
  1.5,
  2,
  'spring, fall',
  NULL,
  'reddish_brown',
  NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'e94812bc-f3b3-4631-b878-d3f1c5acddd6',
  'splitbeard bluestem',
  NULL,
  'andropogon ternarius',
  'shrub',
  FALSE,
  'full-sun, part-shade',
  2,
  4,
  0.5,
  1,
  'summer, fall, winter',
  NULL,
  'brown',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282045/cedar-sedge_hwoyoo.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'b5551d3b-2e60-4107-a5c7-cf6a680dc11e',
  'false boneset',
  'brickellbush',
  'brickellia eupatorioides',
  'herbaceous',
  FALSE,
  'full-sun, part-shade',
  3,
  4,
  1,
  2,
  'summer, fall',
  NULL,
  'white',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287878/brickelliacalifornica_hxewed.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '056956fd-625b-4ac9-8e2c-2420a82f9fb0',
  'cedar sedge',
  NULL,
  'carex planostachys',
  'grass & sedge',
  FALSE,
  'full-sun',
  0.5,
  4,
  1,
  1,
  'spring, summer',
  NULL,
  'green',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287880/carex_angustisquama_yamatanukirn04_ofai6o.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '4b0e2de5-1254-4211-943d-438e56df7be4',
  'hairy sunflower',
  'rough sunflower',
  'helianthus hirsutus',
  'herbaceous',
  FALSE,
  'full-sun, part-shade, shade',
  3,
  6,
  2,
  3,
  'summer, fall',
  NULL,
  'yellow',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287882/hairy_sunflower__1020466042_hodmut.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '412222b9-7fce-45ea-a607-1ae8e8158d1e',
  'elephant ear',
  NULL,
  'colocasia esculenta',
  'herbaceous',
  TRUE,
  'full-sun, part-shade, full-shade',
  3,
  6,
  2,
  6,
  'summer, fall, winter',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282053/elephant-ear_nwvvue.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'aa62ce68-0911-4dc4-8de1-3eae050d7ba2',
  'foxtail fern',
  'asparagus fern',
  'asparagus aethiopicus',
  'herbaceous',
  TRUE,
  'part-shade',
  2,
  3,
  2,
  3,
  'summer, fall, winter',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287877/asparagus_densiflorus__myersii_oin8n7.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '845f87f4-8901-4863-a3a2-721341b434d9',
  'pink muhly grass',
  NULL,
  'muhlenbergia capillaris',
  'grass',
  FALSE,
  'full-sun, part-shade',
  2,
  3,
  2,
  3,
  'fall, winter',
  'grass_green',
  'deep_pink',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282058/pink-muhly-grass_z3sumw.webp'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '59e27d0a-6282-4dae-9954-bd1575606c5d',
  'boxwood',
  NULL,
  'buxus spp.',
  'shrub',
  FALSE,
  'full-sun, part-shade',
  2,
  15,
  2,
  4,
  NULL,
  'grass_green',
  NULL,
  'https://res.cloudinary.com/dprixcop0/image/upload/v1753128204/boxwood_gqpns0.webp'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '8c1d591b-5037-42d0-b625-81c69c3a6c9f',
  'hybrid tea roses',
  NULL,
  'rosa spp.',
  'shrub',
  FALSE,
  'full-sun',
  3,
  6,
  2,
  4,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '82ae6680-901c-46d4-9bad-584cb0cb36ac',
  'lavender',
  NULL,
  'lavendula spp.',
  'shrub',
  FALSE,
  'full-sun',
  1,
  3,
  4,
  5,
  NULL,
  NULL,
  'purple',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282056/lavender_dc4pon.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '3ae1cab3-d3cb-4963-8706-d6028068be94',
  'hydrangeas',
  'big daddy',
  'hydrangea macrophylla',
  'shrub',
  TRUE,
  'full-sun, part-shade, full-shade',
  5,
  6,
  5,
  6,
  'spring, summer',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287885/hydrangea_macrophylla_-_bigleaf_hydrangea2_fjkn5c.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '9cdef5a7-ee31-49b1-93cf-77731fac839a',
  'lambs ear',
  NULL,
  'stachys byzantina',
  'herbaceous',
  FALSE,
  'full-sun, part-shade',
  6,
  12,
  1,
  3,
  'spring, summer, fall',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282056/lambs-ear_daq1ds.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '42ad1c53-aa10-494f-9184-c0dde7a81f70',
  'cat''s pajamas catmint',
  NULL,
  'epeta',
  'herbaceous',
  FALSE,
  'full-sun, part-shade',
  0.75,
  2,
  1,
  2,
  'spring, summer, fall',
  NULL,
  'sage_green',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287881/chasmanthium_latifolium_boyle_park_g8rpma.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'c07cfda2-9193-4eb0-afc1-5bd4303892ab',
  'coneflowers',
  NULL,
  'centaurea cyanus',
  'herbaceous',
  FALSE,
  'full-sun',
  2,
  3,
  2,
  3,
  'spring, summer',
  NULL,
  'pink',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282048/copy_of_cone-flower_zqcl3s.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'afe6e697-9296-4aa2-96b7-54998efc1e85',
  'hakone grass',
  'aurelia',
  'hakonechloa macra',
  'grass',
  FALSE,
  'full-sun, part-shade, full-shade',
  1,
  2,
  1,
  2,
  'spring, summer, fall',
  NULL,
  'yellow',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282055/hakone-grass_inabds.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'bab67fe6-4afa-4dfa-a896-effe1421128f',
  'siberian bugloss',
  'jack frost',
  'brunnera macrophylla',
  'herbaceous',
  FALSE,
  'part-shade, full-shade',
  1,
  2,
  1,
  2,
  'spring, summer',
  NULL,
  'blue',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287881/brunnera-macrophhylla-1_xq83za.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '69a88eb6-1112-40c9-bcf3-a6481d2f1f9f',
  'hellebore',
  NULL,
  'helleborus x nigercors',
  'herbaceous',
  TRUE,
  'part-shade',
  1,
  2,
  1,
  2,
  'spring, winter',
  NULL,
  'white',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287885/helleborus_orientalis._lenteroos_04_c7xr2e.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'c2d8fa32-ac33-4afa-8b32-503e6106ea18',
  'chinese silver grass',
  NULL,
  'miscanthus sinensis',
  'grass',
  FALSE,
  'full-sun, part-shade',
  3,
  8,
  3,
  5,
  'summer, fall, winter',
  'grass_green',
  'tan',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287886/japanese_pampas_grass_%e3%82%b9%e3%82%b9%e3%82%ad%e3%81%ae%e7%a9%82%e6%b3%a2pb080105_umyjuu.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '0133cd46-4964-4fa8-b084-e301092d80d8',
  'century plant',
  NULL,
  'agave americana',
  'succulent',
  TRUE,
  'full-sun',
  3,
  6,
  6,
  10,
  'spring, summer',
  'sage_green',
  'goldenrod',
  NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '0f211d36-6832-4ebd-846a-7cca014457f2',
  'inland sea oats',
  NULL,
  'chasmanthium latifolium',
  'grass',
  FALSE,
  'part-shade, full-shade',
  2,
  4,
  1,
  6,
  'fall',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287881/chasmanthium_latifolium_boyle_park_g8rpma.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'cc074d02-11bd-4650-8f65-4856cc000885',
  'lavender cotton',
  NULL,
  'santolina chamaecyparissus',
  'shrub',
  TRUE,
  'full-sun, part-shade',
  1,
  2,
  2,
  3,
  'spring, summer, fall',
  NULL,
  'silver_gray',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287878/astilbe_rubra_kz2_ijxkt0.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'c4a35109-de4c-4b77-8e51-08787288f7c8',
  'japanese painted fern',
  NULL,
  'athyrium niponicum var. pictum',
  'herbaceous',
  TRUE,
  'part-shade, full-shade',
  1,
  1.5,
  1,
  1.5,
  'spring, summer',
  'purple_brown',
  'pale_green',
  'https://res.cloudinary.com/dprixcop0/image/upload/v1753127972/japanese-painted-fern_tioauz.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '1624d30d-3ab3-4bf9-a022-a31f84af99be',
  'hosta ''formal attire''',
  NULL,
  'plantain lilies',
  'shrub',
  TRUE,
  'part-shade, full-shade',
  1.5,
  2.5,
  2,
  2.5,
  'spring, summer',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287885/hosta_plantaginea_cv_royal_standard_1_wjby1o.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '393fdb96-bbd5-4fa3-9ea5-3759fe282372',
  'astilbe',
  NULL,
  'astilbe',
  'herbaceous',
  FALSE,
  'full-sun, part-shade, full-shade',
  1.5,
  6,
  1.5,
  6,
  'spring, summer',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287878/astilbe_rubra_kz2_ijxkt0.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'cba18a87-d267-4814-820b-894a635968ba',
  'heuchera ''bella notte''',
  'coral bells, bella notte',
  'bella notte',
  'shrub',
  FALSE,
  'part-shade, full-shade',
  0.75,
  1,
  1,
  1.25,
  'summer, fall',
  NULL,
  NULL,
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287889/san_gabriel_mountains_coralbells_wmtf7w.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '23fbedc1-a9ea-4452-9e65-d79b95d89e5f',
  'foamflower',
  NULL,
  'tiarella cordifolia',
  'herbaceous',
  FALSE,
  'part-shade, full-shade',
  0.5,
  1,
  1,
  2,
  'summer',
  'lime_green',
  'white',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282055/foamflower_hw5oc7.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37',
  'spreading plum yew',
  'spreading japanese plum yew',
  'cephalotaxus harringtonia ''prostrata''',
  'shrub',
  FALSE,
  'full-sun, part-shade',
  2,
  3,
  3,
  4,
  'summer, fall',
  'lime_green',
  NULL,
  'https://res.cloudinary.com/dprixcop0/image/upload/v1753127016/spreading-japanese-plum-yew_c7753v.webp'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '59abfa2e-cce9-430b-b74f-9c55944a0123',
  'anacacho orchid tree',
  NULL,
  'bauhinia lunarioides',
  'shrub',
  FALSE,
  'full-sun, part-shade',
  6,
  12,
  3,
  6,
  'spring',
  'sage_green',
  'white',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282044/anacacho-orchid-tree_fw1xpf.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '2bd7a759-c672-4757-8163-564e37522e0b',
  'teresa''s texas sage',
  NULL,
  'salvia greggii ''teresa''',
  'shrub',
  FALSE,
  'full-sun, part-shade',
  2.5,
  3,
  2.5,
  3,
  'spring, summer',
  'grass_green',
  'baby_lavender',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282058/teresas-texas-sage_evcdgc.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'cfa8f575-3fba-4dea-bd4f-e876b2868bee',
  'blackfoot daisy',
  NULL,
  'melampodium leucanthum',
  'herbaceous',
  FALSE,
  'full-sun, part-shade',
  0.5,
  1,
  1,
  2,
  'spring, summer, fall',
  'grass_green',
  'white',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282046/copy_of_anacacho-orchid-tree_vovrrs.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  'c96a76ab-041b-4447-99c5-01e24c3a7432',
  'flame acanthus',
  NULL,
  'anisacanthus quadrifidus',
  'shrub',
  FALSE,
  'full-sun, part-shade, full-shade',
  3,
  5,
  2,
  4,
  'summer, fall',
  'lime_green',
  'red_orange',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282054/flame-acanthus_e0ci4n.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '9680ba83-bc72-4af7-86ca-b29152d51bf2',
  'mealy blue sage',
  NULL,
  'salvia farinacea',
  'shrub',
  FALSE,
  'full-sun',
  2,
  3,
  3,
  3,
  'spring, summer, fall',
  'sage_green',
  'lavender',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282056/mealy-blue-sage_ixgfxa.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '3864bfd1-9781-4dee-83c2-58e5ded466b8',
  'texas sotol',
  NULL,
  'dasylirion texanum',
  'shrub',
  FALSE,
  'full-sun',
  1.5,
  2.5,
  1.5,
  2.5,
  'summer',
  'grass_green',
  'yellow',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282059/texas-sotol_qaxtys.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '24d9a7c0-5695-490a-b0f0-8522482ea5f5',
  'white autumn sage',
  NULL,
  'salvia greggii ‘white’',
  'shrub',
  FALSE,
  'full-sun, part-shade',
  2,
  3,
  2,
  3,
  'spring, summer',
  'grass_green',
  'baby_lavender',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282059/white-autumn-sage_ekfmqt.jpg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (
  '12c8a019-45bf-4e68-88c0-60ed7ae77c03',
  'mexican feathergrass',
  NULL,
  'nassella tenuissima',
  'grass',
  FALSE,
  'full-sun, part-shade',
  1,
  3,
  1,
  3,
  'summer',
  'pale_green',
  'white',
  'https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282056/mexican-feathergrass_tdsafo.jpg'
) ON CONFLICT (id) DO NOTHING;

-- plant_Design_Types Inserts
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('270ffb56-42e9-4d2e-976b-fbe689a9ce90', '9a38f7c7-789c-4e72-8a68-a386c23897ff', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('46259d13-c518-4d0f-9583-260d269db359', '9a38f7c7-789c-4e72-8a68-a386c23897ff', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('a9d286fd-70a2-442a-a13d-8cf9bea3f33b', '9a38f7c7-789c-4e72-8a68-a386c23897ff', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('36ec2a2f-b046-4a75-b2be-0be381ca1712', '9a38f7c7-789c-4e72-8a68-a386c23897ff', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('d999db29-f7e4-442c-9354-054e5af6228b', 'e94812bc-f3b3-4631-b878-d3f1c5acddd6', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('5992f944-2418-47ed-a545-13db015660ef', 'e94812bc-f3b3-4631-b878-d3f1c5acddd6', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('dd23819f-730b-4f48-9ad1-ee1964affb5c', 'e94812bc-f3b3-4631-b878-d3f1c5acddd6', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('36886399-2cc1-4ba5-b0a2-3eb92b2832f3', 'e94812bc-f3b3-4631-b878-d3f1c5acddd6', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('f27fcf6f-8586-453d-85ef-a734b3af4533', 'e94812bc-f3b3-4631-b878-d3f1c5acddd6', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('4a13fa19-ba0f-4982-9d9f-b5ffa8263c96', 'b5551d3b-2e60-4107-a5c7-cf6a680dc11e', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('39ad4d7c-dccb-4a6d-ba14-5fdee6e8f0a0', 'b5551d3b-2e60-4107-a5c7-cf6a680dc11e', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('2d56ea9f-cab0-42df-9620-92305210c122', '056956fd-625b-4ac9-8e2c-2420a82f9fb0', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('7b76c1e2-a26c-49c5-accd-795a28e182ef', '056956fd-625b-4ac9-8e2c-2420a82f9fb0', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('b5acf41c-de05-44f9-8806-822c6f37280f', '056956fd-625b-4ac9-8e2c-2420a82f9fb0', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('a989b390-9523-42bb-a4a3-1a524218316a', '056956fd-625b-4ac9-8e2c-2420a82f9fb0', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('db80b2b1-ea51-49fc-bca4-dd8a676ddb03', '4b0e2de5-1254-4211-943d-438e56df7be4', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9cbafa72-67d4-4736-b9b6-27a05361b193', '4b0e2de5-1254-4211-943d-438e56df7be4', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('f1a326c0-f887-4610-9f5d-3f65dab7d108', '412222b9-7fce-45ea-a607-1ae8e8158d1e', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('14092609-0c90-4d65-841c-0e201a1c91bd', '412222b9-7fce-45ea-a607-1ae8e8158d1e', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('bee42be4-6258-40a4-af86-dd078f4618d6', '412222b9-7fce-45ea-a607-1ae8e8158d1e', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('003d3cea-be40-4ca3-a785-d3705bbfe188', '412222b9-7fce-45ea-a607-1ae8e8158d1e', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('c2146203-b5b0-4faa-abc5-fe80c5c26fb0', 'aa62ce68-0911-4dc4-8de1-3eae050d7ba2', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('a260f94f-c205-4438-9466-b1f3bbe91bb2', 'aa62ce68-0911-4dc4-8de1-3eae050d7ba2', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9ddc7a17-178e-4ef1-b5f4-9c712ccc97a2', 'aa62ce68-0911-4dc4-8de1-3eae050d7ba2', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('7e81ac92-e184-4aba-9e7d-f53d64d45369', 'aa62ce68-0911-4dc4-8de1-3eae050d7ba2', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('bf03f7a2-eb35-4e1c-b48a-7b954581002b', '845f87f4-8901-4863-a3a2-721341b434d9', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('14e10a62-a086-41bf-9be0-0019b148ab16', '845f87f4-8901-4863-a3a2-721341b434d9', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('89bc32f2-fcf9-40f4-b45a-36fe0de45fb6', '845f87f4-8901-4863-a3a2-721341b434d9', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('92cc690d-8d77-4874-9c45-db7111d9dcad', '845f87f4-8901-4863-a3a2-721341b434d9', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('c1448e31-97f0-439c-8cdd-9f4cafaa496c', '845f87f4-8901-4863-a3a2-721341b434d9', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('287ad78f-1920-4eeb-8773-54a81cb27c74', '59e27d0a-6282-4dae-9954-bd1575606c5d', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('fb547de0-ae88-4106-aaca-fce958dc4614', '59e27d0a-6282-4dae-9954-bd1575606c5d', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('d924735a-7f76-4699-9d9b-6e6bb3ada1c8', '59e27d0a-6282-4dae-9954-bd1575606c5d', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('d2343f17-a877-49e4-8710-8fa1fda972d2', '8c1d591b-5037-42d0-b625-81c69c3a6c9f', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('184940bf-8761-47d2-b0c7-ead297738988', '82ae6680-901c-46d4-9bad-584cb0cb36ac', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('fc7f591d-7289-4d3d-ba64-59813ee64344', '82ae6680-901c-46d4-9bad-584cb0cb36ac', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('0fff9a80-8196-4041-a451-037ddf4b166d', '82ae6680-901c-46d4-9bad-584cb0cb36ac', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('c00c9b1a-cfed-4102-90cc-4dee5cba9cda', '82ae6680-901c-46d4-9bad-584cb0cb36ac', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('fb5a0ea2-fac9-427c-8983-7c87f6f19af7', '82ae6680-901c-46d4-9bad-584cb0cb36ac', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('41457595-f066-445d-a72d-ee3da8d319e3', '3ae1cab3-d3cb-4963-8706-d6028068be94', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('48dca8ee-fd7e-435d-a82f-e704bb663795', '3ae1cab3-d3cb-4963-8706-d6028068be94', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('25033063-dec9-4c6b-89c2-3a24bd22a9ad', '3ae1cab3-d3cb-4963-8706-d6028068be94', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('7bdc233e-1c1d-4b43-8c7d-9545983dd31e', '9cdef5a7-ee31-49b1-93cf-77731fac839a', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('02bacf33-e771-4255-9686-b8f0644fb0b3', '9cdef5a7-ee31-49b1-93cf-77731fac839a', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('629771cb-ccbd-40a6-935d-59d4d532a60a', '9cdef5a7-ee31-49b1-93cf-77731fac839a', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('97a061a8-8c25-49c5-9854-534fdaa290d6', '9cdef5a7-ee31-49b1-93cf-77731fac839a', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('6aaf1fef-9293-4c24-bc3f-aacd60c9cf13', '9cdef5a7-ee31-49b1-93cf-77731fac839a', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('8d531f57-e216-4bfb-8b2a-c0a2ea6e0c57', '42ad1c53-aa10-494f-9184-c0dde7a81f70', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('bcbe0d2e-9811-4cd8-a956-af8d356e04c1', '42ad1c53-aa10-494f-9184-c0dde7a81f70', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('96de5065-c7c4-4758-9e3f-983b6a3d0264', '42ad1c53-aa10-494f-9184-c0dde7a81f70', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('1c56cde8-8f09-4a91-a449-cef9c18d4c82', '42ad1c53-aa10-494f-9184-c0dde7a81f70', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('3a8706da-c477-46da-81e7-86c8e3dc5e9b', '42ad1c53-aa10-494f-9184-c0dde7a81f70', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('63a2bb28-9791-4a1d-84a8-88a5a4b80a7a', 'c07cfda2-9193-4eb0-afc1-5bd4303892ab', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('a31be00c-07d1-4043-8ddd-9783cec91657', 'c07cfda2-9193-4eb0-afc1-5bd4303892ab', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('ea3be98e-49b1-43f2-9805-e6f88ca581c0', 'c07cfda2-9193-4eb0-afc1-5bd4303892ab', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('0d63a1b0-884d-4c18-a9e1-823fcb6f846d', 'c07cfda2-9193-4eb0-afc1-5bd4303892ab', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('cb8499b1-5434-48b6-a08e-57b2889fdb5a', 'afe6e697-9296-4aa2-96b7-54998efc1e85', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('72d48d48-8b8d-4dd4-8002-6564dfa3644b', 'afe6e697-9296-4aa2-96b7-54998efc1e85', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('f28839a4-1adc-49b8-8ef2-008792c559d2', 'afe6e697-9296-4aa2-96b7-54998efc1e85', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('b4cc3329-7468-44e8-b6f7-c7439ef52f45', 'afe6e697-9296-4aa2-96b7-54998efc1e85', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('26114df9-54f8-4170-99ad-cc7dcec5dadf', 'afe6e697-9296-4aa2-96b7-54998efc1e85', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('26153cae-1b50-408a-8f42-57691bd841a7', 'bab67fe6-4afa-4dfa-a896-effe1421128f', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('e15b8977-76bf-431e-bfc2-8a96295bec01', 'bab67fe6-4afa-4dfa-a896-effe1421128f', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('cb7c0670-3c4f-49cb-8561-789cc66aaaed', 'bab67fe6-4afa-4dfa-a896-effe1421128f', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('f912e85a-f3d2-40fd-8886-e19c16bd3fb4', '69a88eb6-1112-40c9-bcf3-a6481d2f1f9f', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('6b456f33-176c-40ca-9428-f0291640fc57', '69a88eb6-1112-40c9-bcf3-a6481d2f1f9f', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('3c887c00-b3f0-4f2f-a5b8-c27cca55a7c1', '69a88eb6-1112-40c9-bcf3-a6481d2f1f9f', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('00767dda-43c6-4932-b9ba-c7dae7ba9f2a', 'c2d8fa32-ac33-4afa-8b32-503e6106ea18', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('30b4c947-2f1b-4262-8e83-ee8e0fb74b45', 'c2d8fa32-ac33-4afa-8b32-503e6106ea18', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('21254f8e-0db2-4c89-bbc2-18e6a5cd018f', 'c2d8fa32-ac33-4afa-8b32-503e6106ea18', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('10339209-3d03-45a1-9142-edddeef2d9b9', 'c2d8fa32-ac33-4afa-8b32-503e6106ea18', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('957bbe65-4328-499a-998b-2f6f0d9c92c7', 'c2d8fa32-ac33-4afa-8b32-503e6106ea18', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('1cbe0eb6-8243-430e-999e-ee2ef686767e', '0133cd46-4964-4fa8-b084-e301092d80d8', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('4af65cdf-74d1-4bae-8229-91cd8342a9c7', '0133cd46-4964-4fa8-b084-e301092d80d8', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('05919fcf-7a17-478c-896c-2d0f8fff38cc', '0133cd46-4964-4fa8-b084-e301092d80d8', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('c2ca13ac-b1b4-4546-bcce-6fbd40cdbdec', '0f211d36-6832-4ebd-846a-7cca014457f2', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('7e90449a-67fc-488d-b6de-75204a5f3d57', '0f211d36-6832-4ebd-846a-7cca014457f2', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('981b8fc2-2243-4090-9ebc-76832828dcf8', '0f211d36-6832-4ebd-846a-7cca014457f2', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('235bb165-1429-4729-a0b5-8df46a20de02', '0f211d36-6832-4ebd-846a-7cca014457f2', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('ac03ed31-a722-406a-810d-03e3970a56f8', '0f211d36-6832-4ebd-846a-7cca014457f2', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('23f0ca44-3d3f-418e-9631-657b1b2e56cc', 'cc074d02-11bd-4650-8f65-4856cc000885', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('c3d9ec71-271f-4669-9871-2142e2d633c6', 'cc074d02-11bd-4650-8f65-4856cc000885', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('fa87e531-02b1-4974-a5a5-3801c2853a5c', 'cc074d02-11bd-4650-8f65-4856cc000885', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('2188ec65-13f5-410b-83fa-8c921a073ce9', 'cc074d02-11bd-4650-8f65-4856cc000885', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9e5ac4cc-2a4b-49c8-949e-780c531a12c0', 'c4a35109-de4c-4b77-8e51-08787288f7c8', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('a2257683-ccca-4738-b435-f35e97ff267a', 'c4a35109-de4c-4b77-8e51-08787288f7c8', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('86d4e408-baf2-414a-8485-f5fae89fa007', 'c4a35109-de4c-4b77-8e51-08787288f7c8', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('447be991-15c0-4a15-a9c5-214cdd40a0e0', 'c4a35109-de4c-4b77-8e51-08787288f7c8', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('8dbd9a9e-eb8f-4c2c-a0f2-6ec848d96e52', 'c4a35109-de4c-4b77-8e51-08787288f7c8', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('3abb80b6-c587-42be-ad6b-242de6cd1a46', '1624d30d-3ab3-4bf9-a022-a31f84af99be', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('36a0e810-f924-49e2-ab63-e4198759b6e2', '1624d30d-3ab3-4bf9-a022-a31f84af99be', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('092de27e-e806-4b17-a492-b7c09a67853a', '1624d30d-3ab3-4bf9-a022-a31f84af99be', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('549ac93d-8684-4e1f-8401-a27a1afeb3be', '393fdb96-bbd5-4fa3-9ea5-3759fe282372', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('417680a6-ec00-4346-ada0-787ca8d78550', '393fdb96-bbd5-4fa3-9ea5-3759fe282372', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('c48f5a7e-f362-41b9-a0b8-d9a105bb6480', '393fdb96-bbd5-4fa3-9ea5-3759fe282372', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('4b10e38b-7d13-4ba7-b109-50b7810d9086', '393fdb96-bbd5-4fa3-9ea5-3759fe282372', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('33f5df43-35ef-43ff-9a22-001f83b21fa1', '393fdb96-bbd5-4fa3-9ea5-3759fe282372', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('64e23583-1746-4776-991e-555d2d12dcd3', 'cba18a87-d267-4814-820b-894a635968ba', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9966b846-cd48-4037-a4e9-246e6dadd54e', 'cba18a87-d267-4814-820b-894a635968ba', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('70de6bad-caa7-411c-8c25-726737400fe0', 'cba18a87-d267-4814-820b-894a635968ba', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('91b09dd6-20fb-493e-b8b5-5a76f96d1140', '23fbedc1-a9ea-4452-9e65-d79b95d89e5f', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('274cb994-a713-4de5-874d-6af7e64c2428', '23fbedc1-a9ea-4452-9e65-d79b95d89e5f', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('f077265f-64b0-47e9-8f8a-3e72b5016cb3', '23fbedc1-a9ea-4452-9e65-d79b95d89e5f', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('f9fe7351-c762-4965-995f-5caf71c3e2b8', 'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('87285f6c-2df6-4975-a4da-4d65f32bdb20', 'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('5c2fa563-be41-4c20-993a-a2f9feb5fd98', 'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('4191a871-cb1f-4a2b-b4ae-085703b80a12', 'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('1859b3a1-488e-441c-9a8a-e2c2fd278917', 'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('7388063b-bbc1-4b97-91de-0831301162f0', '59abfa2e-cce9-430b-b74f-9c55944a0123', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('be297874-4b5b-4aa2-9477-9462eace119c', '59abfa2e-cce9-430b-b74f-9c55944a0123', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('337fcc76-24d6-4b63-9ae1-25e70ddaa65d', '59abfa2e-cce9-430b-b74f-9c55944a0123', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('6947b666-cee1-48fd-9126-d8b9d92692f1', '59abfa2e-cce9-430b-b74f-9c55944a0123', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('ab56d553-4a23-485a-a104-1bbc526088a2', '59abfa2e-cce9-430b-b74f-9c55944a0123', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9758a794-8b1d-4611-9c92-8d0c351bb786', '2bd7a759-c672-4757-8163-564e37522e0b', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('a4468ffe-f8ea-4cf8-a4ef-c111c4dc7a68', '2bd7a759-c672-4757-8163-564e37522e0b', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('1f2a1d93-a3fe-4d12-aaa9-cdfda623a9a2', '2bd7a759-c672-4757-8163-564e37522e0b', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('7f4ca43a-1766-430d-b179-7ea799c8f467', '2bd7a759-c672-4757-8163-564e37522e0b', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('2f6a257a-0249-4667-87c8-2367a54840a0', '2bd7a759-c672-4757-8163-564e37522e0b', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('bc96d150-b0ec-4f00-9ee2-8a38fbceb092', 'cfa8f575-3fba-4dea-bd4f-e876b2868bee', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('907219ab-a3bb-40c8-bd91-5f6bbaf707d7', 'cfa8f575-3fba-4dea-bd4f-e876b2868bee', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9c8deca9-36a0-4b82-9c95-a3909a760ff9', 'cfa8f575-3fba-4dea-bd4f-e876b2868bee', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('21d8e8fd-d2c8-4e5b-af21-960673cefd5e', 'c96a76ab-041b-4447-99c5-01e24c3a7432', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('ed4c229f-8a8c-438a-992c-a882eadc2ea5', 'c96a76ab-041b-4447-99c5-01e24c3a7432', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('fe9e80f6-5266-47d5-a505-a45d2525263c', 'c96a76ab-041b-4447-99c5-01e24c3a7432', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('57388166-67b3-41f9-9c84-127d561078a2', 'c96a76ab-041b-4447-99c5-01e24c3a7432', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('5366f961-efd5-46b2-8448-ecbc9e30c0b9', 'c96a76ab-041b-4447-99c5-01e24c3a7432', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9810d0c1-2815-4eae-8a8b-c461962e001f', '9680ba83-bc72-4af7-86ca-b29152d51bf2', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9bc4f842-3c19-4ab1-be18-5373200075a5', '9680ba83-bc72-4af7-86ca-b29152d51bf2', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('9610b5b7-5f7b-4767-b597-47f218d52fc3', '9680ba83-bc72-4af7-86ca-b29152d51bf2', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('1d499c20-778b-4ad1-bf9a-1fb3834a2589', '3864bfd1-9781-4dee-83c2-58e5ded466b8', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('92b5138a-2e0a-41f3-bad7-83aa3e55b0f8', '3864bfd1-9781-4dee-83c2-58e5ded466b8', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('0e144c12-e02a-4168-9902-2ded094b83e8', '3864bfd1-9781-4dee-83c2-58e5ded466b8', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('4d26a567-c1ea-4c91-866b-362d8a97ab35', '3864bfd1-9781-4dee-83c2-58e5ded466b8', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('d7564c9f-2b62-43b4-b69a-e5569c5ab2c0', '24d9a7c0-5695-490a-b0f0-8522482ea5f5', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('5f4b2695-2cd6-425a-aac9-64aad41d487a', '24d9a7c0-5695-490a-b0f0-8522482ea5f5', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('6cba0648-47f6-4490-8027-27017872fe05', '24d9a7c0-5695-490a-b0f0-8522482ea5f5', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('236a490a-b38d-4d6c-8f71-c7c4161daddd', '24d9a7c0-5695-490a-b0f0-8522482ea5f5', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('fae56db5-e43c-4886-b13c-cb73cc17c60f', '24d9a7c0-5695-490a-b0f0-8522482ea5f5', '5ef09090-a44d-4067-bf69-474d2c639d6a') ON CONFLICT (plant_id, design_id) DO NOTHING;

INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('53be96d6-56ba-42ef-abb1-06516e6226f5', '12c8a019-45bf-4e68-88c0-60ed7ae77c03', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('ee8af1e7-9c62-4e4d-a9c6-aded4c3eebe4', '12c8a019-45bf-4e68-88c0-60ed7ae77c03', 'cb520214-6747-4ce4-81d3-305a13c780aa') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('e788968d-54de-489a-a437-e42b3465f883', '12c8a019-45bf-4e68-88c0-60ed7ae77c03', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (plant_id, design_id) DO NOTHING;
INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('d32de076-96ba-4fe4-b790-43ad4c00536e', '12c8a019-45bf-4e68-88c0-60ed7ae77c03', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (plant_id, design_id) DO NOTHING;

-- Projects Inserts
INSERT INTO projects (id, project_name, user_id) VALUES ('9e1e18bd-cd6a-459e-ab16-8675fa99e733', 'BackyardForest', '78a014bd-35fb-49f4-877f-8c8a1dc510ff') ON CONFLICT (id) DO NOTHING;

-- Layouts Inserts
INSERT INTO layouts (id, layout_name, bed_length, bed_depth, design_type, projects_id) VALUES (
  '3b1af4b8-20bf-4771-8f7a-a3ff72d92e2b',
  'newBeginnings',
  10,
  10,
  '84d03225-a2f4-411b-9b19-cd5e31f49bed',
  '9e1e18bd-cd6a-459e-ab16-8675fa99e733'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO layouts (id, layout_name, bed_length, bed_depth, design_type, projects_id) VALUES (
  '9ad97d1d-e4e9-4c17-869b-4cfd192edaef',
  'FernForest',
  12,
  6,
  'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc',
  '9e1e18bd-cd6a-459e-ab16-8675fa99e733'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO layouts (id, layout_name, bed_length, bed_depth, design_type, projects_id) VALUES (
  'c2994731-6d42-461c-8eba-fdf057ddf80a',
  'AbsoluteSucculent',
  15,
  10,
  '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c',
  '9e1e18bd-cd6a-459e-ab16-8675fa99e733'
) ON CONFLICT (id) DO NOTHING;


-- Favorite Plants Inserts
INSERT INTO favorite_plants (id, user_id, plant_id) VALUES ('ab9bfa87-a671-42ef-a6a2-78026de964eb', '78a014bd-35fb-49f4-877f-8c8a1dc510ff', 'c4a35109-de4c-4b77-8e51-08787288f7c8') ON CONFLICT (user_id, plant_id) DO NOTHING;
INSERT INTO favorite_plants (id, user_id, plant_id) VALUES ('ce66ecc6-0a7d-472a-a276-779a2e1351a5', '08f778c7-b10a-4d1b-bee1-4f8635233da3', 'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37') ON CONFLICT (user_id, plant_id) DO NOTHING;
INSERT INTO favorite_plants (id, user_id, plant_id) VALUES ('97516fda-77b5-4a44-9fb6-35fae276c79d', '85b7edfd-d0be-4156-933a-40004a3c38c5', '59e27d0a-6282-4dae-9954-bd1575606c5d') ON CONFLICT (user_id, plant_id) DO NOTHING;
INSERT INTO favorite_plants (id, user_id, plant_id) VALUES ('96d9f25c-3c78-43f6-b46a-ceb256e5dfbe', '8fb79eca-5262-4d99-9e29-9afc283cb5f8', 'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37') ON CONFLICT (user_id, plant_id) DO NOTHING;

-- Plant Layout Inserts
INSERT INTO plant_layout (id, plant_id, layout_id, x_coord, y_coord, diameter, height) VALUES (
  'b2206a48-e38c-4363-b187-a3001e266b08',
  'c4a35109-de4c-4b77-8e51-08787288f7c8',
  '3b1af4b8-20bf-4771-8f7a-a3ff72d92e2b',
  2,
  3,
  1.00,
  1.00
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plant_layout (id, plant_id, layout_id, x_coord, y_coord, diameter, height) VALUES (
  'ed7ace98-d037-4e8b-b3ef-38fcf2585184',
  'e7b999ba-54a7-4a5b-a3c7-d8f6797eab37',
  '9ad97d1d-e4e9-4c17-869b-4cfd192edaef',
  15,
  7,
  3.00,
  2.00
) ON CONFLICT (id) DO NOTHING;

INSERT INTO plant_layout (id, plant_id, layout_id, x_coord, y_coord, diameter, height) VALUES (
  '2af6f8c1-4139-4aca-b81e-168cd5c304e5',
  '59e27d0a-6282-4dae-9954-bd1575606c5d',
  'c2994731-6d42-461c-8eba-fdf057ddf80a',
  10,
  5,
  2.00,
  2.00
) ON CONFLICT (id) DO NOTHING;


-- Fave Designs Inserts
INSERT INTO fave_design (id, user_id, design_id) VALUES ('33d9b50c-a169-4d4b-a933-459b0d8fa60e', '08f778c7-b10a-4d1b-bee1-4f8635233da3', 'a4e1b58e-f2d6-423f-a332-2965ddf0f6bc') ON CONFLICT (id) DO NOTHING;
INSERT INTO fave_design (id, user_id, design_id) VALUES ('7b8143d3-e9b7-40a1-a984-1848af48aa40', '85b7edfd-d0be-4156-933a-40004a3c38c5', '8ddbc1dc-bbd3-41b7-929f-46db20f1d53c') ON CONFLICT (id) DO NOTHING;
INSERT INTO fave_design (id, user_id, design_id) VALUES ('5ef07689-56c6-4717-b8ba-be92a71868ba', '8fb79eca-5262-4d99-9e29-9afc283cb5f8', '84d03225-a2f4-411b-9b19-cd5e31f49bed') ON CONFLICT (id) DO NOTHING;

