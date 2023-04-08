export class Side {
  private slots: number[];
  private home: number;

  constructor() {
    this.slots = [4, 4, 4, 4, 4, 4];
    this.home = 0;
  }

  clone(): Side {
    const result = new Side();
    result.home = this.home;
    for (let i = 0; i < 6; i++) {
      result.slots[i] = this.slots[i];
    }
    return result;
  }

  isEmpty(): boolean {
    return !this.slots.some((value) => value > 0);
  }

  deposit(position: number, count: number): { remaining: number; endOnEmpty: boolean; endPosition: number } {
    let endOnEmpty = false;
    let endPosition = position;
    for (let i = position; i < 6 && count > 0; i++) {
      endOnEmpty = this.slots[i] === 0;
      this.slots[i] += 1;
      count--;
      endPosition = i;
    }
    return {
      endPosition,
      remaining: count,
      endOnEmpty,
    };
  }

  depositHome(count: number) {
    this.home += count;
  }

  getHome(): number {
    return this.home;
  }

  canPlay(position: number): boolean {
    return position >= 0 && position <= 5 && this.slots[position] > 0;
  }

  pickUp(position: number): number {
    const result = this.slots[position];
    this.slots[position] = 0;
    return result;
  }

  serialize(): number[] {
    return [this.home, ...this.slots];
  }

  static deserialize(data: number[]): Side {
    const result = new Side();
    result.home = data[0];
    for (let i = 1; i <= 6; i++) {
      result.slots[i - 1] = data[i];
    }
    return result;
  }

  print(): string {
    return `(   ) [${this.slots.join('][')}]} (${this.home.toString().padStart(3, ' ')})`;
  }

  printReverse(): string {
    const tempSlots = [...this.slots];
    return `(${this.home.toString().padStart(3, ' ')}) [${tempSlots.reverse().join('][')}]} (   )`;
  }
}
