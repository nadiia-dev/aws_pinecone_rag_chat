export const handler = async (event: { text: string; s3Key: string }) => {
  const { text, s3Key } = event;

  try {
    if (!text) {
      return {
        status: "ERROR",
        error: "No text received",
        s3Key,
      };
    }

    const sentences = text.split(/(?<=[.?!])\s+/);
    const chunks: string[] = [];

    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > 1000) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += " " + sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    return {
      status: "SUCCESS",
      s3Key,
      chunks,
    };
  } catch (error) {
    return {
      status: "ERROR",
      error: (error as Error).message,
      s3Key,
    };
  }
};
