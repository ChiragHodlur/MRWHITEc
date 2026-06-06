/* ============================================================
   Mr White Unlimited — script.js
   Now includes Hidden Role Mechanics, Custom Player Names, 
   Card-Based Voting/Eliminations, and Win Conditions.
   ============================================================ */

/* ============================================================
   SECTION 1: GAME STATE
   ============================================================ */
const state = {
  wordData:       null,
  totalPlayers:   6,
  undercoverCount:1,
  currentPlayer:  0,      // 0-based index for the players array
  players:        [],     // Array of objects: { name, role, isAlive }
  civilianWord:   "",
  undercoverWord: "",
  gameHasStarted: false   // Prevents asking for names again on "Play Again"
};

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 15;

const ROLE_CIVILIAN   = "CIVILIAN";
const ROLE_UNDERCOVER = "UNDERCOVER";
const ROLE_MR_WHITE   = "MR WHITE";

/* ============================================================
   SECTION 2: EMBEDDED WORD DATABASE
   ============================================================ */
const WORD_DATA = {
  food: [
    ["Pizza", "Flatbread"], ["Burger", "Sandwich"], ["Sushi", "Sashimi"], ["Pasta", "Noodles"], ["Cake", "Muffin"],
    ["Ice Cream", "Gelato"], ["Fries", "Chips"], ["Tacos", "Burritos"], ["Pancakes", "Waffles"], ["Donut", "Bagel"],
    ["Steak", "Chop"], ["Salad", "Coleslaw"], ["Soup", "Stew"], ["Bread", "Biscuit"], ["Cookie", "Brownie"],
    ["Chocolate", "Fudge"], ["Cheese", "Butter"], ["Egg", "Omelette"], ["Popcorn", "Chips"], ["Curry", "Gravy"],
    ["Coffee", "Tea"], ["Juice", "Smoothie"], ["Milk", "Cream"], ["Jam", "Marmalade"], ["Honey", "Syrup"],
    ["Sausage", "Hot Dog"], ["Bacon", "Ham"], ["Shrimp", "Lobster"], ["Salmon", "Tuna"], ["Lemon", "Lime"],
  ],
  animals: [
    ["Lion", "Tiger"], ["Dolphin", "Whale"], ["Eagle", "Hawk"], ["Wolf", "Fox"], ["Elephant", "Rhino"],
    ["Crocodile", "Alligator"], ["Penguin", "Seal"], ["Parrot", "Cockatoo"], ["Rabbit", "Hare"], ["Frog", "Toad"],
    ["Butterfly", "Moth"], ["Shark", "Barracuda"], ["Gorilla", "Chimpanzee"], ["Cheetah", "Leopard"], ["Camel", "Llama"],
    ["Ostrich", "Emu"], ["Peacock", "Pheasant"], ["Turtle", "Tortoise"], ["Panda", "Koala"], ["Snake", "Lizard"],
    ["Horse", "Donkey"], ["Cow", "Buffalo"], ["Pig", "Boar"], ["Sheep", "Goat"], ["Duck", "Goose"],
    ["Crow", "Raven"], ["Crab", "Lobster"], ["Spider", "Scorpion"], ["Deer", "Moose"], ["Flamingo", "Heron"],
  ],
  professions: [
    ["Doctor", "Nurse"], ["Lawyer", "Judge"], ["Teacher", "Professor"], ["Chef", "Baker"], ["Pilot", "Co-Pilot"],
    ["Firefighter", "Paramedic"], ["Police Officer", "Detective"], ["Engineer", "Architect"], ["Dentist", "Orthodontist"],
    ["Journalist", "Reporter"], ["Photographer", "Videographer"], ["Musician", "Composer"], ["Actor", "Director"],
    ["Painter", "Sculptor"], ["Plumber", "Electrician"], ["Carpenter", "Mason"], ["Tailor", "Seamstress"],
    ["Gardener", "Florist"], ["Accountant", "Auditor"], ["Programmer", "Developer"], ["Surgeon", "Radiologist"],
    ["Pharmacist", "Chemist"], ["Librarian", "Archivist"], ["Astronaut", "Cosmonaut"], ["Sailor", "Captain"],
    ["Soldier", "Marine"], ["Scientist", "Researcher"], ["Economist", "Banker"], ["Coach", "Trainer"], ["Barber", "Hairstylist"],
  ],
  technology: [
    ["Smartphone", "Tablet"], ["Laptop", "Desktop"], ["Keyboard", "Mouse"], ["Headphones", "Earbuds"], ["Camera", "Webcam"],
    ["Printer", "Scanner"], ["Router", "Modem"], ["Battery", "Charger"], ["USB Drive", "SD Card"], ["Monitor", "Projector"],
    ["Speaker", "Subwoofer"], ["Microphone", "Headset"], ["Drone", "Remote Control Car"], ["Smartwatch", "Fitness Tracker"],
    ["VR Headset", "AR Glasses"], ["Game Console", "Gaming PC"], ["Hard Drive", "SSD"], ["CPU", "GPU"], ["Touchscreen", "Stylus"],
    ["Bluetooth", "WiFi"], ["App", "Software"], ["Password", "PIN"], ["Email", "Text Message"], ["Browser", "Search Engine"],
    ["Cloud", "Server"], ["Algorithm", "Code"], ["Database", "Spreadsheet"], ["Robot", "Drone"], ["Solar Panel", "Wind Turbine"],
    ["GPS", "Compass"],
  ],
  places: [
    ["Beach", "Lake"], ["Mountain", "Hill"], ["Forest", "Jungle"], ["Desert", "Savanna"], ["Island", "Peninsula"],
    ["City", "Town"], ["Village", "Hamlet"], ["Castle", "Palace"], ["Museum", "Gallery"], ["Stadium", "Arena"],
    ["Hospital", "Clinic"], ["School", "College"], ["Church", "Temple"], ["Airport", "Train Station"], ["Market", "Mall"],
    ["Restaurant", "Cafe"], ["Hotel", "Motel"], ["Park", "Garden"], ["Library", "Bookstore"], ["Bank", "Post Office"],
    ["Cinema", "Theatre"], ["Gym", "Spa"], ["Harbour", "Dock"], ["Farm", "Ranch"], ["Prison", "Detention Centre"],
    ["Factory", "Warehouse"], ["Mine", "Quarry"], ["Lighthouse", "Watchtower"], ["Cemetery", "Memorial"], ["Playground", "Courtyard"],
  ],
  sports: [
    ["Football", "Rugby"], ["Basketball", "Netball"], ["Tennis", "Badminton"], ["Swimming", "Diving"], ["Cricket", "Baseball"],
    ["Golf", "Disc Golf"], ["Boxing", "Wrestling"], ["Cycling", "Skateboarding"], ["Skiing", "Snowboarding"], ["Archery", "Javelin"],
    ["Gymnastics", "Acrobatics"], ["Volleyball", "Beach Volleyball"], ["Table Tennis", "Squash"], ["Rowing", "Kayaking"],
    ["Horse Riding", "Polo"], ["Surfing", "Wakeboarding"], ["Marathon", "Sprint"], ["High Jump", "Long Jump"], ["Fencing", "Karate"],
    ["Weightlifting", "Powerlifting"], ["Triathlon", "Pentathlon"], ["Ice Hockey", "Field Hockey"], ["Darts", "Billiards"],
    ["Rock Climbing", "Bouldering"], ["Paragliding", "Hang Gliding"], ["Chess", "Checkers"], ["Bowling", "Curling"],
    ["Lacrosse", "Hurling"], ["Sumo", "Judo"], ["Paintball", "Airsoft"],
  ],
  movies_tv: [
    ["Action Movie", "Thriller"], ["Comedy", "Sitcom"], ["Horror Film", "Slasher Film"], ["Documentary", "Docuseries"],
    ["Cartoon", "Anime"], ["Superhero Film", "Sci-Fi Film"], ["Romance", "Drama"], ["Musical", "Opera"], ["Western", "Samurai Film"],
    ["Spy Film", "Heist Film"], ["War Film", "Historical Drama"], ["Sequel", "Remake"], ["Trailer", "Teaser"], ["Director", "Producer"],
    ["Box Office", "Streaming"], ["Oscar", "Golden Globe"], ["Script", "Screenplay"], ["Subtitles", "Dubbing"],
    ["Premiere", "Screening"], ["Cliffhanger", "Plot Twist"],
  ],
  household: [
    ["Sofa", "Armchair"], ["Bed", "Mattress"], ["Pillow", "Cushion"], ["Blanket", "Duvet"], ["Curtain", "Blind"],
    ["Lamp", "Chandelier"], ["Mirror", "Window"], ["Clock", "Watch"], ["Fridge", "Freezer"], ["Oven", "Microwave"],
    ["Blender", "Food Processor"], ["Kettle", "Coffee Maker"], ["Toaster", "Grill"], ["Washing Machine", "Dryer"],
    ["Vacuum Cleaner", "Mop"], ["Broom", "Dustpan"], ["Soap", "Shampoo"], ["Toothbrush", "Razor"], ["Towel", "Bathrobe"],
    ["Candle", "Incense"], ["Bucket", "Basin"], ["Shelf", "Cabinet"], ["Drawer", "Wardrobe"], ["Table", "Desk"],
    ["Chair", "Stool"], ["Doormat", "Rug"], ["Fan", "Air Conditioner"], ["Heater", "Radiator"], ["Ladder", "Stepstool"],
    ["Toolbox", "Drill"],
  ],
  nature: [
    ["Rain", "Drizzle"], ["Thunder", "Lightning"], ["Snow", "Hail"], ["Tornado", "Hurricane"], ["Volcano", "Geyser"],
    ["River", "Stream"], ["Waterfall", "Rapids"], ["Cave", "Tunnel"], ["Cliff", "Ravine"], ["Glacier", "Iceberg"],
    ["Oak Tree", "Maple Tree"], ["Rose", "Tulip"], ["Cactus", "Succulent"], ["Mushroom", "Moss"], ["Coral", "Seaweed"],
    ["Sunrise", "Sunset"], ["Full Moon", "Eclipse"], ["Earthquake", "Landslide"], ["Tide", "Wave"], ["Fog", "Mist"],
  ],
  clothes: [
    ["T-Shirt", "Polo Shirt"], ["Jeans", "Chinos"], ["Jacket", "Coat"], ["Sneakers", "Loafers"], ["Boots", "Sandals"],
    ["Dress", "Skirt"], ["Suit", "Blazer"], ["Hoodie", "Sweatshirt"], ["Hat", "Cap"], ["Scarf", "Shawl"],
    ["Gloves", "Mittens"], ["Belt", "Suspenders"], ["Socks", "Stockings"], ["Swimsuit", "Bikini"], ["Pyjamas", "Nightgown"],
    ["Uniform", "Costume"], ["Tie", "Bow Tie"], ["Vest", "Tank Top"], ["Shorts", "Bermudas"], ["Raincoat", "Poncho"],
  ],
  vehicles: [
    ["Car", "SUV"], ["Motorcycle", "Scooter"], ["Bus", "Tram"], ["Truck", "Van"], ["Train", "Subway"],
    ["Airplane", "Helicopter"], ["Boat", "Ferry"], ["Submarine", "Yacht"], ["Bicycle", "Tricycle"], ["Rocket", "Space Shuttle"],
    ["Ambulance", "Fire Truck"], ["Taxi", "Rickshaw"], ["Tractor", "Forklift"], ["Hovercraft", "Jet Ski"], ["Cable Car", "Monorail"],
    ["Hot Air Balloon", "Glider"], ["Skateboard", "Scooter"], ["Carriage", "Chariot"], ["Tank", "Armoured Vehicle"], ["Snowmobile", "ATV"],
  ],
};

