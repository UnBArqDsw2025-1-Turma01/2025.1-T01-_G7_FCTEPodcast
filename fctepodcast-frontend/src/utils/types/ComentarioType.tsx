export interface ComentarioType {
  _id: string;
  usuario: {
    _id: string;
    nome: string;
    email: string;
    profile_picture?: string; // URL da imagem de perfil do usuário
  };
  conteudo: string;
  episodio: string; // ID do episódio ao qual o comentário pertence
  respostas: {
    tag: string;
    conteudo: string;
    createdAt: string;
    usuario: {
      _id: string;
      nome: string;
      email: string;
      __t: string;
    };
  }[]; // Respostas a este comentário
  createdAt?: string; // Data de criação do comentário
  tag: string;
}
