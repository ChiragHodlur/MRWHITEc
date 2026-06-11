/* ============================================================
   Mr White Unlimited — script.js
   Includes: Difficulty System, 900+ Word Pairs, Grid Discussion Order,
   Custom In-Game Modals, and all core game functionality.
   ============================================================ */

/* ============================================================
   SECTION 1: GAME STATE
   ============================================================ */
const state = {
  difficulty:      "EASY", // EASY, MEDIUM, HARD
  totalPlayers:    6,
  undercoverCount: 1,
  currentPlayer:   0,      
  players:         [],     
  civilianWord:    "",
  undercoverWord:  "",
  gameHasStarted:  false   
};

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 15;

const ROLE_CIVILIAN   = "CIVILIAN";
const ROLE_UNDERCOVER = "UNDERCOVER";
const ROLE_MR_WHITE   = "MR WHITE";

/* ============================================================
   SECTION 2: MASSIVE DIFFICULTY DATABASES (900+ Pairs)
   ============================================================ */

const EASY_WORDS = {
  food_and_drink: [
    ["Pizza", "Burger"], ["Tea", "Coffee"], ["Milk", "Juice"], ["Apple", "Banana"], ["Cake", "Biscuit"],
    ["Salt", "Sugar"], ["Rice", "Roti"], ["Water", "Cold Drink"], ["Chicken", "Fish"], ["Onion", "Potato"],
    ["Tomato", "Carrot"], ["Butter", "Cheese"], ["Dal", "Soup"], ["Samosa", "Pakora"], ["Puri", "Paratha"],
    ["Mango", "Orange"], ["Grapes", "Watermelon"], ["Ice Cream", "Chocolate"], ["Curd", "Milk"], ["Lemon", "Orange"],
    ["Egg", "Chicken"], ["Noodles", "Pasta"], ["Tea", "Juice"], ["Bread", "Biscuit"], ["Honey", "Jam"],
    ["Garlic", "Ginger"], ["Peanut", "Cashew"], ["Pancake", "Waffle"], ["Apple", "Mango"], ["Water", "Milk"],
    ["Pizza", "Pasta"], ["Burger", "Sandwich"], ["Coffee", "Cold Drink"], ["Rice", "Dal"], ["Meat", "Chicken"],
    ["Cake", "Pastry"], ["Butter", "Jam"], ["Salt", "Pepper"], ["Sugar", "Jaggery"], ["Almond", "Walnut"],
    ["Chili", "Lemon"], ["Sweets", "Chocolate"], ["Biscuit", "Cookie"], ["Tea", "Soup"], ["Curd", "Butter"],
    ["Mango", "Banana"], ["Apple", "Orange"], ["Rice", "Bread"], ["Water", "Juice"], ["Milk", "Tea"]
  ],
  animals: [
    ["Dog", "Cat"], ["Cow", "Buffalo"], ["Lion", "Tiger"], ["Rat", "Mouse"], ["Crow", "Pigeon"],
    ["Snake", "Lizard"], ["Monkey", "Gorilla"], ["Horse", "Donkey"], ["Elephant", "Camel"], ["Fish", "Frog"],
    ["Peacock", "Parrot"], ["Ant", "Mosquito"], ["Spider", "Cockroach"], ["Goat", "Sheep"], ["Duck", "Hen"],
    ["Bear", "Panda"], ["Deer", "Zebra"], ["Pig", "Boar"], ["Wolf", "Fox"], ["Rabbit", "Hare"],
    ["Eagle", "Hawk"], ["Penguin", "Seal"], ["Turtle", "Tortoise"], ["Shark", "Dolphin"], ["Butterfly", "Bee"],
    ["Bat", "Owl"], ["Cheetah", "Leopard"], ["Crocodile", "Alligator"], ["Kitten", "Puppy"], ["Giraffe", "Zebra"],
    ["Swan", "Duck"], ["Sparrow", "Pigeon"], ["Ostrich", "Emu"], ["Fly", "Mosquito"], ["Snail", "Worm"],
    ["Crab", "Lobster"], ["Whale", "Shark"], ["Camel", "Horse"], ["Tiger", "Leopard"], ["Cat", "Rabbit"],
    ["Dog", "Wolf"], ["Cow", "Goat"], ["Sheep", "Pig"], ["Elephant", "Rhino"], ["Gorilla", "Chimpanzee"],
    ["Mouse", "Squirrel"], ["Bat", "Bird"], ["Snake", "Worm"], ["Frog", "Fish"], ["Ant", "Spider"]
  ],
  everyday_objects: [
    ["Pen", "Pencil"], ["Book", "Notebook"], ["Phone", "TV"], ["Cup", "Glass"], ["Plate", "Bowl"],
    ["Spoon", "Fork"], ["Lock", "Key"], ["Shoes", "Slippers"], ["Soap", "Shampoo"], ["Towel", "Cloth"],
    ["Chair", "Table"], ["Door", "Window"], ["Fan", "AC"], ["Watch", "Clock"], ["Bag", "Box"],
    ["Bed", "Sofa"], ["Comb", "Brush"], ["Mirror", "Glass"], ["Bottle", "Jug"], ["Broom", "Mop"],
    ["Spectacles", "Sunglasses"], ["Wallet", "Purse"], ["Laptop", "Computer"], ["Umbrella", "Raincoat"], ["Knife", "Scissors"],
    ["Candle", "Lamp"], ["Pillow", "Cushion"], ["Blanket", "Bedsheet"], ["Toothbrush", "Toothpaste"], ["Battery", "Charger"],
    ["Bucket", "Mug"], ["Hammer", "Nail"], ["Thread", "Needle"], ["Coin", "Note"], ["Ring", "Necklace"],
    ["Matchbox", "Lighter"], ["Dustbin", "Bucket"], ["Calendar", "Clock"], ["Remote", "TV"], ["Keyboard", "Mouse"],
    ["Pen", "Marker"], ["Book", "Magazine"], ["Bag", "Suitcase"], ["Bed", "Cot"], ["Spoon", "Knife"],
    ["Shoes", "Socks"], ["Belt", "Tie"], ["Cap", "Helmet"], ["Phone", "Laptop"], ["Bottle", "Cup"]
  ],
  places: [
    ["School", "College"], ["Hospital", "Clinic"], ["Shop", "Market"], ["House", "Flat"], ["Village", "City"],
    ["Office", "Bank"], ["Park", "Garden"], ["Station", "Bus Stand"], ["Cinema", "TV"], ["Hotel", "Restaurant"],
    ["Temple", "Church"], ["Road", "Street"], ["Kitchen", "Bathroom"], ["Room", "Hall"], ["Beach", "Pool"],
    ["Mountain", "Hill"], ["Forest", "Jungle"], ["Airport", "Train Station"], ["Library", "Bookstore"], ["Gym", "Playground"],
    ["Zoo", "Museum"], ["Factory", "Warehouse"], ["Farm", "Field"], ["Bridge", "Tunnel"], ["Stadium", "Arena"],
    ["Cafe", "Restaurant"], ["Mall", "Market"], ["Post Office", "Bank"], ["Pharmacy", "Clinic"], ["Salon", "Barbershop"],
    ["Street", "Highway"], ["River", "Sea"], ["Island", "Beach"], ["Cave", "Tunnel"], ["Desert", "Forest"],
    ["City", "Town"], ["House", "Tent"], ["Kitchen", "Dining Room"], ["Bedroom", "Living Room"], ["Roof", "Balcony"],
    ["Office", "School"], ["Shop", "Mall"], ["Park", "Forest"], ["Station", "Airport"], ["Temple", "Mosque"],
    ["Church", "Temple"], ["Hotel", "House"], ["Road", "Bridge"], ["Pool", "River"], ["Sea", "Lake"]
  ],
  nature_and_time: [
    ["Sun", "Moon"], ["Day", "Night"], ["Rain", "Cloud"], ["Tree", "Plant"], ["Fire", "Water"],
    ["Star", "Moon"], ["River", "Sea"], ["Mountain", "Hill"], ["Sky", "Earth"], ["Wind", "Rain"],
    ["Flower", "Leaf"], ["Morning", "Evening"], ["Summer", "Winter"], ["Mud", "Dust"], ["Stone", "Sand"],
    ["Ice", "Water"], ["Snow", "Rain"], ["Lightning", "Thunder"], ["Fog", "Smoke"], ["Grass", "Tree"],
    ["Sunrise", "Sunset"], ["Today", "Tomorrow"], ["Week", "Month"], ["Year", "Month"], ["Hour", "Minute"],
    ["Seed", "Plant"], ["Root", "Branch"], ["Spring", "Autumn"], ["Hot", "Cold"], ["Light", "Dark"],
    ["Sun", "Star"], ["Moon", "Earth"], ["River", "Lake"], ["Sea", "Ocean"], ["Hill", "Valley"],
    ["Fire", "Smoke"], ["Ice", "Snow"], ["Rain", "Storm"], ["Wind", "Breeze"], ["Flower", "Fruit"],
    ["Leaf", "Branch"], ["Morning", "Afternoon"], ["Evening", "Night"], ["Summer", "Rainy Season"], ["Dust", "Smoke"],
    ["Stone", "Rock"], ["Sand", "Soil"], ["Day", "Week"], ["Minute", "Second"], ["Time", "Clock"]
  ],
  people_and_misc: [
    ["Mother", "Father"], ["Brother", "Sister"], ["Uncle", "Aunty"], ["Boy", "Girl"], ["Teacher", "Student"],
    ["Doctor", "Nurse"], ["Friend", "Brother"], ["Police", "Thief"], ["Hand", "Leg"], ["Eye", "Ear"],
    ["Nose", "Mouth"], ["Hair", "Head"], ["Tooth", "Tongue"], ["Finger", "Thumb"], ["King", "Queen"],
    ["Singer", "Dancer"], ["Actor", "Director"], ["Driver", "Pilot"], ["Chef", "Waiter"], ["Farmer", "Worker"],
    ["Happy", "Sad"], ["Laugh", "Cry"], ["Run", "Walk"], ["Sleep", "Wake"], ["Sit", "Stand"],
    ["Read", "Write"], ["Eat", "Drink"], ["Buy", "Sell"], ["Win", "Lose"], ["Open", "Close"],
    ["Car", "Bus"], ["Bike", "Scooter"], ["Cycle", "Bike"], ["Train", "Bus"], ["Auto", "Rickshaw"],
    ["Airplane", "Helicopter"], ["Boat", "Ship"], ["Truck", "Tractor"], ["Driver", "Pilot"], ["Road", "Track"],
    ["Fast", "Slow"], ["Big", "Small"], ["Hot", "Cold"], ["Good", "Bad"], ["Hard", "Soft"],
    ["Heavy", "Light"], ["Long", "Short"], ["Old", "New"], ["Rich", "Poor"], ["Clean", "Dirty"]
  ]
};

