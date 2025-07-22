export const handler = async (event: { text: string; s3Key: string }) => {
  const { text, s3Key } = event;

  try {
    if (!text) {
      return {
        status: 'ERROR',
        error: 'No text received',
        s3Key,
      };
    }

    const chunkSize = 1000;
    const chunks = [];

    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    return {
      status: 'SUCCESS',
      s3Key,
      chunks,
    };
  } catch (error) {
    return {
      status: 'ERROR',
      error: (error as Error).message,
      s3Key,
    };
  }
};
