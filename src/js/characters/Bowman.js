import Character from "../Character";

export default class Bowman extends Character {
	constructor(level, autoCreate = true) {
		super(level, "bowman");
		this.attack = 25;
		this.attackDistance = 2;
		this.stepsNumber = 2;
		this.defence = 25;
		this.updateOnInitLvl();
	}
}
