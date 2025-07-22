import { toast } from "sonner";

export const uploadFile = async (
  presignedUrl: string,
  userEmail: string,
  file: File,
  key: string
) => {
  try {
    console.log(presignedUrl);
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

    const newFile = await apiRes.json();
    toast.success("File was uploaded successfully!");
    return newFile;
  } catch (e) {
    if (e instanceof Error) toast.error(e.message);
    return null;
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

export const listFiles = async (email: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/files?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      const text = await res.text();
      toast(`Non-OK response: ${res.status}, ${text} `);
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

export const deleteFile = async (id: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/files/${id}`, {
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
