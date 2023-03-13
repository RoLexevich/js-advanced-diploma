import GamePlay from "./GamePlay";
import AIController from "./AIController";
import themes from "./themes";
import cursors from "./cursors";
import Team from "./Team";
import {
	getCharacterTooltip,
	getCharacterByPosition,
	redrawCharactersPositions,
	getDamage,
	capitalizeFirstLetter,
} from "./utils";
import { Bowman, Swordsman, Undead, Daemon, Magician, Vampire } from "./characters";
import { generateTeam } from "./generators";
import GameState from "./GameState";
import GameStateService from "./GameStateService";

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay;
		this.stateService = stateService;
	}

	createAI(aiTeam) {
		const aiTypes = [Vampire, Vampire, Vampire];
		// const aiTypes = [Undead, Vampire, Daemon];
		this.aiTeam = aiTeam || generateTeam(aiTypes, 1, 2);

		this.aiController = new AIController(this.playerTeam, this.aiTeam, this.gamePlay);
	}

	init(playerTeam, aiTeam, theme = "prairie") {
		const container = document.getElementById("game-container");
		const { boardSize } = this.gamePlay;
		const playerTypes = [Bowman, Swordsman, Magician];

		this.playerTeam = playerTeam || generateTeam(playerTypes, 3, 2);
		this.createAI(aiTeam);

		const playerPositions = playerTeam
			? playerTeam.getTeamPositions()
			: this.playerTeam.generateTeamPositions(true, boardSize);
		const aiPositions = aiTeam ? aiTeam.getTeamPositions() : this.aiTeam.generateTeamPositions(false, boardSize);

		this.gamePlay.bindToDOM(container);
		this.setTheme(theme);
		this.gameStateService = new GameStateService(localStorage);
		redrawCharactersPositions(playerPositions, aiPositions, this.gamePlay);
		window.ctr = this;
		this.initGameListeners();
	}

	setTheme(theme) {
		this.gamePlay.drawUi(themes[theme]);
		this.currentTheme = theme;
	}

	getNextTheme() {
		const { currentTheme } = this;
		let showTheme = false;
		let curTheme = "prairie";
		for (const [property] of Object.entries(themes)) {
			if (showTheme) {
				curTheme = themes[property];
				return curTheme;
			}
			if (property === currentTheme) {
				showTheme = true;
			}
		}

		return curTheme;
	}

	initGameListeners() {
		const { gamePlay } = this;

		gamePlay.cellEnterListeners = [];
		gamePlay.cellClickListeners = [];
		gamePlay.cellLeaveListeners = [];
		gamePlay.newGameListeners = [];
		gamePlay.loadGameListeners = [];
		gamePlay.saveGameListeners = [];

		gamePlay.addSaveGameListener(this.saveGame.bind(this));
		gamePlay.addNewGameListener(this.init.bind(this));
		gamePlay.addLoadGameListener(this.loadGame.bind(this));

		gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
		gamePlay.addCellClickListener(this.onCellClick.bind(this));
		gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
	}

	loadGame() {
		const loadedData = this.gameStateService.load();
		const classMap = {
			bowman: Bowman,
			swordsman: Swordsman,
			magician: Magician,
			undead: Undead,
			vampire: Vampire,
			daemon: Daemon,
		};
		const playerChars = loadedData.playerTeam.characters;
		const aiChars = loadedData.aiTeam.characters;
		const createTeam = (chars) =>
			new Team(
				chars.map((char) => {
					const className = classMap[char.type];
					const newChar = new className(char.level, false);
					for (const [property] of Object.entries(char)) {
						newChar[property] = char[property];
					}
					return newChar;
				})
			);
		const playerTeam = createTeam(playerChars);
		const aiTeam = createTeam(aiChars);
		this.init(playerTeam, aiTeam, loadedData.theme);
	}

	saveGame() {
		const copiedState = GameState.from(this);
		this.gameStateService.save(copiedState);
	}

	checkWinner() {
		const { boardSize } = this.gamePlay;
		const { characters: playerChars } = this.playerTeam;
		if (!playerChars.length) {
			GamePlay.showError("Вы проиграли!");
			this.init();
		} else if (!this.aiTeam.characters.length) {
			this.setTheme(this.getNextTheme());
			playerChars.forEach((char) => {
				char.levelUp();
			});
			this.createAI();
			redrawCharactersPositions(
				this.playerTeam.generateTeamPositions(true, boardSize),
				this.aiTeam.generateTeamPositions(false, boardSize),
				this.gamePlay
			);
		} else {
			redrawCharactersPositions(
				this.playerTeam.getTeamPositions(),
				this.aiTeam.getTeamPositions(),
				this.gamePlay
			);
			return false;
		}
		return true;
	}

	completeRound() {
		if (!this.checkWinner()) {
			this.aiController.doAction().then(() => {
				this.checkWinner();
			});
		}
	}

	onCellClick(position) {
		const character = getCharacterByPosition(position, this.playerTeam.characters);
		const { selectedCharacter } = this;
		const enemyCharacter = character ? null : getCharacterByPosition(position, this.aiTeam.characters);
		if (this.gamePlay.preventAction) {
			return;
		}

		if (character) {
			if (selectedCharacter) {
				this.gamePlay.deselectCell(selectedCharacter.position);
			}
			this.selectedCharacter = character;
			this.gamePlay.selectCell(position);
		} else if (selectedCharacter) {
			if (
				enemyCharacter &&
				selectedCharacter.canInteractWithPosition(
					enemyCharacter.position,
					this.gamePlay.boardSize,
					"attackDistance"
				)
			) {
				const damage = getDamage(selectedCharacter, enemyCharacter);
				this.gamePlay.preventAction = true;
				this.gamePlay.showDamage(position, damage).then(() => {
					this.gamePlay.preventAction = false;

					enemyCharacter.setHealth(enemyCharacter.health - damage);
					this.gamePlay.deselectCell(enemyCharacter.position);
					this.gamePlay.deselectCell(selectedCharacter.position);
					this.selectedCharacter = null;

					this.completeRound();
				});
			} else if (
				selectedCharacter.canInteractWithPosition(position, this.gamePlay.boardSize) &&
				!enemyCharacter
			) {
				this.gamePlay.deselectCell(selectedCharacter.position);

				selectedCharacter.position = position;
				this.gamePlay.deselectCell(selectedCharacter.position);
				this.selectedCharacter = null;
				this.completeRound();
			}
		} else {
			GamePlay.showError("Выберите персонажа!");
		}
	}

	onCellEnter(position) {
		const { selectedCharacter } = this;
		const character = getCharacterByPosition(position, [...this.playerTeam.characters, ...this.aiTeam.characters]);

		if (character) {
			this.gamePlay.showCellTooltip(getCharacterTooltip(character), position);
		}

		if (selectedCharacter) {
			if (!character) {
				if (selectedCharacter.canInteractWithPosition(position, this.gamePlay.boardSize)) {
					this.gamePlay.setCursor(cursors.auto);
					this.gamePlay.selectCell(position, "green");
				} else {
					this.gamePlay.setCursor(cursors.notallowed);
				}
			} else if (selectedCharacter === character || selectedCharacter.team === character.team) {
				this.gamePlay.setCursor(cursors.pointer);
			} else if (selectedCharacter.canInteractWithPosition(position, this.gamePlay.boardSize, "attackDistance")) {
				this.gamePlay.setCursor(cursors.auto);
				this.gamePlay.selectCell(position, "red");
			} else {
				this.gamePlay.setCursor(cursors.notallowed);
			}
		}
	}

	onCellLeave(position) {
		this.gamePlay.hideCellTooltip(position);

		if (this.selectedCharacter && this.selectedCharacter.position !== position) {
			this.gamePlay.deselectCell(position);
		}
	}
}
