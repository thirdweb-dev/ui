import { useThirdwebContext } from "@3rdweb/hooks";

export default function Example() {
  const context = useThirdwebContext();
  console.log("*** context", context);
  return (
    <div>
      <h1>Thirdweb Example</h1>
    </div>
  );
}