/* ============================================================
   SECTION 3: ROLE & WORD ASSIGNMENT
   ============================================================ */

/**
 * Ensures Undercover count doesn't violate game balance.
 * Rule: Mr White (1) + Undercover Count < Total Players
 * Therefore, Max Undercovers = Total Players - 2
 */
function updateMaxUndercovers() {
  const maxU = state.totalPlayers - 2;
  const uDisplay = document.getElementById("undercover-count-display");
  const hintDisplay = document.getElementById("undercover-hint");
  
  let showedValidation = false;

  // Auto-correct if current undercover count exceeds the new maximum
  if (state.undercoverCount > maxU) {
    state.undercoverCount = maxU;
    uDisplay.textContent = state.undercoverCount;
    
    // Show a temporal warning that we auto-reduced it
    hintDisplay.textContent = "Reduced to keep at least 1 Civilian!";
    hintDisplay.style.color = "var(--accent-red)";
    showedValidation = true;

    setTimeout(() => {
      hintDisplay.style.color = "";
      hintDisplay.textContent = `0 to ${maxU} undercovers allowed`;
    }, 2000);
  }

  // Set default hint text if no warning is overriding it
  if (!showedValidation) {
    hintDisplay.textContent = `0 to ${maxU} undercovers allowed`;
  }
}

