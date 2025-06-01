import Podcast from "../../models/Podcast";

// Interface que define os métodos para construir um Episódio
// O EpisodioBuilder é uma interface que define os métodos necessários para construir um Episódio.
// Ele permite que diferentes implementações de construtores de episódios sejam criadas,
// garantindo que todas sigam o mesmo contrato.
// Isso é útil para criar episódios de forma flexível e extensível, permitindo que diferentes
// implementações sejam usadas conforme necessário, sem alterar o código que consome o builder.
interface EpisodioBuilder {
  adicionarAudio(audio_path: string): void;
  adicionarCamposTextuais(titulo: string, descricao: string): void;
  adicionarPodcastReferencia(podcast_reference: string): Promise<void>;
  build(): EpisodioDTO;
}

// DTO (Data Transfer Object) para Episódio
// O EpisodioDTO é um objeto simples que transporta os dados do episódio.
// Ele contém os campos necessários para representar um episódio,
// como título, descrição, caminho do áudio e referência ao podcast.
// Ele é usado para transferir dados entre diferentes camadas da aplicação,
// como entre o builder e o serviço ou controlador que manipula os episódios.
// Ele é uma representação simplificada do episódio, sem lógica de negócios,
// focando apenas nos dados necessários para a criação e manipulação do episódio.
// Ele é útil para garantir que os dados sejam consistentes e fáceis de manipular,
// além de facilitar a serialização e desserialização dos dados ao serem enviados ou recebidos pela API.
type EpisodioDTO = {
  titulo: string;
  descricao: string;
  audio_path: string;
  podcast_reference: string;
};

// Classe concreta que implementa o EpisodioBuilder
// A ConcreteEpisodioBuilder é uma implementação concreta da interface EpisodioBuilder.
// Ela fornece a lógica específica para construir um episódio, implementando os métodos definidos na interface.
// Ela encapsula a lógica de validação e construção do episódio, garantindo que todos os campos necessários sejam preenchidos corretamente.
// Ela também lida com a validação da referência ao podcast, garantindo que o podcast exista antes de associá-lo ao episódio.
export class ConcreteEpisodioBuilder implements EpisodioBuilder {
  private episodio: EpisodioDTO | null = null;

  constructor() {
    this.episodio = {
      titulo: "",
      descricao: "",
      audio_path: "",
      podcast_reference: "",
    };
  }

  public adicionarAudio(audio_path: string): void {
    if (!audio_path) {
      throw new Error(
        "Erro interno: Caminho do áudio não pode ser nulo ou indefinido."
      );
    }
    this.episodio!.audio_path = audio_path;
  }

  public adicionarCamposTextuais(titulo: string, descricao: string): void {
    if (!titulo) {
      throw new Error("Título não pode ser nulo ou indefinido.");
    }
    if (!descricao) {
      throw new Error("Descrição não pode ser nula ou indefinida.");
    }

    this.episodio!.titulo = titulo;
    this.episodio!.descricao = descricao;
  }

  public async adicionarPodcastReferencia(
    podcast_reference: string
  ): Promise<void> {
    if (!podcast_reference) {
      throw new Error("Referência do podcast não pode ser nula ou indefinida.");
    }

    const podcastExiste = await Podcast.findById(podcast_reference);
    if (!podcastExiste) {
      throw new Error("Podcast não encontrado.");
    }

    this.episodio!.podcast_reference = podcastExiste.id;
  }

  public build(): EpisodioDTO {
    if (!this.episodio) {
      throw new Error(
        "Erro interno: Episódio não foi inicializado corretamente."
      );
    }
    return this.episodio;
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
