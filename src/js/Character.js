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
	constructor(level, type = "generic", autoCreate = false) {
		this.level = level;
		this.attack = 0;
		this.defence = 0;
		this.health = 100;
		this.stepsNumber = 0;
		this.attackDistance = 0;
		this.type = type;
		// TODO: выбросите исключение, если кто-то использует "new Character()"
		if (new.target.name === "Character") {
			throw new Error("Нельзя создавать экземпляр класса Character!");
		}
	}

	canInteractWithPosition(position, boardSize, property = "stepsNumber") {
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

	levelUp() {
		this.level += 1;
		this.updateAttrs();
	}

	updateAttrs() {
		const health = 80 + this.health;

		this.attack = Math.round(Math.max(this.attack, (this.attack * (80 + this.health)) / 100));
		this.defence = Math.round(Math.max(this.defence, (this.defence * (80 + this.health)) / 100));
		this.health = health > 100 ? 100 : Math.round(health);
	}

	updateOnInitLvl() {
		for (let index = 1; index < this.level; index++) {
			this.updateAttrs();
		}
	}

	setHealth(health) {
		this.health = health;
		if (health <= 0 && this.team) {
			this.team.characters = this.team.characters.filter((char) => char.health > 0);
		}
	}
}
