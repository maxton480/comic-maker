// Main configuration file
const config = {
  fireworks: {
    apiKey: process.env.FIREWORKS_API_KEY || '',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
  }
};

module.exports = config;
