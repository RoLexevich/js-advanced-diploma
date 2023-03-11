export function translateToMatrixCoordinate(index, boardSize) {
	const abscissa = index % boardSize;
	const ordinate = (index - abscissa) / boardSize;
	return {
		x: abscissa,
		y: ordinate,
	};
}
/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
	const matrixCoordinate = translateToMatrixCoordinate(index, boardSize);
	const maxIndexInLine = boardSize - 1;
	let position = "center";

	if (matrixCoordinate.x === 0 && matrixCoordinate.y === 0) {
		position = "top-left";
	} else if (matrixCoordinate.x === maxIndexInLine && matrixCoordinate.y === 0) {
		position = "top-right";
	} else if (matrixCoordinate.x === 0 && matrixCoordinate.y === maxIndexInLine) {
		position = "bottom-left";
	} else if (matrixCoordinate.x === maxIndexInLine && matrixCoordinate.y === maxIndexInLine) {
		position = "bottom-right";
	} else if (matrixCoordinate.x !== maxIndexInLine && matrixCoordinate.x !== 0 && matrixCoordinate.y === 0) {
		position = "top";
	} else if (
		matrixCoordinate.x !== maxIndexInLine &&
		matrixCoordinate.x !== 0 &&
		matrixCoordinate.y === maxIndexInLine
	) {
		position = "bottom";
	} else if (matrixCoordinate.x === 0 && matrixCoordinate.y !== maxIndexInLine && matrixCoordinate.y !== 0) {
		position = "left";
	} else if (
		matrixCoordinate.x === maxIndexInLine &&
		matrixCoordinate.y !== maxIndexInLine &&
		matrixCoordinate.y !== 0
	) {
		position = "right";
	}

	return position;
}

export function getDistanceBetweenPositions(position1, position2, boardSize) {
	const matrixCoordinate1 = translateToMatrixCoordinate(position1, boardSize);
	const matrixCoordinate2 = translateToMatrixCoordinate(position2, boardSize);

	return Math.sqrt(
		Math.pow(matrixCoordinate2.x - matrixCoordinate1.x, 2) + Math.pow(matrixCoordinate2.y - matrixCoordinate1.y, 2),
	);
}

export function getCharacterTooltip(character) {
	return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}"`;
}

export function getCharacterByPosition(position, characters) {
	return characters.find((character) => character.position === position);
}

export function getDamage(attacker, target) {
	return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
}

export function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function redrawCharactersPositions(playerTeamPositions, secondTeamPositions, gamePlay) {
	gamePlay.redrawPositions([...playerTeamPositions, ...secondTeamPositions]);
}

export function translateMatrixCoordinateToPosition(x, y, boardSize) {
	const position = boardSize * y + x;
	return position;
}

function getAllRandomPositionForPlayer(isPlayer, boardSize) {
	const positions = [];
	const initX = isPlayer ? 0 : boardSize - 2;
	const maxXCondition = isPlayer ? 2 : boardSize;

	for (let y = 0; y < boardSize; y++) {
		for (let x = initX; x < maxXCondition; x++) {
			positions.push(translateMatrixCoordinateToPosition(x, y, boardSize));
		}
	}
	return positions;
}

export function getRandomPosition(isPlayer, boardSize, excludedPositions = []) {
	const allRandomPositions = getAllRandomPositionForPlayer(isPlayer, boardSize);
	const filteredPositions = allRandomPositions.filter((value) => !excludedPositions.includes(value));

	return filteredPositions[randomIntFromInterval(0, filteredPositions.length - 1)];
}

export function calcHealthLevel(health) {
	if (health < 15) {
		return "critical";
	}

	if (health < 50) {
		return "normal";
	}

	return "high";
}
