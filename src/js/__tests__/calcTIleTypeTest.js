import { calcTileType } from "../utils";

test("calcTileType test", async () => {
	expect(calcTileType(0, 8)).toEqual('top-left');
});

test("calcTileType test", async () => {
	expect(calcTileType(7, 8)).toEqual('top-right');
});

test("calcTileType test", async () => {
	expect(calcTileType(1, 8)).toEqual('top');
});

test("calcTileType test", async () => {
	expect(calcTileType(63, 8)).toEqual('bottom-right');
});

test("calcTileType test", async () => {
	expect(calcTileType(56, 8)).toEqual('bottom-left');
});

test("calcTileType test", async () => {
	expect(calcTileType(61, 8)).toEqual('bottom');
});

test("calcTileType test", async () => {
	expect(calcTileType(8, 8)).toEqual('left');
});

test("calcTileType test", async () => {
	expect(calcTileType(15, 8)).toEqual('right');
});

test("calcTileType test", async () => {
	expect(calcTileType(20, 8)).toEqual('center');
});
