export const handler = (event: { text: string }) => {
  const { text } = event;

  if (!text) throw new Error('No text received');

  const firstWord = text.trim().split(/\s+/)[0];

  console.log('First word:', firstWord);

  return {
    status: 'SUCCESS',
    chunkPreview: firstWord,
  };
};
