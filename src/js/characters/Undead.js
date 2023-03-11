import Character from "../Character";

export default class Undead extends Character {
	constructor(level) {
		super(level, "undead");
		this.attack = 40;
		this.attackDistance = 1;
		this.stepsNumber = 4;
		this.defence = 10;
		this.updateOnInitLvl();
	}
}