/**
 * Creates randomized roles based on settings
 */
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

function pickWordPair(wordData) {
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
   SECTION 4: WELCOME SCREEN
   ============================================================ */
function initWelcomeScreen() {
  const countDisplay = document.getElementById("player-count-display");
  const btnMinus = document.getElementById("btn-minus");
  const btnPlus  = document.getElementById("btn-plus");
  
  const uDisplay = document.getElementById("undercover-count-display");
  const btnUMinus = document.getElementById("btn-u-minus");
  const btnUPlus = document.getElementById("btn-u-plus");

  // Initial text setup
  updateMaxUndercovers();

  // Player count controls
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

  // Undercover count controls
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
      // User hit the limit – show validation warning
      const hintDisplay = document.getElementById("undercover-hint");
      hintDisplay.textContent = "Cannot exceed! Need at least 1 Civilian.";
      hintDisplay.style.color = "var(--accent-red)";
      
      setTimeout(() => {
        hintDisplay.style.color = "";
        hintDisplay.textContent = `0 to ${maxU} undercovers allowed`;
      }, 2000);
    }
  });

  // Move to names screen
  document.getElementById("btn-welcome-next").addEventListener("click", () => {
    generateNameInputs();
    showScreen("screen-names");
  });
}

/* ============================================================
   SECTION 5: NAMES SCREEN
   ============================================================ */
