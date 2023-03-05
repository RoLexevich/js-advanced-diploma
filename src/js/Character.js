import { translateToMatrixCoordinate } from "./utils";

/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
	constructor(level, type = "generic") {
		this.level = level;
		this.attack = 0;
		this.defence = 0;
		this.health = 50;
		this.type = type;
		// TODO: выбросите исключение, если кто-то использует "new Character()"
		if (new.target.name === "Character") {
			throw new Error("Нельзя создавать экземпляр класса Character!");
		}
	}

	canInteractWithPosition(position, boardSize, property = "stepNumber") {
		const positionCoordinate = translateToMatrixCoordinate(position, boardSize);
		const selfPositionCoordinate = translateToMatrixCoordinate(this.position, boardSize);
		const distance = this[property];

		return (
			selfPositionCoordinate.x + distance >= positionCoordinate.x &&
			selfPositionCoordinate.y + distance >= positionCoordinate.y &&
			selfPositionCoordinate.x - distance <= positionCoordinate.x &&
			selfPositionCoordinate.y - distance <= positionCoordinate.y
		);
	}
}
