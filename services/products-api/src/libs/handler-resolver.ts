export const handlerPath = (context: string, path: string) => {
  return `${context
    .split(process.cwd())[1]
    .substring(1)
    .replace(/\\/g, "/")}/${path}`;
};
