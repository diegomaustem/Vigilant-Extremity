import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;
const jwtDuration = process.env.JWT_DURATION;

if (!jwtSecret) {
  throw new Error('ERRO CRÍTICO: A variável de ambiente JWT_SECRET não foi definida!');
}

if (!jwtDuration) {
  throw new Error('ERRO CRÍTICO: A variável de ambiente JWT_DURATION não foi definida!');
}

export const ENV = {
  JWT_SECRET: jwtSecret,
  JWT_DURATION: Number(jwtDuration),
};