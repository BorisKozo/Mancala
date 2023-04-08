import { Game } from './game';

console.log('Starting the game!');
const game = new Game();
console.log(game.print());
game.play(2);
console.log(game.print());
console.log(game.serialize());
const newGame = Game.deserialize(game.serialize());
console.log(game.print());
