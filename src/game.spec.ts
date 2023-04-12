import { Game } from './game';

describe('Game', () => {
  describe('Constructor', () => {
    test('should construct the default configuration', () => {
      const game = new Game();
      expect(game.serialize()).toEqual([0, 0, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4]);
    });
  });

  describe('Clone', () => {
    test('should clone a game', () => {
      const game = new Game();
      game.play(2);
      const game2 = game.clone();
      expect(game.serialize()).toEqual(game2.serialize());
    });
  });

  describe('Serialize and Deserialize', () => {
    test('should serialize and deserialize a game', () => {
      const game = new Game();
      game.play(2);
      const gameSerialized = game.serialize();
      console.log(gameSerialized);
      const game2 = Game.deserialize(gameSerialized);
      const gameSerialized2 = game2.serialize();
      console.log(gameSerialized2);
      expect(gameSerialized).toEqual(gameSerialized2);
    });
  });
});
