import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  password: yup.string().required('A senha é obrigatória'),
});