function generateNameInputs() {
  const container = document.getElementById("names-container");
  container.innerHTML = ""; // clear previous
  
  for (let i = 1; i <= state.totalPlayers; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "text-input";
    input.placeholder = `Player ${i} Name`;
    input.id = `name-input-${i}`;
    container.appendChild(input);
  }
}

function initNamesScreen() {
  document.getElementById("btn-start").addEventListener("click", () => {
    // Read names into state
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
  // Generate random roles & words
  const roles = assignRoles();
  const pair = pickWordPair(state.wordData);
  
  state.civilianWord   = pair.civilianWord;
  state.undercoverWord = pair.undercoverWord;

  // Assign roles to players
  state.players.forEach((player, index) => {
    player.role = roles[index];
    player.isAlive = true;
  });

  state.currentPlayer = 0; // Starts at index 0
  showPlayerTurn();
}

/* ============================================================
   SECTION 6: PLAYER TURN SCREEN (Hidden roles)
   ============================================================ */
function initPlayerTurnScreen() {
  const btnReveal = document.getElementById("btn-reveal");
  const btnNext   = document.getElementById("btn-next");

  btnReveal.addEventListener("click", () => {
    revealRole();
  });

  btnNext.addEventListener("click", () => {
    state.currentPlayer++;
    if (state.currentPlayer >= state.totalPlayers) {
      showDiscussionScreen();
    } else {
      showPlayerTurn();
    }
  });
}

function showPlayerTurn() {
  const player = state.players[state.currentPlayer];
  
  // UI updates with exact player name
  document.getElementById("turn-name").textContent = player.name;
  document.getElementById("turn-progress").textContent = `${state.currentPlayer + 1} / ${state.totalPlayers}`;
  document.getElementById("reveal-player-name").textContent = player.name;

  document.getElementById("pre-reveal").classList.remove("hidden");
  document.getElementById("role-card").classList.add("hidden");

  showScreen("screen-player-turn");
}

function revealRole() {
  const player = state.players[state.currentPlayer];
  const role = player.role;

  const badge = document.getElementById("role-badge");
  badge.className = "role-badge"; // Reset classes

  const wordArea    = document.getElementById("word-area");
  const playerWord  = document.getElementById("player-word");
  const mrwhiteHint = document.getElementById("mrwhite-hint");

  // Hide teams. Civilians and Undercover both see "SECRET WORD"
  if (role === ROLE_MR_WHITE) {
    badge.textContent = "MR WHITE";
    badge.classList.add("mrwhite");

    wordArea.classList.add("hidden");
    mrwhiteHint.classList.remove("hidden");
  } else {
    badge.textContent = "SECRET WORD";
    badge.classList.add("neutral"); // Grey, neutral styling

    wordArea.classList.remove("hidden");
    mrwhiteHint.classList.add("hidden");
    
    // Give them their correct word, but they don't know if they are Civ or Und
    playerWord.textContent = (role === ROLE_UNDERCOVER) ? state.undercoverWord : state.civilianWord;
  }

  const isLastPlayer = (state.currentPlayer === state.totalPlayers - 1);
  document.getElementById("btn-next").textContent = isLastPlayer ? "START DISCUSSION" : "DONE — PASS PHONE";

  document.getElementById("pre-reveal").classList.add("hidden");
  document.getElementById("role-card").classList.remove("hidden");
}

/* ============================================================
   SECTION 7: DISCUSSION SCREEN
   ============================================================ */
function initDiscussionScreen() {
  document.getElementById("btn-go-voting").addEventListener("click", () => {
    showVotingScreen();
  });
}

function showDiscussionScreen() {
  // Count starting configuration to remind players
  const civs = state.totalPlayers - state.undercoverCount - 1;
  const summaryEl = document.getElementById("role-summary");
  summaryEl.innerHTML = `
    <div class="summary-chip civilian">${civs} Civilian${civs !== 1 ? "s" : ""}</div>
    <div class="summary-chip undercover">${state.undercoverCount} Undercover${state.undercoverCount !== 1 ? "s" : ""}</div>
    <div class="summary-chip mrwhite">1 Mr. White</div>
  `;
  showScreen("screen-discussion");
}

/* ============================================================
   SECTION 8: VOTING & ELIMINATION
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
    // Generate the Card Layout wrapper
    const card = document.createElement("div");
    card.className = `voting-card ${!player.isAlive ? "eliminated" : ""}`;

    // Generate info container (Name + Status)
    const infoDiv = document.createElement("div");
    infoDiv.className = "voting-card-info";
    infoDiv.innerHTML = `
      <span class="voting-name">${player.name}</span>
      <span class="voting-status">${player.isAlive ? 'ALIVE' : 'ELIMINATED'}</span>
    `;
    card.appendChild(infoDiv);

    // If alive, add the VOTE OUT styled button inside the card
    if (player.isAlive) {
      const btn = document.createElement("button");
      btn.className = "btn-vote";
      btn.textContent = "VOTE OUT";
      
      // Bind event safely
      btn.addEventListener("click", () => confirmElimination(index));
      
      card.appendChild(btn);
    }

    list.appendChild(card);
  });

  showScreen("screen-voting");
}

function confirmElimination(index) {
  const player = state.players[index];
  
  // 1. Confirm elimination
  if (confirm(`Are you sure you want to eliminate ${player.name}?`)) {
    player.isAlive = false;
    
    // 2. Immediately reveal role via alert
    alert(`${player.name} was ${player.role === ROLE_MR_WHITE ? '' : 'a '}${player.role}.`);

    if (player.role === ROLE_MR_WHITE) {
      // Mr White eliminated -> special chance
      showScreen("screen-mrwhite-guess");
      document.getElementById("mrwhite-guess-input").value = "";
    } else {
      // Evaluate standard wins
      evaluateWinConditions();
    }
  }
}

/* ============================================================
   SECTION 9: MR WHITE GUESS
   ============================================================ */
function initMrWhiteGuess() {
  document.getElementById("btn-submit-guess").addEventListener("click", () => {
    const guess = document.getElementById("mrwhite-guess-input").value.trim().toLowerCase();
    const actual = state.civilianWord.toLowerCase();
    
    if (guess === actual) {
      // Instant steal
      showEndScreen("Mr White");
    } else {
      // Mr White fails -> evaluate standard win conditions
      evaluateWinConditions();
    }
  });
}

/* ============================================================
   SECTION 10: WIN CONDITIONS & END SCREEN
   ============================================================ */
function evaluateWinConditions() {
  const aliveCivs = state.players.filter(p => p.role === ROLE_CIVILIAN && p.isAlive).length;
  const aliveUnds = state.players.filter(p => p.role === ROLE_UNDERCOVER && p.isAlive).length;
  const mwAlive   = state.players.find(p => p.role === ROLE_MR_WHITE).isAlive;

  // 1. Undercovers wiped out
  if (aliveUnds === 0) {
    if (mwAlive) {
      showEndScreen("Mr White");
    } else {
      showEndScreen("Civilians");
    }
    return;
  }

  // 2. Undercovers equal or outnumber Civilians
  if (aliveUnds >= aliveCivs) {
    if (mwAlive) {
      showEndScreen("Mr White");
    } else {
      showEndScreen("Undercover Team");
    }
    return;
  }

  // Game continues
  showVotingScreen(); 
}

function showEndScreen(winnerStr) {
  const title = document.getElementById("winner-title");
  title.textContent = `${winnerStr.toUpperCase()} WINS`;

  // Apply colour based on winner
  title.className = "discussion-title";
  if (winnerStr === "Civilians") title.classList.add("accent-cyan");
  if (winnerStr === "Undercover Team") title.classList.add("accent-amber");
  if (winnerStr === "Mr White") title.classList.add("accent-red");

  document.getElementById("end-civ-word").textContent = state.civilianWord;
  document.getElementById("end-und-word").textContent = state.undercoverWord;

  // Populate roles breakdown
  const list = document.getElementById("end-roles-list");
  list.innerHTML = "";
  
  state.players.forEach(p => {
    const item = document.createElement("div");
    item.className = "end-role-item";
    
    let colorClass = "";
    if (p.role === ROLE_CIVILIAN) colorClass = "accent-cyan";
    if (p.role === ROLE_UNDERCOVER) colorClass = "accent-amber";
    if (p.role === ROLE_MR_WHITE) colorClass = "accent-red";

    item.innerHTML = `<span>${p.name} ${!p.isAlive ? '(DEAD)' : ''}</span> <strong class="${colorClass}">${p.role}</strong>`;
    list.appendChild(item);
  });

  showScreen("screen-end");
}

function initEndScreen() {
  document.getElementById("btn-play-again").addEventListener("click", () => {
    // Keeps player names, count, undercover count
    startGame(); 
  });
}

/* ============================================================
   SECTION 11: INITIALISATION
   ============================================================ */
function init() {
  state.wordData = WORD_DATA;

  initWelcomeScreen();
  initNamesScreen();
  initPlayerTurnScreen();
  initDiscussionScreen();
  initVotingScreen();
  initMrWhiteGuess();
  initEndScreen();

  showScreen("screen-welcome");
}

document.addEventListener("DOMContentLoaded", init);