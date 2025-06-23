/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConcretePodcastBuilder } from "../../../builder/Podcast/PodcastBuilder";
import { Professor } from "../../../models/Usuario";

jest.mock("../../../models/Usuario");

describe("ConcretePodcastBuilder", () => {
  let builder: ConcretePodcastBuilder;

  beforeEach(() => {
    builder = new ConcretePodcastBuilder();
    jest.clearAllMocks();
    (Professor.findById as jest.Mock).mockResolvedValue({ _id: "autorId" }); // Mock padrão autor válido
  });

  it("deve definir a imagem corretamente", async () => {
    builder.adicionarImagem("path/to/image.jpg");
    await builder.adicionarCamposTextuais("Titulo", "Descricao", "autorId");
    const podcast = builder.build();
    expect(podcast.imagem_path).toBe("path/to/image.jpg");
  });

  it("deve usar 'default_image' se imagem não for passada", async () => {
    builder.adicionarImagem(undefined);
    await builder.adicionarCamposTextuais("Titulo", "Descricao", "autorId");
    const podcast = builder.build();
    expect(podcast.imagem_path).toBe("default_image");
  });

  describe("adicionarCamposTextuais", () => {
    it("deve lançar erro se título for inválido", async () => {
      await expect(
        builder.adicionarCamposTextuais(undefined as any, "desc", "autorId")
      ).rejects.toThrow("Título não pode ser nulo ou indefinido.");
    });

    it("deve lançar erro se descrição for inválida", async () => {
      await expect(
        builder.adicionarCamposTextuais("Título", null as any, "autorId")
      ).rejects.toThrow("Descrição não pode ser nula ou indefinida.");
    });

    it("deve lançar erro se autor for inválido", async () => {
      await expect(
        builder.adicionarCamposTextuais("Título", "desc", null as any)
      ).rejects.toThrow("Autor não pode ser nulo ou indefinido.");
    });

    it("deve lançar erro se autor não for encontrado", async () => {
      (Professor.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        builder.adicionarCamposTextuais("Título", "desc", "autorId")
      ).rejects.toThrow("Autor não encontrado.");
    });

    it("deve adicionar os campos textuais corretamente", async () => {
      (Professor.findById as jest.Mock).mockResolvedValue({ _id: "autorId" });

      await builder.adicionarCamposTextuais("Título", "desc", "autorId");
      const podcast = builder.build();
      expect(podcast.titulo).toBe("Título");
      expect(podcast.descricao).toBe("desc");
      expect(podcast.autor).toBe("autorId");
    });
  });

  describe("adicionarCoAutores", () => {
    it("deve lançar erro se co_autores não for array não vazio", () => {
      expect(() => builder.adicionarCoAutores([])).toThrow(
        "Co-autores deve ser um array não vazio."
      );
      expect(() => builder.adicionarCoAutores(null as any)).toThrow(
        "Co-autores deve ser um array não vazio."
      );
    });

    it("deve adicionar co_autores corretamente", async () => {
      builder.adicionarCoAutores(["autor1", "autor2"]);
      // Preenche campos obrigatórios antes do build
      await builder.adicionarCamposTextuais("Título", "Descrição", "autorId");
      const podcast = builder.build();
      expect(podcast.co_autores).toEqual(["autor1", "autor2"]);
    });
  });

  describe("registrarTags", () => {
    it("deve lançar erro se tags não for string não vazia", () => {
      expect(() => builder.registrarTags("")).toThrow(
        "Tags devem ser uma string não vazia."
      );
      expect(() => builder.registrarTags(null as any)).toThrow(
        "Tags devem ser uma string não vazia."
      );
    });

    it("deve registrar as tags corretamente", async () => {
      builder.registrarTags("tag1, tag2 , ,tag3");
      // Preenche campos obrigatórios antes do build
      await builder.adicionarCamposTextuais("Título", "Descrição", "autorId");
      const podcast = builder.build();
      expect(podcast.tags).toEqual(["tag1", "tag2", "tag3"]);
    });
  });

  describe("build", () => {
    it("deve lançar erro se campos obrigatórios estiverem faltando", () => {
      expect(() => builder.build()).toThrow(
        "Erro interno: Podcast não foi construído corretamente."
      );
    });
  });
});
