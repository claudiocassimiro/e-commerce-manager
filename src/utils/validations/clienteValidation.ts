import * as yup from 'yup';

export const createClienteSchema = yup.object({
  body: yup.object({
    nomeCompleto: yup.string().required('Nome completo é obrigatório'),
    contato: yup.string().required('Contato é obrigatório'),
    endereco: yup.string().required('Endereço é obrigatório'),
    status: yup.boolean().required('Status é obrigatório'),
    usuarioId: yup.string().required('ID do usuário é obrigatório'),
  }),
});

export const updateClienteSchema = yup.object({
  body: yup.object({
    nomeCompleto: yup.string().optional(),
    contato: yup.string().optional(),
    endereco: yup.string().optional(),
    status: yup.boolean().optional(),
  }),
});

export const getClienteByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid('ID inválido').required('ID é obrigatório'),
  }),
});

export const deleteClienteSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid('ID inválido').required('ID é obrigatório'),
  }),
});

export const getClientesSchema = yup.object({
  query: yup.object({
    nomeCompleto: yup.string().optional(),
    status: yup.boolean().optional(),
  }),
});
