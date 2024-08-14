import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória'),
  name: yup.string().required('O nome é obrigatório'),
  tipo: yup
    .mixed()
    .oneOf(['Admin', 'Cliente'], 'Tipo de usuário inválido')
    .required('O tipo de usuário é obrigatório'),
});
