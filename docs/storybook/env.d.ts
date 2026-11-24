declare module "*?raw" {
  const content: string;
  export default content;
}

// Vite's import.meta.glob, only the form the Storybook docs use.
interface ImportMeta {
  glob<T>(pattern: string, options: { query: string; import: string; eager: true }): Record<string, T>;
}
