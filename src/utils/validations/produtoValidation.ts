import * as yup from 'yup';

export const createProdutoSchema = yup.object().shape({
  body: yup.object({
    nome: yup.string().required('O nome do produto é obrigatório'),
    descricao: yup.string().required('A descrição do produto é obrigatória'),
    preco: yup.number().required('O preço do produto é obrigatório').positive(),
    quantidadeEmEstoque: yup
      .number()
      .required('A quantidade de estoque do produto é obrigatório')
      .min(0),
  }),
});

export const updateProdutoSchema = yup.object().shape({
  body: yup.object({
    nome: yup.string(),
    descricao: yup.string(),
    preco: yup.number().positive(),
    quantidadeEmEstoque: yup.number().min(0),
  }),
});
