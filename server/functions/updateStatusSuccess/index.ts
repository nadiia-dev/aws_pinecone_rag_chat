type ReturnType = {
  message: string;
  staus: string;
};

export const handler = async (event: {
  s3Key: string;
  inserted: number;
  status: string;
}) => {
  const { s3Key } = event;
  try {
    const res = await fetch(`${process.env.SERVER_URL}/files/update`, {
      method: 'PATCH',
      body: JSON.stringify({ s3Key, status: 'SUCCESS' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      return (await res.json()) as ReturnType;
    } else {
      return {
        status: 'ERROR',
        error: `Request failed with status ${res.status}`,
      };
    }
  } catch (e) {
    return { status: 'ERROR', error: (e as Error).message };
  }
};
