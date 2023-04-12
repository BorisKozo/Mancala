import { Game } from './game';

function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

console.log('Starting the game!');
const game = new Game();
let gameOver = false;
let count = 0;
while (!gameOver) {
  const slotToPlay = randomIntFromInterval(0, 5);
  if (!game.canPlay(slotToPlay)) {
    continue;
  }
  count++;
  console.log(game.print());
  console.log(`Playing slot ${slotToPlay}`);
  game.play(slotToPlay);
  let playResult = game.getState();
  console.log(JSON.stringify(playResult));
  console.log('--------------------');
  gameOver = playResult.gameOver;
}
