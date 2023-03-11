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
		return new Promise((resolve) => {
			const { boardSize } = this.gamePlay;
			const playerChar = this.getNearEnemy();
			const { position: playerPos } = playerChar;
			const aiChar = this.getNearAIToPlayer(playerChar);
			const canAttack = aiChar.canInteractWithPosition(playerPos, boardSize, "attackDistance");

			if (canAttack) {
				const damage = getDamage(aiChar, playerChar);
				this.gamePlay.preventAction = true;
				this.gamePlay.showDamage(playerPos, damage).then(() => {
					this.gamePlay.preventAction = false;
					playerChar.setHealth(playerChar.health - damage);
					resolve();
				});
			} else {
				aiChar.position = this.findPath(aiChar, playerChar.position);

				resolve();
			}
		});
	}

	getNearEnemy() {
		const { boardSize } = this.gamePlay;
		const { characters: playerChars } = this.playerTeam;
		const { characters: aiChars } = this.aiTeam;

		return playerChars.reduce((playerDistObj, playerChar) => {
			const dist = aiChars.reduce((curDistance, aiChar) => {
				const distance = getDistanceBetweenPositions(aiChar.position, playerChar.position, boardSize);
				return distance > curDistance ? curDistance : distance;
			}, getDistanceBetweenPositions(aiChars[0].position, playerChar.position, boardSize));

			return !playerDistObj.dist || playerDistObj.dist > dist ? { playerChar, dist } : { ...playerDistObj };
		}, {}).playerChar;
	}

	getNearAIToPlayer(playerChar) {
		const { boardSize } = this.gamePlay;
		const { characters: aiCharacters } = this.aiTeam;

		return aiCharacters.reduce((char1, char2) => {
			const distance1 =
				getDistanceBetweenPositions(char1.position, playerChar.position, boardSize) - char1.attackDistance;
			const distance2 =
				getDistanceBetweenPositions(char2.position, playerChar.position, boardSize) - char2.attackDistance;
			return distance1 > distance2 ? char2 : char1;
		}, aiCharacters[0]);
	}

	findPath(char, position2) {
		const { position: position1, stepsNumber } = char;
		const { boardSize } = this.gamePlay;
		const matrixCoordinate1 = translateToMatrixCoordinate(position1, boardSize);
		const matrixCoordinate2 = translateToMatrixCoordinate(position2, boardSize);
		const diffX1X2 = Math.abs(matrixCoordinate1.x - matrixCoordinate2.x);
		const diffY1Y2 = Math.abs(matrixCoordinate1.y - matrixCoordinate2.y);
		let resultX = matrixCoordinate1.x;
		let resultY = matrixCoordinate1.y;

		if (matrixCoordinate1.x > matrixCoordinate2.x) {
			if (stepsNumber >= diffX1X2) {
				resultX = matrixCoordinate2.x + 1;
			} else {
				resultX = matrixCoordinate1.x - stepsNumber;
			}
		} else if (matrixCoordinate1.x < matrixCoordinate2.x) {
			if (stepsNumber >= diffX1X2) {
				resultX = matrixCoordinate2.x - 1;
			} else {
				resultX = matrixCoordinate1.x + stepsNumber;
			}
		}

		if (matrixCoordinate1.y > matrixCoordinate2.y) {
			if (stepsNumber >= diffX1X2) {
				resultY = matrixCoordinate2.y + 1;
			} else {
				resultY = matrixCoordinate1.y - stepsNumber;
			}
		} else if (matrixCoordinate1.y < matrixCoordinate2.y) {
			if (stepsNumber >= diffY1Y2) {
				resultY = matrixCoordinate2.y - 1;
			} else {
				resultY = matrixCoordinate1.y + stepsNumber;
			}
		}
		return translateMatrixCoordinateToPosition(resultX, resultY, boardSize);
	}
}
