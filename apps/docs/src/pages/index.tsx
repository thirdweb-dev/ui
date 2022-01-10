import { useIsomorphicLayoutEffect } from "@3rdweb/utils";

export default function Docs() {
  useIsomorphicLayoutEffect(() => {
    console.log("@3rdweb docs page");
  }, []);
  return (
    <div>
      <h1>@3rdweb Documentation</h1>
    </div>
  );
}