const MEDIUM_WORDS = {
  food_and_drink: [
    ["Tea", "Green Tea"], ["Coffee", "Espresso"], ["Apple", "Pear"], ["Pizza", "Pasta"], ["Burger", "Sandwich"],
    ["Roti", "Naan"], ["Dal", "Soup"], ["Butter", "Cheese"], ["Lemon", "Lime"], ["Curd", "Yogurt"],
    ["Samosa", "Kachori"], ["Puri", "Bhatura"], ["Biscuit", "Cookie"], ["Cake", "Pastry"], ["Ice Cream", "Gelato"],
    ["Milk", "Milkshake"], ["Juice", "Smoothie"], ["Water", "Soda"], ["Salt", "Pepper"], ["Sugar", "Jaggery"],
    ["Chicken", "Mutton"], ["Fish", "Prawn"], ["Onion", "Garlic"], ["Potato", "Sweet Potato"], ["Tomato", "Capsicum"],
    ["Mango", "Papaya"], ["Banana", "Plantain"], ["Grapes", "Berries"], ["Watermelon", "Muskmelon"], ["Rice", "Pulao"],
    ["Noodles", "Spaghetti"], ["Bread", "Baguette"], ["Honey", "Maple Syrup"], ["Peanut", "Almond"], ["Cashew", "Walnut"],
    ["Pancake", "Waffle"], ["Chocolate", "Fudge"], ["Candy", "Lollipop"], ["Mint", "Gum"], ["Jam", "Marmalade"],
    ["Soup", "Broth"], ["Salad", "Coleslaw"], ["Steak", "Chop"], ["Omelette", "Boiled Egg"], ["Tea", "Black Tea"],
    ["Coffee", "Cold Coffee"], ["Burger", "Hot Dog"], ["Pizza", "Garlic Bread"], ["Butter", "Margarine"], ["Cheese", "Paneer"]
  ],
  animals: [
    ["Dog", "Wolf"], ["Cat", "Tiger"], ["Lion", "Leopard"], ["Rat", "Mouse"], ["Crow", "Eagle"],
    ["Frog", "Toad"], ["Butterfly", "Moth"], ["Crocodile", "Alligator"], ["Rabbit", "Hare"], ["Horse", "Pony"],
    ["Donkey", "Mule"], ["Elephant", "Rhino"], ["Monkey", "Chimpanzee"], ["Gorilla", "Ape"], ["Snake", "Python"],
    ["Lizard", "Chameleon"], ["Turtle", "Tortoise"], ["Shark", "Whale"], ["Dolphin", "Porpoise"], ["Fish", "Shark"],
    ["Peacock", "Pheasant"], ["Parrot", "Macaw"], ["Pigeon", "Dove"], ["Duck", "Goose"], ["Hen", "Rooster"],
    ["Ant", "Termite"], ["Spider", "Scorpion"], ["Bee", "Wasp"], ["Mosquito", "Fly"], ["Bat", "Vampire Bat"],
    ["Bear", "Polar Bear"], ["Deer", "Moose"], ["Pig", "Boar"], ["Fox", "Jackal"], ["Cheetah", "Panther"],
    ["Giraffe", "Camel"], ["Zebra", "Horse"], ["Kitten", "Cat"], ["Puppy", "Dog"], ["Cub", "Lion"],
    ["Calf", "Cow"], ["Sheep", "Lamb"], ["Goat", "Ram"], ["Eagle", "Hawk"], ["Owl", "Falcon"],
    ["Penguin", "Puffin"], ["Seal", "Walrus"], ["Crab", "Lobster"], ["Snail", "Slug"], ["Worm", "Caterpillar"]
  ],
  everyday_objects: [
    ["Pen", "Marker"], ["Book", "Notebook"], ["Phone", "Tablet"], ["Laptop", "Computer"], ["Cup", "Glass"],
    ["Spoon", "Fork"], ["Lock", "Key"], ["Shoes", "Slippers"], ["Soap", "Shampoo"], ["Towel", "Napkin"],
    ["Chair", "Stool"], ["Table", "Desk"], ["Door", "Gate"], ["Window", "Vent"], ["Fan", "Cooler"],
    ["Watch", "Smartwatch"], ["Clock", "Alarm"], ["Bag", "Backpack"], ["Box", "Carton"], ["Bed", "Cot"],
    ["Sofa", "Armchair"], ["Comb", "Brush"], ["Mirror", "Looking Glass"], ["Bottle", "Flask"], ["Jug", "Pitcher"],
    ["Broom", "Mop"], ["Spectacles", "Sunglasses"], ["Wallet", "Purse"], ["Umbrella", "Parasol"], ["Knife", "Dagger"],
    ["Scissors", "Shears"], ["Candle", "Torch"], ["Lamp", "Lantern"], ["Pillow", "Cushion"], ["Blanket", "Quilt"],
    ["Bedsheet", "Coverlet"], ["Toothbrush", "Toothpaste"], ["Battery", "Cell"], ["Charger", "Adapter"], ["Bucket", "Tub"],
    ["Mug", "Jug"], ["Hammer", "Mallet"], ["Nail", "Screw"], ["Thread", "Yarn"], ["Needle", "Pin"],
    ["Coin", "Token"], ["Note", "Bill"], ["Ring", "Band"], ["Necklace", "Chain"], ["Matchbox", "Lighter"]
  ],
  places: [
    ["Hospital", "Pharmacy"], ["Shop", "Market"], ["Cinema", "Theatre"], ["Hotel", "Restaurant"], ["Road", "Street"],
    ["Kitchen", "Dining Room"], ["Beach", "Coast"], ["Mountain", "Hill"], ["Forest", "Woods"], ["Airport", "Helipad"],
    ["Train Station", "Metro Station"], ["Library", "Archive"], ["Bookstore", "Library"], ["Gym", "Fitness Centre"], ["Playground", "Park"],
    ["Zoo", "Aquarium"], ["Museum", "Gallery"], ["Factory", "Workshop"], ["Warehouse", "Godown"], ["Farm", "Barn"],
    ["Field", "Meadow"], ["Bridge", "Overpass"], ["Tunnel", "Underpass"], ["Stadium", "Arena"], ["Cafe", "Bakery"],
    ["Restaurant", "Diner"], ["Mall", "Supermarket"], ["Market", "Bazaar"], ["Post Office", "Courier Office"], ["Bank", "ATM"],
    ["Clinic", "Dispensary"], ["Salon", "Parlour"], ["Barbershop", "Salon"], ["Street", "Alley"], ["Highway", "Expressway"],
    ["River", "Stream"], ["Sea", "Ocean"], ["Island", "Peninsula"], ["Cave", "Cavern"], ["Desert", "Wasteland"],
    ["City", "Metropolis"], ["Town", "Municipality"], ["Village", "Hamlet"], ["House", "Villa"], ["Flat", "Apartment"],
    ["Tent", "Camp"], ["Bedroom", "Guest Room"], ["Living Room", "Lounge"], ["Bathroom", "Washroom"], ["Roof", "Terrace"]
  ],
  nature_and_time: [
    ["Rain", "Snow"], ["River", "Lake"], ["Hill", "Valley"], ["Wind", "Storm"], ["Flower", "Leaf"],
    ["Morning", "Afternoon"], ["Summer", "Spring"], ["Sun", "Star"], ["Moon", "Planet"], ["Day", "Dawn"],
    ["Night", "Dusk"], ["Cloud", "Fog"], ["Tree", "Bush"], ["Plant", "Shrub"], ["Fire", "Flame"],
    ["Water", "Ice"], ["Sea", "Gulf"], ["Mountain", "Peak"], ["Sky", "Space"], ["Earth", "Globe"],
    ["Rain", "Shower"], ["Evening", "Twilight"], ["Winter", "Autumn"], ["Mud", "Dirt"], ["Dust", "Ash"],
    ["Stone", "Pebble"], ["Sand", "Gravel"], ["Ice", "Frost"], ["Snow", "Hail"], ["Lightning", "Flash"],
    ["Thunder", "Roar"], ["Smoke", "Vapor"], ["Grass", "Weed"], ["Tree", "Wood"], ["Sunrise", "Dawn"],
    ["Sunset", "Dusk"], ["Today", "Now"], ["Tomorrow", "Future"], ["Week", "Fortnight"], ["Month", "Quarter"],
    ["Year", "Decade"], ["Hour", "Minute"], ["Minute", "Second"], ["Seed", "Grain"], ["Plant", "Crop"],
    ["Root", "Stem"], ["Branch", "Twig"], ["Hot", "Warm"], ["Cold", "Cool"], ["Light", "Bright"]
  ],
  people_and_misc: [
    ["Doctor", "Surgeon"], ["Teacher", "Principal"], ["Police", "Army"], ["Hand", "Arm"], ["Foot", "Leg"],
    ["Mouth", "Lips"], ["Hair", "Beard"], ["Car", "Jeep"], ["Bike", "Motorcycle"], ["Train", "Metro"],
    ["Auto", "Taxi"], ["Airplane", "Jet"], ["Ship", "Submarine"], ["Mother", "Grandmother"], ["Father", "Grandfather"],
    ["Brother", "Cousin"], ["Sister", "Cousin"], ["Uncle", "Nephew"], ["Aunty", "Niece"], ["Boy", "Man"],
    ["Girl", "Woman"], ["Student", "Pupil"], ["Nurse", "Ward Boy"], ["Friend", "Colleague"], ["Thief", "Robber"],
    ["Eye", "Eyelid"], ["Ear", "Eardrum"], ["Nose", "Nostril"], ["Head", "Forehead"], ["Tooth", "Gum"],
    ["Tongue", "Palate"], ["Finger", "Knuckle"], ["Thumb", "Finger"], ["King", "Emperor"], ["Queen", "Princess"],
    ["Singer", "Musician"], ["Dancer", "Choreographer"], ["Actor", "Performer"], ["Director", "Producer"], ["Driver", "Chauffeur"],
    ["Pilot", "Captain"], ["Chef", "Cook"], ["Waiter", "Server"], ["Farmer", "Peasant"], ["Worker", "Laborer"],
    ["Happy", "Joyful"], ["Sad", "Depressed"], ["Laugh", "Smile"], ["Cry", "Weep"], ["Run", "Sprint"]
  ]
};

