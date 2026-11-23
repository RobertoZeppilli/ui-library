import { jsx } from "react/jsx-runtime";
// src/stack-b.tsx
const gapCls = {
	initial: "gap-(--st-gap)",
	sm: "sm:gap-(--st-gap-sm)",
	md: "md:gap-(--st-gap-md)",
	lg: "lg:gap-(--st-gap-lg)",
	xl: "xl:gap-(--st-gap-xl)",
	"2xl": "2xl:gap-(--st-gap-2xl)"
};
const dirCls = {
	initial: "[flex-direction:var(--st-dir)]",
	sm: "sm:[flex-direction:var(--st-dir-sm)]",
	md: "md:[flex-direction:var(--st-dir-md)]",
	lg: "lg:[flex-direction:var(--st-dir-lg)]",
	xl: "xl:[flex-direction:var(--st-dir-xl)]",
	"2xl": "2xl:[flex-direction:var(--st-dir-2xl)]"
};
function apply(v, cls, name, toCss, out) {
	if (v === void 0) return;
	const obj = typeof v === "string" ? { initial: v } : v;
	for (const [bp, val] of Object.entries(obj)) {
		out.c.push(cls[bp]);
		out.s[bp === "initial" ? `--st-${name}` : `--st-${name}-${bp}`] = toCss(val);
	}
}
function StackB(props) {
	const out = {
		c: ["flex"],
		s: {}
	};
	apply(props.gap, gapCls, "gap", (v) => `calc(var(--spacing) * ${v})`, out);
	apply(props.direction, dirCls, "dir", (v) => v, out);
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "stack",
		"data-testid": "stack-b",
		className: out.c.join(" "),
		style: out.s,
		children: props.children
	});
}
export { StackB };
