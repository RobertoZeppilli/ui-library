import { StackA, StackB } from "trama-proto";
const Box = () => <div style={{ width: 40, height: 40, background: "tomato" }} />;
export default function Page() {
  return (
    <main>
      <StackA gap={{ initial: "2", md: "8" }} direction={{ initial: "column", md: "row" }}><Box /><Box /><Box /></StackA>
      <hr />
      <StackB gap={{ initial: "2", md: "8" }} direction={{ initial: "column", md: "row" }}><Box /><Box /><Box /></StackB>
    </main>
  );
}
