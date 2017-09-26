const nodeEnv = process.env.NODE_ENV || 'development';

const isProduction = nodeEnv === 'production';

exports = module.exports = isProduction;
