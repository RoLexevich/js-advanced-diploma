import { getCharacterTooltip, randomIntFromInterval } from "../utils";
import { Daemon, Vampire, Bowman, Swordsman, Magician, Undead } from "../characters";

test("getCharacterTooltip test", async () => {
	const playerTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
	const randomType = playerTypes[randomIntFromInterval(0, playerTypes.length - 1)];
	const randomChar = new randomType(1);

	expect(getCharacterTooltip(randomChar)).toEqual(
		`🎖${randomChar.level} ⚔${randomChar.attack} 🛡${randomChar.defence} ❤${randomChar.health}`
	);
});
