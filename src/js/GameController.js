import GamePlay from "./GamePlay";
import AIController from "./AIController";
import themes from "./themes";
import cursors from "./cursors";
import {
	getCharacterTooltip,
	getCharacterByPosition,
	redrawCharactersPositions,
	getDamage,
	getDistanceBetweenPositions,
} from "./utils";
import { Bowman, Swordsman, Undead, Daemon, Magician, Vampire } from "./characters";
import { generateTeam } from "./generators";

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay;
		this.stateService = stateService;
	}

	init() {
		const container = document.getElementById("game-container");
		const { boardSize } = this.gamePlay;
		this.gamePlay.bindToDOM(container);
		this.gamePlay.drawUi(themes.prairie);

		const playerTypes = [Bowman, Swordsman, Magician];
		//const aiTypes = [Undead, Vampire, Daemon];
		const aiTypes = [Undead, Undead, Undead];
		this.playerTeam = generateTeam(playerTypes, 3, 4);
		this.aiTeam = generateTeam(aiTypes, 3, 4);
		this.aiController = new AIController(this.playerTeam, this.aiTeam, this.gamePlay);

		redrawCharactersPositions(
			this.playerTeam.generateTeamPositions(true, boardSize),
			this.aiTeam.generateTeamPositions(false, boardSize),
			this.gamePlay
		);

		this.initGameListeners();
	}

	initGameListeners() {
		this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
		this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
		this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
	}

	completeRound() {
		redrawCharactersPositions(this.playerTeam.getTeamPositions(), this.aiTeam.getTeamPositions(), this.gamePlay);
		this.aiController.doAction();
	}

	onCellClick(position) {
		const character = getCharacterByPosition(position, this.playerTeam.characters);
		const { selectedCharacter } = this;
		const enemyCharacter = character ? null : getCharacterByPosition(position, this.aiTeam.characters);
		if (this.gamePlay.preventAction) {
			return;
		}
		this.aiTeam.characters.forEach((char) => {
			char.attacker = null;
		});
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

					enemyCharacter.health -= damage;

					enemyCharacter.attacker = selectedCharacter;

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
