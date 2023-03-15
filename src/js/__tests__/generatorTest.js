import { randomIntFromInterval } from "../utils";
import { characterGenerator, generateTeam } from "../generators";
import { Daemon, Vampire, Bowman, Swordsman, Magician, Undead } from "../characters";
import Character from "../Character";

test("character Generator Test", () => {
	const randomMaxIndex = randomIntFromInterval(1, 10);
	const maxLevel = randomIntFromInterval(1, 10);
	const playerTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];

	for (let i = 0; i < randomMaxIndex; i += 1) {
		expect(characterGenerator(playerTypes, maxLevel).next().value).toBeInstanceOf(Character);
	}
});

test("generateTeam Test", () => {
	const maxLevel = randomIntFromInterval(1, 10);
	const characterCount = 4;
	const playerTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
	const team = generateTeam(playerTypes, maxLevel, characterCount);

	expect(team.characters.length).toEqual(characterCount);
	team.characters.forEach((char) => {
		expect(char.level <= maxLevel).toEqual(true);
	});
});
