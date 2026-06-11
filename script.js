/* ============================================================
   Mr White Unlimited — script.js
   Includes: Simple Indian Word Database, Grid Discussion Order Screen,
   Custom In-Game Modals, and all core game functionality.
   ============================================================ */

/* ============================================================
   SECTION 1: GAME STATE
   ============================================================ */
const state = {
  wordData:        null,
  totalPlayers:    6,
  undercoverCount: 1,
  currentPlayer:   0,      // 0-based index for the players array
  players:         [],     // Array of objects: { name, role, isAlive }
  civilianWord:    "",
  undercoverWord:  "",
  gameHasStarted:  false   // Prevents asking for names again on "Play Again"
};

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 15;

const ROLE_CIVILIAN   = "CIVILIAN";
const ROLE_UNDERCOVER = "UNDERCOVER";
const ROLE_MR_WHITE   = "MR WHITE";

/* ============================================================
   SECTION 2: SIMPLE WORD DATABASE (Indian-friendly)
   Each pair: [Civilian Word, Undercover Word]
   ============================================================ */
const WORD_DATA = {

  food_and_drink: [
    ["Tea", "Coffee"], 
    ["Rice", "Roti"], 
    ["Apple", "Mango"], 
    ["Salt", "Sugar"], 
    ["Milk", "Water"], 
    ["Biscuit", "Cake"], 
    ["Butter", "Cheese"], 
    ["Pizza", "Burger"], 
    ["Ice Cream", "Chocolate"], 
    ["Potato", "Tomato"], 
    ["Onion", "Garlic"], 
    ["Chicken", "Fish"], 
    ["Juice", "Cold Drink"], 
    ["Samosa", "Pakora"], 
    ["Puri", "Paratha"], 
    ["Dal", "Soup"], 
    ["Banana", "Orange"], 
    ["Curd", "Milk"], 
    ["Lemon", "Orange"], 
    ["Watermelon", "Mango"],
    ["Egg", "Chicken"]
  ],

  animals: [
    ["Dog", "Cat"], 
    ["Cow", "Buffalo"], 
    ["Lion", "Tiger"], 
    ["Rat", "Mouse"], 
    ["Crow", "Pigeon"], 
    ["Snake", "Lizard"], 
    ["Monkey", "Gorilla"], 
    ["Horse", "Donkey"], 
    ["Elephant", "Camel"], 
    ["Fish", "Frog"], 
    ["Peacock", "Parrot"], 
    ["Ant", "Mosquito"], 
    ["Spider", "Cockroach"], 
    ["Goat", "Sheep"], 
    ["Duck", "Hen"]
  ],

  everyday_objects: [
    ["Pen", "Pencil"], 
    ["Book", "Notebook"], 
    ["Phone", "TV"], 
    ["Cup", "Glass"], 
    ["Plate", "Bowl"], 
    ["Spoon", "Fork"], 
    ["Lock", "Key"], 
    ["Shoes", "Slippers"], 
    ["Soap", "Shampoo"], 
    ["Towel", "Cloth"], 
    ["Chair", "Table"], 
    ["Door", "Window"], 
    ["Fan", "AC"], 
    ["Watch", "Clock"], 
    ["Bag", "Box"], 
    ["Bed", "Sofa"], 
    ["Comb", "Brush"], 
    ["Mirror", "Glass"], 
    ["Bottle", "Jug"], 
    ["Broom", "Mop"],
    ["Spectacles", "Sunglasses"],
    ["Wallet", "Purse"]
  ],

  places: [
    ["School", "College"], 
    ["Hospital", "Clinic"], 
    ["Shop", "Market"], 
    ["House", "Flat"], 
    ["Village", "City"], 
    ["Office", "Bank"], 
    ["Park", "Garden"], 
    ["Station", "Bus Stand"], 
    ["Cinema", "TV"], 
    ["Hotel", "Restaurant"], 
    ["Temple", "Church"], 
    ["Road", "Street"], 
    ["Kitchen", "Bathroom"], 
    ["Room", "Hall"]
  ],

  nature_and_time: [
    ["Sun", "Moon"], 
    ["Day", "Night"], 
    ["Rain", "Cloud"], 
    ["Tree", "Plant"], 
    ["Fire", "Water"], 
    ["Star", "Moon"], 
    ["River", "Sea"], 
    ["Mountain", "Hill"], 
    ["Sky", "Earth"], 
    ["Wind", "Rain"], 
    ["Flower", "Leaf"], 
    ["Morning", "Evening"], 
    ["Summer", "Winter"], 
    ["Mud", "Dust"], 
    ["Stone", "Sand"],
    ["Ice", "Water"]
  ],

  people_and_body: [
    ["Mother", "Father"],
    ["Brother", "Sister"],
    ["Uncle", "Aunty"],
    ["Boy", "Girl"],
    ["Teacher", "Student"],
    ["Doctor", "Nurse"],
    ["Friend", "Brother"],
    ["Police", "Thief"],
    ["Hand", "Leg"],
    ["Eye", "Ear"],
    ["Nose", "Mouth"],
    ["Hair", "Head"],
    ["Tooth", "Tongue"],
    ["Finger", "Thumb"]
  ],

  vehicles: [
    ["Car", "Bus"], 
    ["Bike", "Scooter"], 
    ["Cycle", "Bike"], 
    ["Train", "Bus"], 
    ["Auto", "Rickshaw"], 
    ["Airplane", "Helicopter"], 
    ["Boat", "Ship"], 
    ["Truck", "Tractor"], 
    ["Road", "Track"], 
    ["Driver", "Pilot"]
  ]
};

