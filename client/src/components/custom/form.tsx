import { FC, useState } from "react";
import { SubmissionFormSchema } from "@/models/Submission";
import type { SubmissionFormType } from "@/models/Submission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Editor from "@monaco-editor/react";
import { langOpts } from "@/@types/langOpts";
import { getLanguage } from "@/lib/code";
import { encode } from "js-base64";
import axios from "axios";

const languageOptions: langOpts = [
  {
    value: "76",
    label: "C++ (Clang 7.0.1)",
    lang: "cpp",
  },
  {
    value: "52",
    label: "C++ (GCC 7.4.0)",
    lang: "cpp",
  },
  {
    value: "53",
    label: "C++ (GCC 8.3.0)",
    lang: "cpp",
  },
  {
    value: "54",
    label: "C++ (GCC 9.2.0)",
    lang: "cpp",
  },
  {
    value: "62",
    label: "Java (OpenJDK 13.0.1)",
    lang: "java",
  },
  {
    value: "91",
    label: "Java (JDK 17.0.6)",
    lang: "java",
  },
  {
    value: "63",
    label: "JavaScript (Node.js 12.14.0)",
    lang: "javascript",
  },
  {
    value: "93",
    label: "JavaScript (Node.js 18.15.0)",
    lang: "javascript",
  },
  { value: "70", label: "Python (2.7.17)", lang: "python" },
  { value: "71", label: "Python (3.8.1)", lang: "python" },
  { value: "92", label: "Python (3.11.2)", lang: "python" },
];

const SubmissionForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<SubmissionFormType>({
    resolver: zodResolver(SubmissionFormSchema),
    defaultValues: {
      username: "",
      language_id: "92",
      source_code: "",
      stdin: "",
    },
  });
  const { toast } = useToast();

  const onSubmit = async (values: SubmissionFormType) => {
    const username = values.username;
    const language_id = parseInt(values.language_id);
    const source_code = encode(values.source_code);
    const stdin = encode(values.stdin);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/submissions`,
        {
          username,
          language_id,
          source_code,
          stdin,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        toast({
          title: "Submitted Successfully!",
          description: "Your code has been submitted successfully!",
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

    form.reset({
      username: "",
      language_id: "92",
      source_code: "",
      stdin: "",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <div className="flex items-center justify-start gap-6">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="prasadsawant7"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Code Language */}
          <FormField
            control={form.control}
            name="language_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Code Langauge</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={"92"}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select Code Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-leetcode-bg text-leetcode-fg">
                      {languageOptions.map((language) => (
                        <SelectItem
                          key={language.value}
                          value={language.value}
                        >
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Source Code */}
        <FormField
          control={form.control}
          name="source_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Code</FormLabel>
              <FormControl>
                <Editor
                  height="35vh"
                  key={
                    getLanguage(languageOptions, form.watch("language_id")) ||
                    "python"
                  }
                  defaultLanguage={
                    getLanguage(languageOptions, form.watch("language_id")) ||
                    "python"
                  }
                  defaultValue={
                    getLanguage(languageOptions, form.watch("language_id")) ===
                      "python" ||
                    getLanguage(languageOptions, form.watch("language_id")) ===
                      undefined
                      ? "# Write your python code here"
                      : `// Write you ${getLanguage(languageOptions, form.watch("language_id"))} code here`
                  }
                  value={field.value}
                  onChange={field.onChange}
                  theme="vs-dark"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Standard Input */}
        <FormField
          control={form.control}
          name="stdin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standard Input (stdin)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your standard input here"
                  className="h-20 w-full resize-none rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="rounded-md bg-white text-black hover:bg-leetcode-card hover:text-white"
          type="submit"
          size="lg"
          disabled={loading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SubmissionForm;
