export interface ComentarioType {
  _id: string;
  usuario: {
    _id: string;
    nome: string;
    email: string;
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
      __t: string; // Tipo de usuário, por exemplo, "ALUNO", "PROFESSOR", etc.
    };
  }[]; // Respostas a este comentário
  createdAt?: string; // Data de criação do comentário
  tag: string; // Tag do comentário, por exemplo, "comentario", "resposta", etc.
}
