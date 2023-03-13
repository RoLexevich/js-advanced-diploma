import Character from "../Character";

export default class Vampire extends Character {
	constructor(level, autoCreate = true) {
		super(level, "vampire");
		this.attack = 25;
		this.stepsNumber = 2;
		this.attackDistance = 2;
		this.defence = 25;
		if (autoCreate) {
			this.updateOnInitLvl();
		}
	}
}
