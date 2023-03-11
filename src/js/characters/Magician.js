import Character from "../Character";

export default class Magician extends Character {
	constructor(level) {
		super(level, "magician");
		this.attack = 10;
		this.attackDistance = 4;
		this.stepsNumber = 1;
		this.defence = 40;
	}
}