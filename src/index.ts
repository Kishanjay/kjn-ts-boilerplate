export default class KjnTsBoilerplate {
  name;

  constructor(name: string) {
    this.name = name;
  }

  run() {
    console.log(`Hello there ${this.name}`);
  }
}
