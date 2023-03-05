import Character from "../Character";

export default class Daemon extends Character {
	constructor(level) {
		super(level, "daemon");
		this.attack = 10;
		this.attackDistance = 4;
		this.stepNumber = 1;
		this.defence = 10;
	}
}
