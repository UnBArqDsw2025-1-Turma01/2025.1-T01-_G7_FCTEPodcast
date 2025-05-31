import { Professor } from "../../models/Usuario";

// Interface que define os métodos para construir um Podcast
// O PodcastBuilder é uma interface que define os métodos necessários para construir um Podcast.
// Ele especifica os métodos que devem ser implementados por qualquer classe que deseje construir um Podcast.
interface PodcastBuilder {
  adicionarImagem(image_path: string): void;
  adicionarCamposTextuais(
    titulo: string,
    descricao: string,
    autor: string
  ): Promise<void>;
  adicionarCoAutores(co_autores: string[]): void;
  registrarTags(tags: string): void;
  build(): PodcastDTO;
}

// DTO (Data Transfer Object) que representa um Podcast
// O PodcastDTO é um objeto simples que transporta os dados do podcast.
// Ele contém os campos necessários para representar um podcast,
// como título, descrição, caminho da imagem, co-autores, autor e tags.
// Ele é usado para transferir dados entre diferentes camadas da aplicação,
// como entre o builder e o serviço ou controlador que manipula os podcasts.
type PodcastDTO = {
  titulo: string;
  descricao: string;
  imagem_path: string;
  co_autores: string[];
  autor: string;
  tags?: string[];
};

// Classe concreta que implementa o PodcastBuilder
// A ConcretePodcastBuilder é uma implementação concreta da interface PodcastBuilder.
// Ela fornece a lógica específica para construir um podcast, implementando os métodos definidos na interface.
// Ela encapsula a lógica de validação e construção do podcast, garantindo que todos os campos necessários sejam preenchidos corretamente.
// Ela também lida com a validação do autor do podcast, garantindo que o autor exista antes de associá-lo ao podcast.
export class ConcretePodcastBuilder implements PodcastBuilder {
  private podcast: PodcastDTO | null = null;

  constructor() {
    this.podcast = {
      titulo: "",
      descricao: "",
      imagem_path: "",
      co_autores: [],
      autor: "",
      tags: [],
    };
  }

  public adicionarImagem(imagem_path: string | undefined): void {
    // if (imagem_path === undefined || imagem_path === null) {
    //   throw new Error(
    //     "Erro interno: Caminho da imagem não pode ser nulo ou indefinido."
    //   );
    // }
    this.podcast!.imagem_path = imagem_path || "default_image";
  }

  public async adicionarCamposTextuais(
    titulo: string,
    descricao: string,
    autor: string
  ) {
    if (titulo === undefined || titulo === null) {
      throw new Error("Título não pode ser nulo ou indefinido.");
    }
    if (descricao === undefined || descricao === null) {
      throw new Error("Descrição não pode ser nula ou indefinida.");
    }

    if (autor === undefined || autor === null) {
      throw new Error("Autor não pode ser nulo ou indefinido.");
    }

    const autor_existe = await Professor.findById(autor);
    if (!autor_existe) {
      throw new Error("Autor não encontrado.");
    }

    this.podcast!.titulo = titulo;
    this.podcast!.descricao = descricao;
    this.podcast!.autor = autor;
  }

  public adicionarCoAutores(co_autores: string[]): void {
    if (!Array.isArray(co_autores) || co_autores.length === 0) {
      throw new Error("Co-autores deve ser um array não vazio.");
    }
    this.podcast!.co_autores = co_autores;
  }

  public registrarTags(tags: string) {
    if (!tags || typeof tags !== "string") {
      throw new Error("Tags devem ser uma string não vazia.");
    }

    // Transforma a string em array, remove espaços em branco e ignora tags vazias
    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    this.podcast!.tags = tagArray;
  }

  public build(): PodcastDTO {
    if (
      !this.podcast ||
      !this.podcast.titulo ||
      !this.podcast.descricao ||
      !this.podcast.autor
    ) {
      throw new Error("Erro interno: Podcast não foi construído corretamente.");
    }
    return this.podcast;
  }
}

// Adaptações
// apenas algumas adaptações naturais foram feitas para o contexto do typescript e expressjs
// * Produto Simples como DTO
// no padrao original, o produto poder ser um objeto complexo, como uma classe com métodos e propriedades
// aqui usamos um objetos simples DTO, que é válido em TypeScript e ExpressJS.
// * Validações
// as validações foram adaptadas para lançar erros com mensagens mais claras
// especialmente tratando de apis, onde é importante que os métodos façam seus retornos sejam feitas pelas
// requisições e respostas HTTP e que essas mensagens sejam acessiveis, por em formato json pelo cliente.
