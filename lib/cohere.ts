import Cohere from 'cohere-ai';

export const cohereClient = new Cohere({
  token: process.env.COHERE_API_KEY || '',
});
