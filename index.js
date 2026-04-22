import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

// * Game elements/assets constants
const HAT = "^";
const HOLE = "O";
const GRASS = "░";
const PLAYER = "*";

// * UP / DOWN / LEFT / RIGHT / QUIT (DEFAULT) keyboard constants
const UP = "W";
const DOWN = "S";
const LEFT = "A";
const RIGHT = "D";
const QUIT = "Q";

// * MSG_UP / MSG_DOWN / MSG_LEFT / MSG_RIGHT / MSG_ QUIT / MSG_INVALID message constants
const FEEDBACK_UP = "You moved up.";
const FEEDBACK_DOWN = "You moved down.";
const FEEDBACK_LEFT = "You moved left.";
const FEEDBACK_RIGHT = "You moved right.";
const FEEDBACK_QUIT = "You have quit the game";
const FEEDBACK_INVALID = "Invalid entry";

// * WIN / LOSE / OUT / QUIT messages constants
const FEEDBACK_WIN_MSG = "Congratulations, you won!";
const FEEDBACK_LOSE_MSG = "You fell into a hole. Game over.";
const FEEDBACK_OUT_MSG = "You stepped out of the platform. Game over.";
const FEEDBACK_QUIT_MSG = "You quit the game. Thank you for playing.";

// * MAP ROWS, COLUMNS AND PERCENTAGE
const ROWS = 10;
const COLS = 10;
const PERCENT = .2; // percentage on the number of holes in the game map

class Field {
  // DONE for position tracking 
  startRow = 0;
  startCol = 0;

  // * constructor, a built-in method of a class (invoked when an object of a class is instantiated)
  constructor(field = [[]]) {
    this.field = field;
    this.gamePlay = false;
  }

  // * generateField is a static method, returning a 2D array of the fields
  static generateField(rows, cols, percentage) {
    const map = [[]];
    for (let i = 0; i < rows; i++) {
      map[i] = [];  // generate the row for the map
      for (let j = 0; j < cols; j++) {
        map[i][j] = Math.random() > PERCENT ? GRASS : HOLE;             // ~80% Grass 20% Hole | map with random areas of grass and random areas of holes
      }
    }
    return map; //return the generated 2D array
  }

  // * welcomeMessage is a static method, displays a string
  static welcomeMsg(msg) {
    console.log(msg);
  }

  // * setHat positions the hat along a random x and y position within field array
  setHat() {
    const x = Math.floor(Math.random() * (ROWS - 1)) + 1;              // establish a random position of X in the field
    const y = Math.floor(Math.random() * (COLS - 1)) + 1;              // establish a random position of Y in the field 
    this.field[x][y] = HAT;                                            // set the HAT along the derived random position [x][y]
  }

  // * printField displays the updated status of the field position
  printField() {
    // present it as one full tiled map
    this.field.forEach(row => console.log(row.join('')));
  }

  // * updateMove displays the move (key) entered by the user
  updateMove(direction) {
    console.log(direction);
  }

  // !! TODO: updateGame Assessment Challenge
  updateGame(positionRow, positionCol) {
    // update PLAYER movement 
    const playerRow = this.startRow + positionRow;
    const playerCol = this.startCol + positionCol;

    // Check the following conditions:
    // TODO 1. whether the player moved out of the map, end the game
    if (playerRow < 0 || playerRow >= ROWS || playerCol < 0 || playerCol >= COLS) {
      console.log(FEEDBACK_OUT_MSG);
      this.#end();
    }

    // TODO 2. whether the player fell into a HOLE, end the game
    else if (this.field[playerRow][playerCol] === HOLE) {
      console.log(FEEDBACK_LOSE_MSG);
      this.#end();
    }

    // TODO 3. whether the player moved to the hat, wins the game, end the game
    else if (this.field[playerRow][playerCol] === HAT) {
      console.log(FEEDBACK_WIN_MSG);
      this.#end();
    }

    // TODO 4. whether the player moved to a grass spot, update the player's position and continue with the game
    else {
      // when player move to grass sport previous spot become grass
      this.field[this.startRow][this.startCol] = GRASS;
      // update the player's position
      this.field[playerRow][playerCol] = PLAYER;
      this.startRow = playerRow;
      this.startCol = playerCol;
    }
  }

  // * start() a public method of the class to start the game
  start() {
    this.gamePlay = true;
    // include position tracking
    this.startRow = 0;
    this.startCol = 0;

    // set the player's position to the start of the map
    this.field[0][0] = PLAYER;  // set the player position
    this.setHat();              // set the hat position (randomly)

    while (this.gamePlay) {        // while gamePlay is true, ask the user for an input (W), (A), (S), (D) or (Q)

      this.printField();
      const input = prompt("Enter (w)up, (s)down, (a)left, (d)right. Press (q) to quit: ");
      let flagInvalid = false; //use a flag to determine 
      let feedback = "";
      // include movement to set according to the direction chosen
      let positionRow = 0;
      let positionCol = 0;

      switch (input.toUpperCase()) {
        case UP:
          feedback = FEEDBACK_UP;
          // when i move up, row minus 1, col no change
          positionRow = -1;
          positionCol = 0;
          break;
        case DOWN:
          feedback = FEEDBACK_DOWN;
          // when i move down, row plus 1, col no change
          positionRow = +1;
          positionCol = 0;
          break;
        case LEFT:
          feedback = FEEDBACK_LEFT;
          // when i move left, row no change, col minus 1
          positionRow = 0;
          positionCol = -1;
          break;
        case RIGHT:
          feedback = FEEDBACK_RIGHT;
          // when i move right, row no change, col add 1
          positionRow = 0;
          positionCol = +1;
          break;
        case QUIT:
          feedback = FEEDBACK_QUIT;
          this.#end();
          break;
        default:
          feedback = FEEDBACK_INVALID;
          flagInvalid = true;
          break;
      }

      this.updateMove(feedback);

      if (!flagInvalid) { //flagInvalid is a boolean (if flagInvalid is not false (ie. true))
        // update the game play
        // add position tracking
        this.updateGame(positionRow, positionCol);

      }
    }
  }

  // * end() a private method to end the game
  #end() {
    this.gamePlay = false;
  }


}

// * Generate a new field - using Field's static method: generateField
const createField = Field.generateField(ROWS, COLS, PERCENT);

// * Generate a welcome message
Field.welcomeMsg("\n************WELCOME TO FIND YOUR HAT************\n");

// * Create a new instance of the game
// * passing createField as a parameter to the new instance of Field
const gameField = new Field(createField);      // create a new instance of field with an empty 2D array

// * Invoke method start(...) from the instance of game object
gameField.start();

//  ! method #end() cannot be accessed by the instance of Field - it is a private method
// gameField.#end(); // ❌
