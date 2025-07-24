import { toast } from "sonner";

export const uploadFile = async (
  presignedUrl: string,
  userEmail: string,
  file: File,
  key: string
) => {
  try {
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
    });
    if (!res.ok) throw new Error("Upload to S3 failed");

    const apiRes = await fetch(`${import.meta.env.VITE_API_URL}/files/upload`, {
      method: "POST",
      body: JSON.stringify({
        userEmail,
        fileName: file.name,
        s3Key: key,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!apiRes.ok) throw new Error("Failed to save metadata");

    toast.success("File was uploaded successfully!");
    return await apiRes.json();
  } catch (e) {
    if (e instanceof Error) toast.error(e.message);
  }
};

export const generatePresignedUrl = async (
  name: string,
  type: string,
  userEmail: string
) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/files/generate-presigned-url`,
      {
        method: "POST",
        body: JSON.stringify({ fileName: name, fileType: type, userEmail }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

export const listFiles = async (s3Key: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/files/uploaded/${s3Key}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      const text = await res.text();
      toast.error(`Non-OK response: ${res.status}, ${text} `);
    }

    const contentLength = res.headers.get("Content-Length");
    const isEmpty = res.status === 204 || contentLength === "0";

    if (isEmpty) {
      return null;
    }

    return await res.json();
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

export const deleteFile = async (s3Key: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/files/${s3Key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

export const fetchStatus = async (s3Key: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/files/${s3Key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      toast.error(`Request failed with status ${res.status}`);
      return null;
    }
    const data = await res.text();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

export const sendMessage = async (sender: string, message: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/send`, {
      method: "POST",
      body: JSON.stringify({ sender, message }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error status: ${res.status}`);
    }

    const data = await res.text();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};
