import { type } from 'os';
import { Side } from './side';

export enum Player {
  One,
  Two,
}

type GameState = { gameOver: boolean; score: { [Player.One]: number; [Player.Two]: number } };

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
  }
  return true;
}

function takeAll(side: Side) {
  let counter = 0;
  for (let i = 0; i < 6; i++) {
    counter += side.pickUp(i);
  }
  side.depositHome(counter);
}

export class Game {
  private player1Side: Side;
  private player2Side: Side;
  private currentPlayer: Player;
  private state: GameState;

  constructor() {
    this.player1Side = new Side();
    this.player2Side = new Side();

    this.currentPlayer = Player.One;
    this.state = {
      gameOver: false,
      score: {
        [Player.One]: 0,
        [Player.Two]: 0,
      },
    };
  }

  clone(): Game {
    const game = new Game();
    game.player1Side = this.player1Side.clone();
    game.player2Side = this.player2Side.clone();
    game.currentPlayer = this.currentPlayer;
    return game;
  }

  private playPlayer1(position: number): boolean {
    return playGeneric(position, this.player1Side, this.player2Side);
  }

  private playPlayer2(position: number): boolean {
    return playGeneric(position, this.player2Side, this.player1Side);
  }

  play(position: number) {
    let switchPlayer = false;
    if (this.currentPlayer === Player.One && this.player1Side.canPlay(position)) {
      switchPlayer = this.playPlayer1(position);
    }
    if (this.currentPlayer === Player.Two && this.player2Side.canPlay(position)) {
      switchPlayer = this.playPlayer2(position);
    }
    if (switchPlayer) {
      this.nextPlayer();
    }
    if (this.player1Side.isEmpty()) {
      takeAll(this.player2Side);
    }
    if (this.player2Side.isEmpty()) {
      takeAll(this.player1Side);
    }
  }

  canPlay(position: number): boolean {
    return (
      (this.currentPlayer === Player.One && this.player1Side.canPlay(position)) ||
      (this.currentPlayer === Player.Two && this.player2Side.canPlay(position))
    );
  }

  getState(): GameState {
    const gameOverFinal = this.player1Side.isEmpty() && this.player2Side.isEmpty();
    const homeDiff = Math.abs(this.player1Side.getHome() - this.player2Side.getHome());
    const stonesInPlay = Math.abs(this.player1Side.getStoneCount() + this.player2Side.getStoneCount());
    const gameOverStones = homeDiff > stonesInPlay;
    this.state.gameOver = gameOverFinal || gameOverStones;
    this.state.score[Player.One] = this.player1Side.getHome();
    this.state.score[Player.Two] = this.player2Side.getHome();
    return this.state;
  }

  private nextPlayer() {
    if (this.currentPlayer === Player.One) {
      this.currentPlayer = Player.Two;
    } else {
      this.currentPlayer = Player.One;
    }
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  serialize(): number[] {
    return [this.currentPlayer, ...this.player1Side.serialize(), ...this.player2Side.serialize()];
  }

  static deserialize(data: number[]): Game {
    const result = new Game();
    result.currentPlayer = data[0];
    result.player1Side = Side.deserialize(data.slice(1, 8));
    result.player2Side = Side.deserialize(data.slice(8));
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
