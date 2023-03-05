import Character from "../Character";

export default class Swordsman extends Character {
	constructor(level) {
		super(level, "swordsman");
		this.attack = 10;
		this.attackDistance = 1;
		this.stepNumber = 4;
		this.defence = 40;
	}
}