const HARD_WORDS = {
  food_and_drink: [
    ["Biscuit", "Cookie"], ["Roti", "Chapati"], ["Curd", "Yogurt"], ["Jam", "Jelly"], ["Pancake", "Waffle"],
    ["Soup", "Broth"], ["Frying Pan", "Wok"], ["Butter", "Margarine"], ["Coriander", "Cilantro"], ["Capsicum", "Bell Pepper"],
    ["Ladyfinger", "Okra"], ["Brinjal", "Eggplant"], ["Prawn", "Shrimp"], ["Mutton", "Lamb"], ["Chicken", "Poultry"],
    ["Milk", "Cream"], ["Juice", "Nectar"], ["Soda", "Cola"], ["Water", "Mineral Water"], ["Salt", "Rock Salt"],
    ["Sugar", "Sweetener"], ["Ice Cream", "Frozen Yogurt"], ["Cake", "Sponge Cake"], ["Pastry", "Tart"], ["Pizza", "Calzone"],
    ["Burger", "Slider"], ["Sandwich", "Sub"], ["Bread", "Loaf"], ["Naan", "Kulcha"], ["Dal", "Lentils"],
    ["Rice", "Basmati"], ["Noodles", "Vermicelli"], ["Spaghetti", "Pasta"], ["Tea", "Chai"], ["Coffee", "Mocha"],
    ["Espresso", "Americano"], ["Apple", "Crabapple"], ["Mango", "Alphonso"], ["Banana", "Robusta"], ["Grapes", "Raisins"],
    ["Lemon", "Lime"], ["Orange", "Tangerine"], ["Melon", "Cantaloupe"], ["Peanut", "Groundnut"], ["Almond", "Nut"],
    ["Chocolate", "Cocoa"], ["Candy", "Toffee"], ["Mint", "Peppermint"], ["Salad", "Greens"], ["Steak", "Beef"]
  ],
  animals: [
    ["Mouse", "Rat"], ["Turtle", "Tortoise"], ["Frog", "Toad"], ["Rabbit", "Hare"], ["Alligator", "Crocodile"],
    ["Crow", "Raven"], ["Dolphin", "Porpoise"], ["Butterfly", "Moth"], ["Bee", "Wasp"], ["Ape", "Monkey"],
    ["Chimpanzee", "Gorilla"], ["Leopard", "Cheetah"], ["Jaguar", "Panther"], ["Tiger", "Lion"], ["Wolf", "Coyote"],
    ["Fox", "Jackal"], ["Dog", "Hound"], ["Cat", "Feline"], ["Pony", "Horse"], ["Mule", "Donkey"],
    ["Sheep", "Lamb"], ["Goat", "Ram"], ["Cow", "Bull"], ["Ox", "Buffalo"], ["Pig", "Hog"],
    ["Boar", "Swine"], ["Deer", "Stag"], ["Moose", "Elk"], ["Camel", "Dromedary"], ["Llama", "Alpaca"],
    ["Pigeon", "Dove"], ["Hawk", "Falcon"], ["Eagle", "Kite"], ["Owl", "Barn Owl"], ["Duck", "Mallard"],
    ["Goose", "Swan"], ["Hen", "Chicken"], ["Rooster", "Cock"], ["Peacock", "Peafowl"], ["Parrot", "Macaw"],
    ["Shark", "Great White"], ["Whale", "Orca"], ["Seal", "Sea Lion"], ["Walrus", "Manatee"], ["Penguin", "Emperor Penguin"],
    ["Crab", "Hermit Crab"], ["Lobster", "Crayfish"], ["Snail", "Slug"], ["Worm", "Earthworm"], ["Spider", "Tarantula"]
  ],
  everyday_objects: [
    ["Cup", "Mug"], ["Sofa", "Couch"], ["Rug", "Carpet"], ["Pillow", "Cushion"], ["Blanket", "Quilt"],
    ["Wardrobe", "Cupboard"], ["Desk", "Table"], ["Chair", "Stool"], ["Broom", "Mop"], ["Spectacles", "Glasses"],
    ["Jacket", "Coat"], ["Shoes", "Sneakers"], ["Pen", "Ballpoint"], ["Pencil", "Lead Pencil"], ["Notebook", "Notepad"],
    ["Book", "Novel"], ["Phone", "Mobile"], ["Tablet", "iPad"], ["Laptop", "Notebook"], ["Computer", "PC"],
    ["Glass", "Tumbler"], ["Plate", "Dish"], ["Bowl", "Basin"], ["Spoon", "Ladle"], ["Fork", "Trident"],
    ["Lock", "Padlock"], ["Key", "Passkey"], ["Slippers", "Flip-flops"], ["Soap", "Body Wash"], ["Shampoo", "Conditioner"],
    ["Towel", "Bath Towel"], ["Napkin", "Tissue"], ["Door", "Portal"], ["Gate", "Entrance"], ["Window", "Casement"],
    ["Fan", "Blower"], ["AC", "Air Conditioner"], ["Cooler", "Chiller"], ["Watch", "Timepiece"], ["Clock", "Timer"],
    ["Bag", "Sack"], ["Backpack", "Rucksack"], ["Box", "Container"], ["Carton", "Package"], ["Bed", "Mattress"],
    ["Cot", "Crib"], ["Armchair", "Recliner"], ["Comb", "Hairbrush"], ["Mirror", "Reflector"], ["Bottle", "Vial"]
  ],
  places: [
    ["Road", "Street"], ["House", "Home"], ["Forest", "Jungle"], ["Hill", "Mountain"], ["Shop", "Store"],
    ["Village", "Town"], ["Sea", "Ocean"], ["Path", "Trail"], ["Highway", "Freeway"], ["Hospital", "Clinic"],
    ["Pharmacy", "Chemist"], ["Market", "Bazaar"], ["Cinema", "Movie Theatre"], ["Hotel", "Motel"], ["Restaurant", "Diner"],
    ["Cafe", "Coffee Shop"], ["Kitchen", "Pantry"], ["Dining Room", "Eatery"], ["Beach", "Shore"], ["Coast", "Seaboard"],
    ["Woods", "Timberland"], ["Airport", "Airstrip"], ["Train Station", "Railway Station"], ["Metro", "Subway"], ["Library", "Athenaeum"],
    ["Bookstore", "Bookshop"], ["Gym", "Health Club"], ["Playground", "Play Area"], ["Park", "Garden"], ["Zoo", "Menagerie"],
    ["Aquarium", "Oceanarium"], ["Museum", "Exhibition"], ["Gallery", "Studio"], ["Factory", "Plant"], ["Workshop", "Garage"],
    ["Warehouse", "Depot"], ["Farm", "Ranch"], ["Barn", "Shed"], ["Field", "Pasture"], ["Meadow", "Grassland"],
    ["Bridge", "Viaduct"], ["Overpass", "Flyover"], ["Tunnel", "Shaft"], ["Underpass", "Subway"], ["Stadium", "Coliseum"],
    ["Arena", "Bowl"], ["Bakery", "Patisserie"], ["Supermarket", "Hypermarket"], ["Post Office", "Mailroom"], ["Bank", "Credit Union"]
  ],
  nature_and_time: [
    ["Rain", "Drizzle"], ["Dirt", "Soil"], ["Mud", "Clay"], ["Stone", "Rock"], ["Wind", "Breeze"],
    ["Sunrise", "Dawn"], ["Sunset", "Dusk"], ["Cloud", "Fog"], ["Snow", "Flurry"], ["River", "Stream"],
    ["Lake", "Pond"], ["Valley", "Gorge"], ["Storm", "Tempest"], ["Flower", "Blossom"], ["Leaf", "Frond"],
    ["Morning", "Forenoon"], ["Afternoon", "Midday"], ["Summer", "Summertime"], ["Spring", "Springtime"], ["Sun", "Sunlight"],
    ["Star", "Starlight"], ["Moon", "Moonlight"], ["Planet", "World"], ["Day", "Daytime"], ["Night", "Nighttime"],
    ["Mist", "Haze"], ["Tree", "Sapling"], ["Bush", "Thicket"], ["Plant", "Herb"], ["Shrub", "Hedge"],
    ["Fire", "Blaze"], ["Flame", "Spark"], ["Water", "Liquid"], ["Ice", "Glacier"], ["Sea", "Marine"],
    ["Gulf", "Bay"], ["Mountain", "Mount"], ["Peak", "Summit"], ["Sky", "Heavens"], ["Space", "Cosmos"],
    ["Earth", "Terra"], ["Globe", "Sphere"], ["Shower", "Downpour"], ["Evening", "Eventide"], ["Twilight", "Gloaming"],
    ["Winter", "Wintertime"], ["Autumn", "Fall"], ["Ash", "Cinder"], ["Pebble", "Cobblestone"], ["Sand", "Dust"]
  ],
  people_and_misc: [
    ["Gift", "Present"], ["Reply", "Answer"], ["Idea", "Thought"], ["Leap", "Jump"], ["Shout", "Yell"],
    ["Smile", "Grin"], ["Trash", "Garbage"], ["Centre", "Middle"], ["Doctor", "Physician"], ["Surgeon", "Specialist"],
    ["Teacher", "Educator"], ["Principal", "Headmaster"], ["Police", "Cop"], ["Army", "Military"], ["Hand", "Palm"],
    ["Arm", "Limb"], ["Foot", "Paw"], ["Leg", "Limb"], ["Mouth", "Maw"], ["Lips", "Beak"],
    ["Hair", "Fur"], ["Beard", "Stubble"], ["Car", "Automobile"], ["Jeep", "SUV"], ["Bike", "Bicycle"],
    ["Motorcycle", "Motorbike"], ["Train", "Locomotive"], ["Metro", "Tube"], ["Auto", "Tuk-Tuk"], ["Taxi", "Cab"],
    ["Airplane", "Aircraft"], ["Jet", "Plane"], ["Ship", "Vessel"], ["Submarine", "U-boat"], ["Mother", "Mom"],
    ["Father", "Dad"], ["Grandmother", "Granny"], ["Grandfather", "Grandpa"], ["Brother", "Sibling"], ["Sister", "Sibling"],
    ["Cousin", "Relative"], ["Uncle", "Kinsman"], ["Aunty", "Kinswoman"], ["Nephew", "Kinsman"], ["Niece", "Kinswoman"],
    ["Boy", "Lad"], ["Man", "Gentleman"], ["Girl", "Lass"], ["Woman", "Lady"], ["Student", "Scholar"]
  ]
};

