import GamePlay from "./GamePlay";
import themes from "./themes";
import cursors from "./cursors";
import { getCharacterTooltip, getCharacterByPosition, redrawCharactersPositions } from "./utils";
import {
 Bowman, Swordsman, Undead, Daemon, Magician, Vampire,
} from "./characters";
import { generateTeam } from "./generators";

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay;
		this.stateService = stateService;
	}

	init() {
		const container = document.getElementById("game-container");
		this.gamePlay.bindToDOM(container);
		this.gamePlay.drawUi(themes.prairie);

		const firstPlayerTypes = [Bowman, Swordsman, Magician];
		const secondPlayerTypes = [Undead, Vampire, Daemon];
		this.firstTeam = generateTeam(firstPlayerTypes, 3, 4);
		this.secondTeam = generateTeam(secondPlayerTypes, 3, 4);

		redrawCharactersPositions(
			this.firstTeam.generateTeamPositions(true, this.gamePlay.boardSize),
			this.secondTeam.generateTeamPositions(false, this.gamePlay.boardSize),
			this.gamePlay,
		);

		this.initGameListeners();
	}

	initGameListeners() {
		this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
		this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
		this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
	}

	updateCharactersPositions() {
		redrawCharactersPositions(this.firstTeam.getTeamPositions(), this.secondTeam.getTeamPositions(), this.gamePlay);
	}

	onCellClick(position) {
		const character = getCharacterByPosition(position, this.firstTeam.characters);
		const enemyCharacter = character ? null : getCharacterByPosition(position, this.secondTeam.characters);

		if (character) {
			if (this.selectedCharacter) {
				this.gamePlay.deselectCell(this.selectedCharacter.position);
			}
			this.selectedCharacter = character;
			this.gamePlay.selectCell(position);
		} else if (this.selectedCharacter) {
			if (
				enemyCharacter &&
				this.selectedCharacter.canInteractWithPosition(
					enemyCharacter.position,
					this.gamePlay.boardSize,
					"attackDistance",
				)
			) {
				const damage = Math.max(
					this.selectedCharacter.attack - enemyCharacter.defence,
					this.selectedCharacter.attack * 0.1,
				);
				this.gamePlay.showDamage(position, damage).then((resolve) => {
					enemyCharacter.health -= damage;
					this.updateCharactersPositions();
				});
			} else if (this.selectedCharacter.canInteractWithPosition(position, this.gamePlay.boardSize)) {
				this.gamePlay.deselectCell(this.selectedCharacter.position);

				this.selectedCharacter.position = position;
				this.gamePlay.deselectCell(this.selectedCharacter.position);

				this.updateCharactersPositions();
			}
		} else {
			GamePlay.showError("В этом поле нет персонажа игрока!");
		}
	}

	onCellEnter(position) {
		const { selectedCharacter } = this;
		const character = getCharacterByPosition(position, [
			...this.firstTeam.characters,
			...this.secondTeam.characters,
		]);

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

		if (this.selectedCharacter.position !== position) {
			this.gamePlay.deselectCell(position);
		}
	}
}
