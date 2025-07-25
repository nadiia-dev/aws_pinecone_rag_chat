import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const index = pinecone.Index("my-index");

async function getEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error fetching embedding:", error);
    return null;
  }
}

async function indexChunks(
  s3Key: string,
  embeddings: number[][],
  chunks: string[]
) {
  const vectors = embeddings.map((embedding, i) => ({
    id: `${s3Key}-chunk-${i}`,
    values: embedding,
    metadata: { s3Key, chunkIndex: i, text: chunks[i] },
  }));

  try {
    await index.upsert(vectors);
    return { s3Key, status: "SUCCESS", inserted: vectors.length };
  } catch (e) {
    console.error("Pinecone upsert error:", e);
    return { s3Key, status: "ERROR", error: (e as Error).message };
  }
}

export const handler = async (event: { s3Key: string; chunks: string[] }) => {
  const { s3Key, chunks } = event;

  try {
    const embeddings = await Promise.all(
      chunks.map((chunk) => getEmbedding(chunk))
    );

    const hasNulls = embeddings.some((emb) => emb === null);

    if (hasNulls || embeddings.some((e) => !Array.isArray(e))) {
      return {
        status: "ERROR",
        s3Key,
        error: "One or more embeddings failed to generate",
      };
    }

    const result = await indexChunks(s3Key, embeddings as number[][], chunks);

    if (result.status === "ERROR") {
      return result;
    }

    return {
      status: "SUCCESS",
      s3Key,
    };
  } catch (error) {
    return {
      status: "ERROR",
      s3Key,
      error: (error as Error).message,
    };
  }
};
