import Character from "../Character";
import { Bowman, Daemon, Magician, Undead, Vampire, Swordsman } from "../characters";

test("class Character throw error", () => {
	expect(() => new Character(1)).toThrow(new Error("Нельзя создавать экземпляр класса Character!"));
});

test("class Daemon instanceof", () => {
	expect(new Daemon()).toBeInstanceOf(Daemon);
});

test("class Magician instanceof", () => {
	expect(new Bowman()).toBeInstanceOf(Bowman);
});

test("class Undead instanceof", () => {
	expect(new Magician()).toBeInstanceOf(Magician);
});

test("class Vampire instanceof", () => {
	expect(new Vampire()).toBeInstanceOf(Vampire);
});

test("class Swordsman instanceof", () => {
	expect(new Swordsman()).toBeInstanceOf(Swordsman);
});

test("class Undead instanceof", () => {
	expect(new Undead()).toBeInstanceOf(Undead);
});

test("Bowman skills", () => {
	const bowman = new Bowman(1);
	const { attack, health, defence, attackDistance, stepsNumber, level } = bowman;

	expect({
		attack,
		health,
		defence,
		attackDistance,
		stepsNumber,
		level,
	}).toEqual({ attack: 25, attackDistance: 2, stepsNumber: 2, defence: 25, health: 100, level: 1 });
});

test("Swordsman skills", () => {
	const swordsman = new Swordsman(1);
	const { attack, health, defence, attackDistance, stepsNumber, level } = swordsman;

	expect({
		attack,
		health,
		defence,
		attackDistance,
		stepsNumber,
		level,
	}).toEqual({ attack: 40, attackDistance: 1, stepsNumber: 4, defence: 10, health: 100, level: 1 });
});

test("Magician skills", () => {
	const magician = new Magician(1);
	const { attack, health, defence, attackDistance, stepsNumber, level } = magician;

	expect({
		attack,
		health,
		defence,
		attackDistance,
		stepsNumber,
		level,
	}).toEqual({ attack: 10, attackDistance: 4, stepsNumber: 1, defence: 10, health: 100, level: 1 });
});

test("Daemon skills", () => {
	const daemon = new Daemon(1);
	const { attack, health, defence, attackDistance, stepsNumber, level } = daemon;

	expect({
		attack,
		health,
		defence,
		attackDistance,
		stepsNumber,
		level,
	}).toEqual({ attack: 10, attackDistance: 4, stepsNumber: 1, defence: 10, health: 100, level: 1 });
});

test("Undead skills", () => {
	const undead = new Undead(1);
	const { attack, health, defence, attackDistance, stepsNumber, level } = undead;

	expect({
		attack,
		health,
		defence,
		attackDistance,
		stepsNumber,
		level,
	}).toEqual({ attack: 40, attackDistance: 1, stepsNumber: 4, defence: 10, health: 100, level: 1 });
});

test("Vampire skills", () => {
	const vampire = new Vampire(1);
	const { attack, health, defence, attackDistance, stepsNumber, level } = vampire;

	expect({
		attack,
		health,
		defence,
		attackDistance,
		stepsNumber,
		level,
	}).toEqual({ attack: 25, attackDistance: 2, stepsNumber: 2, defence: 25, health: 100, level: 1 });
});
