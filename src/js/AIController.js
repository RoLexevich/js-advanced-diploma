import {
	redrawCharactersPositions,
	getDamage,
	getDistanceBetweenPositions,
	translateToMatrixCoordinate,
	translateMatrixCoordinateToPosition,
} from "./utils";

export default class AIController {
	constructor(playerTeam, aiTeam, gamePlay) {
		this.playerTeam = playerTeam;
		this.gamePlay = gamePlay;
		this.aiTeam = aiTeam;
	}

	doAction() {
		const aiCharacters = this.aiTeam.characters;
		const wasAttack = aiCharacters.some((character) => !!character.attacker);

		if (wasAttack) {
			this.defenceStrategy();
		} else {
			this.attackStrategy();
		}
	}

	attackStrategy() {}

	defenceStrategy() {
		const aiCharacters = this.aiTeam.characters;
		const defensive = aiCharacters.find((character) => !!character.attacker);
		const { attacker } = defensive;
		const attackerPosition = attacker.position;
		const { boardSize } = this.gamePlay;
		const canDefense = defensive.canInteractWithPosition(attackerPosition, boardSize, "attackDistance");

		const respondingCharacter =
			aiCharacters.find((character) => {
				const canInteract = character.canInteractWithPosition(attackerPosition, boardSize, "attackDistance");
				let result = false;
				
				if (canDefense) {
					result = canInteract && character.attack > defensive.attack;
				} else if (canInteract) {
					result = canInteract;
				}

				return result;
			}) || (canDefense ? defensive : null);
		if (respondingCharacter) {
			const damage = getDamage(respondingCharacter, attacker);

			this.gamePlay.preventAction = true;
			this.gamePlay.showDamage(attackerPosition, damage).then(() => {
				defensive.attacker = null;
				this.gamePlay.preventAction = false;

				attacker.health -= damage;
				redrawCharactersPositions(
					this.playerTeam.getTeamPositions(),
					this.aiTeam.getTeamPositions(),
					this.gamePlay
				);
			});
		} else {
			const nearestChar = aiCharacters.reduce((char1, char2) => {
				const distance1 =
					getDistanceBetweenPositions(char1.position, attacker.position, boardSize) - char1.attackDistance;
				const distance2 =
					getDistanceBetweenPositions(char2.position, attacker.position, boardSize) - char2.attackDistance;
				return distance1 > distance2 ? char2 : char1;
			}, aiCharacters[0]);

			nearestChar.position = this.findPath(nearestChar, attacker.position);

			redrawCharactersPositions(
				this.playerTeam.getTeamPositions(),
				this.aiTeam.getTeamPositions(),
				this.gamePlay
			);
		}
	}

	findPath(char, position2) {
		const { position: position1, attackDistance } = char;
		const { boardSize } = this.gamePlay;
		const matrixCoordinate1 = translateToMatrixCoordinate(position1, boardSize);
		const matrixCoordinate2 = translateToMatrixCoordinate(position2, boardSize);
		const diffX1X2 = Math.abs(matrixCoordinate1.x - matrixCoordinate2.x);
		const diffY1Y2 = Math.abs(matrixCoordinate1.y - matrixCoordinate2.y);
		let resultX = matrixCoordinate1.x;
		let resultY = matrixCoordinate1.y;

		if (matrixCoordinate1.x > matrixCoordinate2.x) {
			if (attackDistance >= diffX1X2) {
				resultX = matrixCoordinate2.x + 1;
			} else {
				resultX = matrixCoordinate1.x - attackDistance;
			}
		} else if (matrixCoordinate1.x < matrixCoordinate2.x) {
			if (attackDistance >= diffX1X2) {
				resultX = matrixCoordinate2.x - 1;
			} else {
				resultX = matrixCoordinate1.x + attackDistance;
			}
		}

		if (matrixCoordinate1.y > matrixCoordinate2.y) {
			if (attackDistance >= diffX1X2) {
				resultY = matrixCoordinate2.y + 1;
			} else {
				resultY = matrixCoordinate1.y - attackDistance;
			}
		} else if (matrixCoordinate1.y < matrixCoordinate2.y) {
			if (attackDistance >= diffY1Y2) {
				resultY = matrixCoordinate2.y - 1;
			} else {
				resultY = matrixCoordinate1.y + attackDistance;
			}
		}
		return translateMatrixCoordinateToPosition(resultX, resultY, boardSize);
	}
}
