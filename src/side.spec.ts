import { deserialize } from 'v8';
import { Side } from './side';
describe('Side', () => {
  describe('Constructor', () => {
    test('should construct the default configuration', () => {
      const side = new Side();
      expect(side.serialize()).toEqual([0, 4, 4, 4, 4, 4, 4]);
    });
  });

  describe('Clone', () => {
    test('should clone a side', () => {
      const side = new Side();
      side.depositHome(5);
      side.deposit(1, 3);
      side.deposit(2, 1);
      const cloneSide = side.clone();
      expect(cloneSide.serialize()).toEqual(side.serialize());
    });
  });

  describe('Is Empty', () => {
    test('should report empty side as empty', () => {
      const side = new Side();
      for (let i = 0; i < 6; i++) {
        side.pickUp(i);
      }
      side.depositHome(2);
      expect(side.isEmpty()).toBeTruthy();
    });

    test('should report non empty side as not empty', () => {
      const side = new Side();
      expect(side.isEmpty()).toBeFalsy();
    });
  });

  describe('Deposit', () => {
    test('should deposit and land on empty space', () => {
      const side = new Side();
      for (let i = 0; i < 6; i++) {
        side.pickUp(i);
      }
      expect(side.isEmpty()).toBeTruthy();
      const depositResult = side.deposit(0, 3);
      expect(depositResult.endOnEmpty).toBeTruthy();
      expect(depositResult.endPosition).toEqual(2);
      expect(depositResult.remaining).toEqual(0);
    });

    test('should deposit and land on non empty space', () => {
      const side = new Side();
      const depositResult = side.deposit(1, 1);
      expect(depositResult.endOnEmpty).toBeFalsy();
      expect(depositResult.endPosition).toEqual(1);
      expect(depositResult.remaining).toEqual(0);
    });

    test('should deposit and have some stones remaining', () => {
      const side = new Side();
      const depositResult = side.deposit(1, 10);
      expect(depositResult.endOnEmpty).toBeFalsy();
      expect(depositResult.endPosition).toEqual(5);
      expect(depositResult.remaining).toEqual(5);
    });
  });

  describe('Home', () => {
    test('should have nothing at home at the begining', () => {
      const side = new Side();
      expect(side.getHome()).toEqual(0);
    });

    test('should have given amount after deposit home', () => {
      const side = new Side();
      expect(side.getHome()).toEqual(0);
      side.depositHome(1);
      expect(side.getHome()).toEqual(1);
      side.depositHome(12);
      expect(side.getHome()).toEqual(13);
    });
  });

  describe('Can play', () => {
    test('should be able to play at the begining', () => {
      const side = new Side();
      expect(side.canPlay(2)).toBeTruthy();
    });

    test('should not be able to play after pick up', () => {
      const side = new Side();
      side.pickUp(1);
      expect(side.canPlay(1)).toBeFalsy();
    });
  });

  describe('Serialization', () => {
    test('should serialize the initial configuration', () => {
      const side = new Side();
      expect(side.serialize()).toEqual([0, 4, 4, 4, 4, 4, 4]);
    });

    test('should deserialize some configuration', () => {
      const side = new Side();
      side.deposit(2, 2);
      side.depositHome(3);
      const serialized1 = side.serialize();
      const side2 = Side.deserialize(serialized1);
      const serialized2 = side2.serialize();
      expect(serialized1).toEqual(serialized2);
    });
  });
});
