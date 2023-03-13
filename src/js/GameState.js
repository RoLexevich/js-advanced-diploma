export default class GameState {
	static from(ctrl) {
		const gameCtrlClone = structuredClone({
			playerTeam: ctrl.playerTeam,
			aiTeam: ctrl.aiTeam,
			theme: ctrl.currentTheme
		});
		const playerChars = gameCtrlClone.playerTeam.characters;
		const aiChars = gameCtrlClone.aiTeam.characters;
		[...playerChars, ...aiChars].forEach((char) => {
			delete char.team;
		});
		return gameCtrlClone;
	}
}
