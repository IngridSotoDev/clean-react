export class UnexpectedError extends Error {
  constructor() {
    super("algo de errado aconteceu. tente novamente em breve");
    this.name = "UnexpectedError";
  }
}
