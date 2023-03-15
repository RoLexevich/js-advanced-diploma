import { Daemon, Vampire, Bowman, Swordsman, Magician, Undead } from "../characters";
import { getRandomPosition, randomIntFromInterval, translateToMatrixCoordinate } from "../utils";

test("Bowman attack test", () => {
	const bowman = new Bowman(1);
	bowman.position = 27;
	expect(bowman.canInteractWithPosition(29, 8, "attackDistance")).toEqual(true);
});

test("Bowman speed test", () => {
	const bowman = new Bowman(1);
	bowman.position = 27;
	expect(bowman.canInteractWithPosition(28, 8)).toEqual(true);
});

test("Swordsman attack test", () => {
	const swordsman = new Swordsman(1);
	swordsman.position = 27;
	expect(swordsman.canInteractWithPosition(28, 8, "attackDistance")).toEqual(true);
});

test("Swordsman speed test", () => {
	const swordsman = new Swordsman(1);
	swordsman.position = 27;
	expect(swordsman.canInteractWithPosition(31, 8)).toEqual(true);
});

test("Magician attack test", () => {
	const magician = new Magician(1);
	magician.position = 27;
	expect(magician.canInteractWithPosition(31, 8, "attackDistance")).toEqual(true);
});

test("Magician speed test", () => {
	const magician = new Magician(1);
	magician.position = 27;
	expect(magician.canInteractWithPosition(28, 8)).toEqual(true);
});

test("Daemon attack test", () => {
	const char = new Daemon(1);
	char.position = 27;
	expect(char.canInteractWithPosition(31, 8, "attackDistance")).toEqual(true);
});

test("Daemon speed test", () => {
	const char = new Daemon(1);
	char.position = 27;
	expect(char.canInteractWithPosition(28, 8)).toEqual(true);
});

test("Undead attack test", () => {
	const char = new Undead(1);
	char.position = 27;
	expect(char.canInteractWithPosition(28, 8, "attackDistance")).toEqual(true);
});

test("Undead speed test", () => {
	const char = new Undead(1);
	char.position = 27;
	expect(char.canInteractWithPosition(31, 8)).toEqual(true);
});

test("Vampire attack test", () => {
	const char = new Vampire(1);
	char.position = 27;
	expect(char.canInteractWithPosition(29, 8, "attackDistance")).toEqual(true);
});

test("Vampire speed test", () => {
	const char = new Vampire(1);
	char.position = 27;
	expect(char.canInteractWithPosition(29, 8)).toEqual(true);
});
