import Character from "../Character";

export default class Bowman extends Character {
	constructor(level) {
		super(level, "bowman");
		this.attack = 25;
		this.attackDistance = 2;
		this.stepNumber = 2;
		this.defence = 25;
	}
}
