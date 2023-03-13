import Character from "../Character";

export default class Swordsman extends Character {
	constructor(level, autoCreate = true) {
		super(level, "swordsman");
		this.attack = 40;
		this.attackDistance = 1;
		this.stepsNumber = 4;
		this.defence = 10;
		if (autoCreate) {
			this.updateOnInitLvl();
		}
	}
}
