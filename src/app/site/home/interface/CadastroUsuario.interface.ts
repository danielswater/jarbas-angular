export interface CadastroUsuario {
  bairro: string;
  cep: string;
  cidade: string;
  complemento: string;
  cpf_cnpj: string;
  email: string;
  endereco: string;
  estado: string;
  nome_fantasia: string;
  nome_responsavel: string;
  numero: string;
  razao_social: string;
  senha: string;
  telefone_estabelecimento: string;
  telefone_responsavel: string;
  coordenadas?: firebase.default.firestore.GeoPoint;
}
