import { langOpts } from "@/@types/langOpts";

export const getLanguage = (
  languages: langOpts,
  value: string
): string | undefined => {
  for (let i = 0; i < languages.length; i++) {
    if (languages[i].value === value) {
      return languages[i].lang;
    }
  }
  return undefined;
};