/* ============================================================
   SECTION 3: ROLE & WORD ASSIGNMENT
   ============================================================ */

function updateMaxUndercovers() {
  const maxU = state.totalPlayers - 2;
  const uDisplay = document.getElementById("undercover-count-display");
  const hintDisplay = document.getElementById("undercover-hint");

  let showedValidation = false;

  if (state.undercoverCount > maxU) {
    state.undercoverCount = maxU;
    uDisplay.textContent = state.undercoverCount;

    hintDisplay.textContent = "Reduced to keep at least 1 Civilian!";
    hintDisplay.style.color = "var(--accent-red)";
    showedValidation = true;

    setTimeout(() => {
      hintDisplay.style.color = "";
      hintDisplay.textContent = `0 to ${maxU} undercovers allowed`;
    }, 2000);
  }

  if (!showedValidation) {
    hintDisplay.textContent = `0 to ${maxU} undercovers allowed`;
  }
}

function assignRoles() {
  const roles = [ROLE_MR_WHITE];

  for (let i = 0; i < state.undercoverCount; i++) {
    roles.push(ROLE_UNDERCOVER);
  }

  while (roles.length < state.totalPlayers) {
    roles.push(ROLE_CIVILIAN);
  }

  shuffleArray(roles);
  return roles;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function pickWordPair() {
  let wordData;
  if (state.difficulty === "EASY") {
    wordData = EASY_WORDS;
  } else if (state.difficulty === "MEDIUM") {
    wordData = MEDIUM_WORDS;
  } else {
    wordData = HARD_WORDS;
  }

  const categories = Object.keys(wordData);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const pairs = wordData[randomCategory];
  const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
  const flip = Math.random() < 0.5;

  return {
    civilianWord:   flip ? randomPair[0] : randomPair[1],
    undercoverWord: flip ? randomPair[1] : randomPair[0],
  };
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

/* ============================================================
   SECTION 4: CUSTOM MODAL SYSTEM
   ============================================================ */
function showConfirmModal(title, body, confirmLabel, onConfirm, onCancel) {
  const overlay  = document.getElementById("modal-overlay");
  const titleEl  = document.getElementById("modal-title");
  const bodyEl   = document.getElementById("modal-body");
  const btnsEl   = document.getElementById("modal-buttons");

  titleEl.textContent = title;
  bodyEl.textContent  = body;
  bodyEl.className    = "modal-body"; 

  btnsEl.innerHTML = "";

  const cancelBtn = document.createElement("button");
  cancelBtn.className   = "btn-secondary";
  cancelBtn.textContent = "CANCEL";
  cancelBtn.addEventListener("click", () => {
    hideModal();
    if (onCancel) onCancel();
  });

  const confirmBtn = document.createElement("button");
  confirmBtn.className   = "btn-primary";
  confirmBtn.textContent = confirmLabel;
  confirmBtn.addEventListener("click", () => {
    hideModal();
    onConfirm();
  });

  btnsEl.appendChild(cancelBtn);
  btnsEl.appendChild(confirmBtn);

  overlay.classList.remove("hidden");
}

function showInfoModal(title, body, bodyClass, btnLabel, onClose) {
  const overlay  = document.getElementById("modal-overlay");
  const titleEl  = document.getElementById("modal-title");
  const bodyEl   = document.getElementById("modal-body");
  const btnsEl   = document.getElementById("modal-buttons");

  titleEl.textContent = title;
  bodyEl.textContent  = body;
  bodyEl.className    = `modal-body ${bodyClass}`;

  btnsEl.innerHTML = "";

  const btn = document.createElement("button");
  btn.className   = "btn-primary";
  btn.textContent = btnLabel;
  btn.style.width = "100%";
  btn.addEventListener("click", () => {
    hideModal();
    onClose();
  });

  btnsEl.appendChild(btn);
  overlay.classList.remove("hidden");
}

function hideModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

/* ============================================================
   SECTION 5: WELCOME SCREEN
   ============================================================ */
function initWelcomeScreen() {
  const countDisplay = document.getElementById("player-count-display");
  const btnMinus     = document.getElementById("btn-minus");
  const btnPlus      = document.getElementById("btn-plus");

  const uDisplay  = document.getElementById("undercover-count-display");
  const btnUMinus = document.getElementById("btn-u-minus");
  const btnUPlus  = document.getElementById("btn-u-plus");

  updateMaxUndercovers();
  initDifficultySelector();

  btnMinus.addEventListener("click", () => {
    if (state.totalPlayers > MIN_PLAYERS) {
      state.totalPlayers--;
      countDisplay.textContent = state.totalPlayers;
      updateMaxUndercovers();
    }
  });

  btnPlus.addEventListener("click", () => {
    if (state.totalPlayers < MAX_PLAYERS) {
      state.totalPlayers++;
      countDisplay.textContent = state.totalPlayers;
      updateMaxUndercovers();
    }
  });

  btnUMinus.addEventListener("click", () => {
    if (state.undercoverCount > 0) {
      state.undercoverCount--;
      uDisplay.textContent = state.undercoverCount;
    }
  });

  btnUPlus.addEventListener("click", () => {
    const maxU = state.totalPlayers - 2;
    if (state.undercoverCount < maxU) {
      state.undercoverCount++;
      uDisplay.textContent = state.undercoverCount;
    } else {
      const hintDisplay = document.getElementById("undercover-hint");
      hintDisplay.textContent = "Cannot exceed! Need at least 1 Civilian.";
      hintDisplay.style.color = "var(--accent-red)";

      setTimeout(() => {
        hintDisplay.style.color = "";
        hintDisplay.textContent = `0 to ${maxU} undercovers allowed`;
      }, 2000);
    }
  });

  document.getElementById("btn-welcome-next").addEventListener("click", () => {
    generateNameInputs();
    showScreen("screen-names");
  });
}

function initDifficultySelector() {
  const btnEasy   = document.getElementById("btn-diff-easy");
  const btnMedium = document.getElementById("btn-diff-medium");
  const btnHard   = document.getElementById("btn-diff-hard");
  const hintText  = document.getElementById("difficulty-hint");

  function setDifficulty(level, btn, text) {
    state.difficulty = level;
    btnEasy.classList.remove("active");
    btnMedium.classList.remove("active");
    btnHard.classList.remove("active");
    btn.classList.add("active");
    hintText.textContent = text;
  }

  btnEasy.addEventListener("click", () => {
    setDifficulty("EASY", btnEasy, "Common words. Easy to find the Undercover.");
  });

  btnMedium.addEventListener("click", () => {
    setDifficulty("MEDIUM", btnMedium, "More specific. Players will often be uncertain.");
  });

  btnHard.addEventListener("click", () => {
    setDifficulty("HARD", btnHard, "Extremely similar concepts. Very subtle differences.");
  });
}

/* ============================================================
   SECTION 6: NAMES SCREEN
   ============================================================ */
function generateNameInputs() {
  const container = document.getElementById("names-container");
  container.innerHTML = "";

  for (let i = 1; i <= state.totalPlayers; i++) {
    const input       = document.createElement("input");
    input.type        = "text";
    input.className   = "text-input";
    input.placeholder = `Player ${i} Name`;
    input.id          = `name-input-${i}`;
    container.appendChild(input);
  }
}

function initNamesScreen() {
  document.getElementById("btn-start").addEventListener("click", () => {
    state.players = [];
    for (let i = 1; i <= state.totalPlayers; i++) {
      let val = document.getElementById(`name-input-${i}`).value.trim();
      if (!val) val = `Player ${i}`;
      state.players.push({ name: val, role: "", isAlive: true });
    }

    state.gameHasStarted = true;
    startGame();
  });
}

function startGame() {
  const roles = assignRoles();
  const pair  = pickWordPair();

  state.civilianWord   = pair.civilianWord;
  state.undercoverWord = pair.undercoverWord;

  state.players.forEach((player, index) => {
    player.role    = roles[index];
    player.isAlive = true;
  });

  state.currentPlayer = 0;
  showPlayerTurn();
}

/* ============================================================
   SECTION 7: PLAYER TURN SCREEN
   ============================================================ */
function initPlayerTurnScreen() {
  document.getElementById("btn-reveal").addEventListener("click", revealRole);

  document.getElementById("btn-next").addEventListener("click", () => {
    state.currentPlayer++;
    if (state.currentPlayer >= state.totalPlayers) {
      showOrderScreen();
    } else {
      showPlayerTurn();
    }
  });
}

function showPlayerTurn() {
  const player = state.players[state.currentPlayer];

  document.getElementById("turn-name").textContent        = player.name;
  document.getElementById("turn-progress").textContent    = `${state.currentPlayer + 1} / ${state.totalPlayers}`;
  document.getElementById("reveal-player-name").textContent = player.name;

  document.getElementById("pre-reveal").classList.remove("hidden");
  document.getElementById("role-card").classList.add("hidden");

  showScreen("screen-player-turn");
}

function revealRole() {
  const player = state.players[state.currentPlayer];
  const role   = player.role;

  const badge       = document.getElementById("role-badge");
  badge.className   = "role-badge";

  const wordArea    = document.getElementById("word-area");
  const playerWord  = document.getElementById("player-word");
  const mrwhiteHint = document.getElementById("mrwhite-hint");

  if (role === ROLE_MR_WHITE) {
    badge.textContent = "MR WHITE";
    badge.classList.add("mrwhite");

    wordArea.classList.add("hidden");
    mrwhiteHint.classList.remove("hidden");
  } else {
    badge.textContent = "SECRET WORD";
    badge.classList.add("neutral");

    wordArea.classList.remove("hidden");
    mrwhiteHint.classList.add("hidden");

    playerWord.textContent = (role === ROLE_UNDERCOVER) ? state.undercoverWord : state.civilianWord;
  }

  const isLastPlayer = (state.currentPlayer === state.totalPlayers - 1);
  document.getElementById("btn-next").textContent = isLastPlayer ? "SEE SPEAKING ORDER" : "DONE — PASS PHONE";

  document.getElementById("pre-reveal").classList.add("hidden");
  document.getElementById("role-card").classList.remove("hidden");
}

/* ============================================================
   SECTION 8: DISCUSSION ORDER SCREEN (Grid Style)
   ============================================================ */
function initOrderScreen() {
  document.getElementById("btn-start-discussion").addEventListener("click", () => {
    showDiscussionScreen();
  });
}

function showOrderScreen() {
  const alivePlayers = state.players.filter(p => p.isAlive);
  const aliveCivilians = alivePlayers.filter(p => p.role === ROLE_CIVILIAN);
  const aliveNonCivilians = alivePlayers.filter(p => p.role !== ROLE_CIVILIAN);

  shuffleArray(aliveCivilians);
  const firstCivilian = aliveCivilians[0];
  const restCivilians = aliveCivilians.slice(1);

  const rest = [...restCivilians, ...aliveNonCivilians];
  shuffleArray(rest);

  const speakingOrder = [firstCivilian, ...rest];

  const list = document.getElementById("order-list");
  list.innerHTML = "";

  speakingOrder.forEach((player, idx) => {
    const card = document.createElement("div");
    card.className = "order-card";

    let shortName = player.name.substring(0, 3).toUpperCase();
    if (shortName.length < 3) shortName = player.name.toUpperCase();

    card.innerHTML = `
      <div class="order-number">${idx + 1}</div>
      <div class="order-name-short">${shortName}</div>
      <div class="order-name-full">${player.name}</div>
    `;

    list.appendChild(card);
  });

  showScreen("screen-order");
}

/* ============================================================
   SECTION 9: DISCUSSION SCREEN
   ============================================================ */
function initDiscussionScreen() {
  document.getElementById("btn-go-voting").addEventListener("click", () => {
    showVotingScreen();
  });
}

function showDiscussionScreen() {
  const civs      = state.totalPlayers - state.undercoverCount - 1;
  const summaryEl = document.getElementById("role-summary");

  summaryEl.innerHTML = `
    <div class="summary-chip civilian">${civs} Civilian${civs !== 1 ? "s" : ""}</div>
    <div class="summary-chip undercover">${state.undercoverCount} Undercover${state.undercoverCount !== 1 ? "s" : ""}</div>
    <div class="summary-chip mrwhite">1 Mr. White</div>
  `;

  showScreen("screen-discussion");
}

/* ============================================================
   SECTION 10: VOTING & ELIMINATION
   ============================================================ */
function initVotingScreen() {
  document.getElementById("btn-cancel-voting").addEventListener("click", () => {
    showScreen("screen-discussion");
  });
}

function showVotingScreen() {
  const list = document.getElementById("voting-list");
  list.innerHTML = "";

  state.players.forEach((player, index) => {
    const card = document.createElement("div");
    card.className = `voting-card ${!player.isAlive ? "eliminated" : ""}`;

    const infoDiv = document.createElement("div");
    infoDiv.className = "voting-card-info";
    infoDiv.innerHTML = `
      <span class="voting-name">${player.name}</span>
      <span class="voting-status">${player.isAlive ? "ALIVE" : "ELIMINATED"}</span>
    `;
    card.appendChild(infoDiv);

    if (player.isAlive) {
      const btn       = document.createElement("button");
      btn.className   = "btn-vote";
      btn.textContent = "VOTE OUT";
      btn.addEventListener("click", () => confirmElimination(index));
      card.appendChild(btn);
    }

    list.appendChild(card);
  });

  showScreen("screen-voting");
}

function confirmElimination(index) {
  const player = state.players[index];

  showConfirmModal(
    `Eliminate ${player.name}?`,
    "This action cannot be undone.",
    "VOTE OUT",
    () => {
      player.isAlive = false;

      let resultText  = "";
      let bodyClass   = "";

      if (player.role === ROLE_MR_WHITE) {
        resultText = `${player.name} was Mr White!`;
        bodyClass  = "role-mrwhite";
      } else if (player.role === ROLE_UNDERCOVER) {
        resultText = `${player.name} was an Undercover.`;
        bodyClass  = "role-undercover";
      } else {
        resultText = `${player.name} was a Civilian.`;
        bodyClass  = "role-civilian";
      }

      showInfoModal(
        "Eliminated!",
        resultText,
        bodyClass,
        "CONTINUE",
        () => {
          if (player.role === ROLE_MR_WHITE) {
            showScreen("screen-mrwhite-guess");
            document.getElementById("mrwhite-guess-input").value = "";
          } else {
            evaluateWinConditions();
          }
        }
      );
    }
  );
}

/* ============================================================
   SECTION 11: MR WHITE GUESS
   ============================================================ */
function initMrWhiteGuess() {
  document.getElementById("btn-submit-guess").addEventListener("click", () => {
    const guess  = document.getElementById("mrwhite-guess-input").value.trim().toLowerCase();
    const actual = state.civilianWord.toLowerCase();

    if (guess === actual) {
      showEndScreen("Mr White");
    } else {
      evaluateWinConditions();
    }
  });
}

/* ============================================================
   SECTION 12: WIN CONDITIONS & END SCREEN
   ============================================================ */
function evaluateWinConditions() {
  const aliveCivs = state.players.filter(p => p.role === ROLE_CIVILIAN   && p.isAlive).length;
  const aliveUnds = state.players.filter(p => p.role === ROLE_UNDERCOVER && p.isAlive).length;
  const mwAlive   = state.players.find(p  => p.role === ROLE_MR_WHITE).isAlive;

  if (aliveUnds === 0) {
    showEndScreen(mwAlive ? "Mr White" : "Civilians");
    return;
  }

  if (aliveUnds >= aliveCivs) {
    showEndScreen(mwAlive ? "Mr White" : "Undercover Team");
    return;
  }

  showOrderScreen();
}

function showEndScreen(winnerStr) {
  const title = document.getElementById("winner-title");
  title.textContent = `${winnerStr.toUpperCase()} WINS`;

  title.className = "discussion-title";
  if (winnerStr === "Civilians")       title.classList.add("accent-cyan");
  if (winnerStr === "Undercover Team") title.classList.add("accent-amber");
  if (winnerStr === "Mr White")        title.classList.add("accent-red");

  document.getElementById("end-civ-word").textContent = state.civilianWord;
  document.getElementById("end-und-word").textContent = state.undercoverWord;

  const list = document.getElementById("end-roles-list");
  list.innerHTML = "";

  state.players.forEach(p => {
    const item = document.createElement("div");
    item.className = "end-role-item";

    let colorClass = "";
    if (p.role === ROLE_CIVILIAN)   colorClass = "accent-cyan";
    if (p.role === ROLE_UNDERCOVER) colorClass = "accent-amber";
    if (p.role === ROLE_MR_WHITE)   colorClass = "accent-red";

    item.innerHTML = `<span>${p.name} ${!p.isAlive ? "(DEAD)" : ""}</span> <strong class="${colorClass}">${p.role}</strong>`;
    list.appendChild(item);
  });

  showScreen("screen-end");
}

function initEndScreen() {
  document.getElementById("btn-play-again").addEventListener("click", () => {
    startGame();
  });
}

/* ============================================================
   SECTION 13: INITIALISATION
   ============================================================ */
function init() {
  initWelcomeScreen();
  initNamesScreen();
  initPlayerTurnScreen();
  initOrderScreen();
  initDiscussionScreen();
  initVotingScreen();
  initMrWhiteGuess();
  initEndScreen();

  showScreen("screen-welcome");
}

document.addEventListener("DOMContentLoaded", init);