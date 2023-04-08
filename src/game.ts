import { Side } from './side';

enum Player {
  One,
  Two,
}

function reversePosition(position: number): number {
  return 5 - position;
}

function playGeneric(position: number, side1: Side, side2: Side): boolean {
  let hand = side1.pickUp(position);
  position++;
  while (hand > 0) {
    let depositResult = side1.deposit(position, hand);
    hand = depositResult.remaining;
    if (hand === 0) {
      if (depositResult.endOnEmpty) {
        //if ended on empty slot, take all the pieces of oppsite side
        const selfCount = side1.pickUp(depositResult.endPosition);
        side1.depositHome(selfCount);
        const stealCount = side2.pickUp(reversePosition(depositResult.endPosition));
        side1.depositHome(stealCount);
      }
      return true;
    }
    hand--;
    side1.depositHome(1);
    if (hand === 0) {
      //If finished at home you get another turn
      return false;
    }
    depositResult = side2.deposit(0, hand);
    hand = depositResult.remaining;
    position = 0;
    console.log(depositResult);
  }
  return true;
}

export class Game {
  private player1Side: Side;
  private player2Side: Side;
  private currentPlayer: Player;

  constructor() {
    this.player1Side = new Side();
    this.player2Side = new Side();

    this.currentPlayer = Player.One;
  }

  clone(): Game {
    const game = new Game();
    game.player1Side = this.player1Side.clone();
    game.player2Side = this.player2Side.clone();
    game.currentPlayer = this.currentPlayer;
    return game;
  }

  playPlayer1(position: number): boolean {
    return playGeneric(position, this.player1Side, this.player2Side);
  }

  playPlayer2(position: number): boolean {
    return playGeneric(position, this.player2Side, this.player1Side);
  }

  play(position: number) {
    let switchPlayer = true;
    if (this.currentPlayer === Player.One && this.player1Side.canPlay(position)) {
      switchPlayer = this.playPlayer1(position);
    }
    if (this.currentPlayer === Player.Two && this.player2Side.canPlay(reversePosition(position))) {
      switchPlayer = this.playPlayer2(position);
    }
    if (switchPlayer) {
      this.nextPlayer();
    }
  }

  nextPlayer() {
    if (this.currentPlayer === Player.One) {
      this.currentPlayer = Player.Two;
    } else {
      this.currentPlayer = Player.One;
    }
  }

  serialize(): number[] {
    return [this.currentPlayer, ...this.player1Side.serialize(), ...this.player2Side.serialize()];
  }

  static deserialize(data: number[]): Game {
    const result = new Game();
    result.currentPlayer = data[0];
    result.player1Side = Side.deserialize(data.slice(1, 6));
    result.player2Side = Side.deserialize(data.slice(6));
    return result;
  }

  print(): string {
    const tag = '->';
    const emptyTag = '  ';
    const player1tag = this.currentPlayer === Player.One ? tag : emptyTag;
    const player2tag = this.currentPlayer === Player.Two ? tag : emptyTag;
    return `${player1tag} ${this.player1Side.print()}\n${player2tag} ${this.player2Side.printReverse()}`;
  }
}
