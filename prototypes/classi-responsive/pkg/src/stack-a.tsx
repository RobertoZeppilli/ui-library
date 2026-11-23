import { classes } from "./classes";
type Bp = "initial" | "sm" | "md" | "lg" | "xl" | "2xl";
type R<T extends string> = T | Partial<Record<Bp, T>>;
type C = typeof classes;
function resolve<P extends keyof C>(p: P, v: R<string> | undefined): string[] {
  if (v === undefined) return [];
  const obj: Record<string, string> = typeof v === "string" ? { initial: v } : v;
  return Object.entries(obj).map(([bp, val]) => (classes[p] as any)[bp][val]);
}
export function StackA(props: { gap?: R<keyof C["gap"]["initial"]>; direction?: R<keyof C["direction"]["initial"]>; align?: R<keyof C["align"]["initial"]>; children?: React.ReactNode }) {
  const cls = ["flex", ...resolve("gap", props.gap as any), ...resolve("direction", props.direction as any), ...resolve("align", props.align as any)];
  return <div data-slot="stack" data-testid="stack-a" className={cls.join(" ")}>{props.children}</div>;
}
