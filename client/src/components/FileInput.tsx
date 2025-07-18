import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  file: z.instanceof(FileList).optional(),
});

const FileInput = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("file");

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const file = data.file![0];
    if (file && file.size > 10 * 1024 * 1024) {
      toast("File is too big! Max 10MB.");
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full p-4 md:p-6"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FileInput;
