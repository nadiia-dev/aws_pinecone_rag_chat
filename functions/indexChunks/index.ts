import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const index = pinecone.Index('my-index');

export const handler = async (event: {
  s3Key: string;
  embeddings: number[][];
}) => {
  const { s3Key, embeddings } = event;

  const vectors = embeddings.map((embedding, i) => ({
    id: `${s3Key}-chunk-${i}`,
    values: embedding,
    metadata: { s3Key, chunkIndex: i },
  }));

  try {
    await index.upsert(vectors);
    return { s3Key, status: 'SUCCESS', inserted: vectors.length };
  } catch (e) {
    console.error('Pinecone upsert error:', e);
    return { s3Key, status: 'ERROR', error: (e as Error).message };
  }
};
