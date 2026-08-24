import config from './knexfile.js';

const environment = process.env.NODE_ENV || 'production';
const dbConfig = config[environment || 'production'];

export default dbConfig;