import { randomIntFromInterval } from "./utils";
import Team from "./Team";
import {
 Bowman, Swordsman, Undead, Daemon, Magician, Vampire,
} from "./characters";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
	while (true) {
		const randomType = allowedTypes[randomIntFromInterval(0, allowedTypes.length - 1)];
		const randomLevel = randomIntFromInterval(1, maxLevel);

		yield new randomType(randomLevel);
	}
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
	const characters = [];
	for (let index = 0; index < characterCount; index++) {
		characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
	}
	return new Team(characters);
	// TODO: write logic here
}
