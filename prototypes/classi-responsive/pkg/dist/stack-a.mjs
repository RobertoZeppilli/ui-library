import { classes } from "./classes.mjs";
import { jsx } from "react/jsx-runtime";
// src/stack-a.tsx
function resolve(p, v) {
	if (v === void 0) return [];
	return Object.entries(typeof v === "string" ? { initial: v } : v).map(([bp, val]) => classes[p][bp][val]);
}
function StackA(props) {
	const cls = [
		"flex",
		...resolve("gap", props.gap),
		...resolve("direction", props.direction),
		...resolve("align", props.align)
	];
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "stack",
		"data-testid": "stack-a",
		className: cls.join(" "),
		children: props.children
	});
}
export { StackA };
