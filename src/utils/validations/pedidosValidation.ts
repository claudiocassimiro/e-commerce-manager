import * as yup from 'yup';
import { StatusPedido } from '@prisma/client';

export const createPedidoSchema = yup.object({
  body: yup.object({
    idCliente: yup
      .string()
      .uuid('ID de cliente inválido')
      .required('ID do cliente é obrigatório'),
    itens: yup
      .array()
      .of(
        yup.object({
          idProduto: yup
            .string()
            .uuid('ID de produto inválido')
            .required('ID do produto é obrigatório'),
          quantidade: yup
            .number()
            .min(1, 'Quantidade mínima é 1')
            .required('Quantidade é obrigatória'),
          precoPorUnidade: yup
            .number()
            .min(0, 'preço mínimo é 0')
            .required('Preço por unidade é obrigatório'),
          subtotal: yup
            .number()
            .min(0, 'subtotal mínimo é 0')
            .required('Subtotal é obrigatório'),
        }),
      )
      .min(1, 'É necessário adicionar ao menos um item no pedido')
      .required('Itens do pedido são obrigatórios'),
    status: yup
      .mixed<StatusPedido>()
      .oneOf(Object.values(StatusPedido), 'Status do pedido inválido')
      .default(StatusPedido.RECEBIDO),
  }),
});

export const updatePedidoSchema = yup.object({
  body: yup.object({
    status: yup
      .mixed<StatusPedido>()
      .oneOf(Object.values(StatusPedido), 'Status do pedido inválido'),
    itens: yup
      .array()
      .of(
        yup.object({
          idProduto: yup
            .string()
            .uuid('ID de produto inválido')
            .required('ID do produto é obrigatório'),
          quantidade: yup
            .number()
            .min(1, 'Quantidade mínima é 1')
            .required('Quantidade é obrigatória'),
          precoPorUnidade: yup
            .number()
            .min(0, 'preço mínimo é 0')
            .required('Preço por unidade é obrigatório'),
          subtotal: yup
            .number()
            .min(0, 'subtotal mínimo é 0')
            .required('Subtotal é obrigatório'),
        }),
      )
      .min(1, 'É necessário adicionar ao menos um item no pedido')
      .optional(),
  }),
  params: yup.object({
    id: yup
      .string()
      .uuid('ID do pedido inválido')
      .required('ID do pedido é obrigatório'),
  }),
});

export const getPedidosSchema = yup.object({
  query: yup.object({
    status: yup
      .mixed<StatusPedido>()
      .oneOf(Object.values(StatusPedido), 'Status do pedido inválido')
      .optional(),
    idCliente: yup.string().uuid('ID de cliente inválido').optional(),
  }),
});
