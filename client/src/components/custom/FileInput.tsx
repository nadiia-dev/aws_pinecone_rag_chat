import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { generatePresignedUrl, uploadFile } from "@/api";
import { useAuthStore } from "@/store/auth";
import { useFileStore } from "@/store/file";

const formSchema = z.object({
  file: z.instanceof(FileList).optional(),
});

const FileInput = () => {
  const { file, setFile, fileData, setFileData } = useFileStore();
  const { email } = useAuthStore();
  const isDisabled = file ? true : false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("file");

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast("No file selected!");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("File is too big! Max 10MB.");
      return;
    }
    try {
      const presignedUrl = await generatePresignedUrl(
        file.name,
        file.type,
        email
      );
      const url = `https://${import.meta.env.VITE_BUCKET}.s3.${
        import.meta.env.VITE_REGION
      }.amazonaws.com/${presignedUrl?.key}`;
      setFileData({
        presignedUrl: presignedUrl.presignedUrl,
        fileUrl: url,
        key: presignedUrl.key,
      });
    } catch (e) {
      if (e instanceof Error) {
        toast("Failed to get upload URL");
      }
    }
  };

  const onSubmit = async () => {
    if (!fileData.presignedUrl || !fileData.key) {
      toast("No presigned URL available. Please select a file first.");
      return;
    }
    try {
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (!file) {
        toast("No file selected!");
        return;
      }

      const uploadedFile = await uploadFile(
        fileData.presignedUrl,
        email!,
        file,
        fileData.key
      );
      if (uploadedFile) {
        setFile(uploadedFile);
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Something went wrong during upload.");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full py-4 md:py-6"
      >
        <FormField
          control={form.control}
          name="file"
          render={() => {
            return (
              <FormItem className="flex flex-col gap-2 mb-4">
                <FormLabel>Upload your file</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="Select your file"
                    accept="application/pdf"
                    {...fileRef}
                    onChange={(e) => onFileChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" disabled={isDisabled}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FileInput;
