export interface ReferenceDataType {
  image_path: string;
  reference_data: {
    autor: {
      nome: string;
      email: string;
    };
    titulo: string;
    descricao: string;
    tags: string[];
    autores: {
      nome: string;
      email: string;
    }[];
  };
}
