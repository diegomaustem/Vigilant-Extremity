import config from '../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment || 'development'];

export default dbConfig;