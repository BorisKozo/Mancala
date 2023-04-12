import { Game, Player } from './game';

let count = 0;

class Node {
  public state: Game;
  public children: (Node | null)[];
  public winner: Player | null;

  constructor(state: Game) {
    this.state = state;
    this.children = [null, null, null, null, null, null];
    this.winner = null;
  }

  expand(depth: number) {
    // if (depth === 20) {
    //   console.log(depth);
    // }
    // count++;
    // if (count % 1000000 === 0) {
    //   console.log(`${Date()} ${depth} ${count}`);
    // }
    if (this.state.getState().gameOver) {
      return;
    }
    for (let cup = 0; cup < 6; cup++) {
      if (this.state.canPlay(cup)) {
        const nextState = this.state.clone();
        nextState.play(cup);
        const nextNode = new Node(nextState);
        this.children[cup] = nextNode;
        nextNode.expand(depth + 1);
      }
    }
  }
}

export class GameTree {
  public root: Node;

  constructor() {
    this.root = GameTree.buildTree();
  }

  static buildTree(): Node {
    console.log(Date());
    const root = new Node(new Game());
    root.expand(0);
    return root;
  }
}
