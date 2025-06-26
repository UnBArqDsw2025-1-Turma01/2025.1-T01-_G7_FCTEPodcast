export interface NotificationType {
  _id: string;
  origem: {
    _id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  destino: {
    _id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  conteudo: string;
  lida: boolean;
  data: Date;
  episodio_referente?: {
    _id: string;
    titulo: string;
    descricao: string;
  };
}
