import PositionedCharacter from "./PositionedCharacter";
import { getRandomPosition } from "./utils";
/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
	constructor(characters) {
		this.characters = characters;

		characters.forEach((character) => {
			character.team = this;
		});
	}

	generateTeamPositions(isPlayer, boardSize) {
		const positionedCharacters = [];
		const excludedPositions = [];
		this.characters.forEach((character) => {
			const position = getRandomPosition(isPlayer, boardSize, excludedPositions);
			excludedPositions.push(position);
			character.position = position;
			positionedCharacters.push(new PositionedCharacter(character, position));
		});
		return positionedCharacters;
	}

	getTeamPositions() {
		const positionedCharacters = [];
		this.characters.forEach((character) => {
			positionedCharacters.push(new PositionedCharacter(character, character.position));
		});
		return positionedCharacters;
	}
	// TODO: write your logic here
}
