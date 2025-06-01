// casse abstrata criadora de Usuraio
// define o contrato, todas as classes concretas devem implementar o factoryMethod
// e o método create que chama o factoryMethod, que o sistema usa para iniciar o processo, sem saber detalhes da criação
// O factoryMethod é o “ponto de extensão” para criar usuários diferentes.

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
