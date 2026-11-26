import { Button } from "./button";

// Type-level test, checked by `pnpm typecheck`: if either prop became valid, the directive would be unused and tsc would fail.
// @ts-expect-error asChild is not supported, polymorphism goes through `render`
export const withAsChild = <Button asChild>x</Button>;
// @ts-expect-error `as` is not supported, polymorphism goes through `render`
export const withAs = <Button as="a">x</Button>;
