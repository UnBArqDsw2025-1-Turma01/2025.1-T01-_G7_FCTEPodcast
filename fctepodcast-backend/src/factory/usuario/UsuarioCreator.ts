export abstract class UsuarioCreator {
  abstract factoryMethod(
    nome: string,
    email: string,
    senha: string
  ): Promise<void>;

  async create(nome: string, email: string, senha: string): Promise<void> {
    await this.factoryMethod(nome, email, senha);
  }
}
