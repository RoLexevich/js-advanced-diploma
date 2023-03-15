import {
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
		const getResult = (axis) => {
			const axisCoordinate1 = matrixCoordinate1[axis];
			const axisCoordinate2 = matrixCoordinate2[axis];
			const diff = Math.abs(axisCoordinate1 - axisCoordinate2);
			let result = axisCoordinate1;
			if (axisCoordinate1 > axisCoordinate2) {
				if (stepsNumber >= diff) {
					result = axisCoordinate2 + 1;
				} else {
					result = axisCoordinate1 - stepsNumber;
				}
			} else if (axisCoordinate1 < axisCoordinate2) {
				if (stepsNumber >= diff) {
					result = axisCoordinate2 - 1;
				} else {
					result = axisCoordinate1 + stepsNumber;
				}
			}
			return result;
		};

		return translateMatrixCoordinateToPosition(getResult("x"), getResult("y"), boardSize);
	}
}
