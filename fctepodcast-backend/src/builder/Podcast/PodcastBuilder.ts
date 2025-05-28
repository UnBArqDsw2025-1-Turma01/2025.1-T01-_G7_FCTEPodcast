import { Professor } from "../../models/Usuario";

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

type PodcastDTO = {
  titulo: string;
  descricao: string;
  imagem_path: string;
  co_autores: string[];
  autor: string;
  tags?: string[];
};

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