/* ============================================================
   SECTION 3: ROLE & WORD ASSIGNMENT
   ============================================================ */

/**
 * Ensures Undercover count doesn't violate game balance.
 */
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

/**
 * Creates randomized roles based on settings.
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

/* ============================================================
   SECTION 4: UTILITY HELPERS
   ============================================================ */
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
   SECTION 5: CUSTOM MODAL SYSTEM
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
   SECTION 6: WELCOME SCREEN
   ============================================================ */
function initWelcomeScreen() {
  const countDisplay = document.getElementById("player-count-display");
  const btnMinus     = document.getElementById("btn-minus");
  const btnPlus      = document.getElementById("btn-plus");

  const uDisplay  = document.getElementById("undercover-count-display");
  const btnUMinus = document.getElementById("btn-u-minus");
  const btnUPlus  = document.getElementById("btn-u-plus");

  updateMaxUndercovers();

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

/* ============================================================
   SECTION 7: NAMES SCREEN
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
  const pair  = pickWordPair(state.wordData);

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
   SECTION 8: PLAYER TURN SCREEN
   ============================================================ */
function initPlayerTurnScreen() {
  document.getElementById("btn-reveal").addEventListener("click", revealRole);

  document.getElementById("btn-next").addEventListener("click", () => {
    state.currentPlayer++;
    if (state.currentPlayer >= state.totalPlayers) {
      // All players have seen their role — show speaking order grid
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
   SECTION 9: DISCUSSION ORDER SCREEN (Grid Style)
   ============================================================ */
function initOrderScreen() {
  document.getElementById("btn-start-discussion").addEventListener("click", () => {
    showDiscussionScreen();
  });
}

function showOrderScreen() {
  // 1. Filter only ALIVE players
  const alivePlayers = state.players.filter(p => p.isAlive);

  // 2. Separate ALIVE civilians from others
  const aliveCivilians = alivePlayers.filter(p => p.role === ROLE_CIVILIAN);
  const aliveNonCivilians = alivePlayers.filter(p => p.role !== ROLE_CIVILIAN);

  // 3. Pick one civilian at random to go first
  shuffleArray(aliveCivilians);
  const firstCivilian = aliveCivilians[0];
  
  const restCivilians = aliveCivilians.slice(1);

  // 4. Build the ordered list: [random civilian first] + [rest shuffled]
  const rest = [...restCivilians, ...aliveNonCivilians];
  shuffleArray(rest);

  const speakingOrder = [firstCivilian, ...rest];

  // 5. Render Grid Cards
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  speakingOrder.forEach((player, idx) => {
    const card = document.createElement("div");
    card.className = "order-card";

    // Create the 3-letter big short name like the photo
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
   SECTION 10: DISCUSSION SCREEN
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
   SECTION 11: VOTING & ELIMINATION
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
      // Mark as dead
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

      // Show result
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
            // Check wins. If game continues, generate NEW ORDER.
            evaluateWinConditions();
          }
        }
      );
    }
  );
}

/* ============================================================
   SECTION 12: MR WHITE GUESS
   ============================================================ */
function initMrWhiteGuess() {
  document.getElementById("btn-submit-guess").addEventListener("click", () => {
    const guess  = document.getElementById("mrwhite-guess-input").value.trim().toLowerCase();
    const actual = state.civilianWord.toLowerCase();

    if (guess === actual) {
      showEndScreen("Mr White");
    } else {
      // Check wins. If game continues, generate NEW ORDER.
      evaluateWinConditions();
    }
  });
}

/* ============================================================
   SECTION 13: WIN CONDITIONS & END SCREEN
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

  // The Game Continues -> Generate a NEW speaking order!
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
   SECTION 14: INITIALISATION
   ============================================================ */
function init() {
  state.wordData = WORD_DATA;

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