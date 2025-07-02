export interface ReferenceDataType {
  image_path: string;
  reference_data: {
    autor: {
      _id: string;
      nome: string;
      email: string;
    };
    titulo: string;
    descricao: string;
    tags: string[];
    autores: {
      _id: string;
      nome: string;
      email: string;
    }[];
  };
}
