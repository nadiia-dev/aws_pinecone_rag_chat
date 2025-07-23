import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error fetching embedding:', error);
    return null;
  }
}

export const handler = async (event: { s3Key: string; chunks: string[] }) => {
  const { s3Key, chunks } = event;

  try {
    const embeddings = await Promise.all(
      chunks.map((chunk) => getEmbedding(chunk)),
    );

    const hasNulls = embeddings.some((emb) => emb === null);

    if (hasNulls) {
      return {
        status: 'ERROR',
        s3Key,
        error: 'One or more embeddings failed to generate',
      };
    }

    return {
      status: 'SUCCESS',
      s3Key,
      embeddings: embeddings as number[][],
    };
  } catch (error) {
    return {
      status: 'ERROR',
      s3Key,
      error: (error as Error).message,
    };
  }
};
