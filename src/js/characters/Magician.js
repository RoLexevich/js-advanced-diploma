import Character from "../Character";

export default class Magician extends Character {
	constructor(level) {
		super(level, "magician");
		this.attack = 40;
		this.attackDistance = 4;
		this.stepNumber = 1;
		this.defence = 10;
	}
}
