/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConcreteEpisodioBuilder } from "../../../builder/Episodio/EpisodioBuilder";
import Podcast from "../../../models/Podcast";

jest.mock("../../../models/Podcast");

describe("ConcreteEpisodioBuilder", () => {
  let builder: ConcreteEpisodioBuilder;

  beforeEach(() => {
    builder = new ConcreteEpisodioBuilder();
    jest.clearAllMocks();
  });

  describe("adicionarAudio", () => {
    it("deve lançar erro se audio_path for nulo ou indefinido", () => {
      expect(() => builder.adicionarAudio("")).toThrow(
        "Erro interno: Caminho do áudio não pode ser nulo ou indefinido."
      );
      expect(() => builder.adicionarAudio(undefined as any)).toThrow(
        "Erro interno: Caminho do áudio não pode ser nulo ou indefinido."
      );
    });

    it("deve definir o audio_path corretamente", () => {
      builder.adicionarAudio("path/to/audio.mp3");
      const episodio = builder.build();
      expect(episodio.audio_path).toBe("path/to/audio.mp3");
    });
  });

  describe("adicionarCamposTextuais", () => {
    it("deve lançar erro se título for nulo ou indefinido", () => {
      expect(() => builder.adicionarCamposTextuais("", "descrição")).toThrow(
        "Título não pode ser nulo ou indefinido."
      );
      expect(() =>
        builder.adicionarCamposTextuais(undefined as any, "descrição")
      ).toThrow("Título não pode ser nulo ou indefinido.");
    });

    it("deve lançar erro se descrição for nula ou indefinida", () => {
      expect(() => builder.adicionarCamposTextuais("Título", "")).toThrow(
        "Descrição não pode ser nula ou indefinida."
      );
      expect(() =>
        builder.adicionarCamposTextuais("Título", undefined as any)
      ).toThrow("Descrição não pode ser nula ou indefinida.");
    });

    it("deve definir titulo e descricao corretamente", () => {
      builder.adicionarCamposTextuais("Título", "Descrição");
      const episodio = builder.build();
      expect(episodio.titulo).toBe("Título");
      expect(episodio.descricao).toBe("Descrição");
    });
  });

  describe("adicionarPodcastReferencia", () => {
    it("deve lançar erro se referência for nula ou indefinida", async () => {
      await expect(builder.adicionarPodcastReferencia("")).rejects.toThrow(
        "Referência do podcast não pode ser nula ou indefinida."
      );

      await expect(
        builder.adicionarPodcastReferencia(undefined as any)
      ).rejects.toThrow(
        "Referência do podcast não pode ser nula ou indefinida."
      );
    });

    it("deve lançar erro se podcast não for encontrado", async () => {
      (Podcast.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        builder.adicionarPodcastReferencia("id_invalido")
      ).rejects.toThrow("Podcast não encontrado.");
    });

    it("deve definir podcast_reference corretamente", async () => {
      (Podcast.findById as jest.Mock).mockResolvedValue({ id: "podcast123" });
      await builder.adicionarPodcastReferencia("podcast123");
      const episodio = builder.build();
      expect(episodio.podcast_reference).toBe("podcast123");
    });
  });

  describe("build", () => {
    it("deve lançar erro se episodio não estiver inicializado", () => {
      // Para forçar esse erro, vamos setar episodio como null (hack)
      (builder as any).episodio = null;
      expect(() => builder.build()).toThrow(
        "Erro interno: Episódio não foi inicializado corretamente."
      );
    });
  });
});
