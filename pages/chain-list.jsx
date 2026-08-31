import { useEffect } from "react";

export default function ChainListPage() {
  useEffect(() => {
    require("../src/chain-list");
  }, []);

  return (
    <div>
      <div id="zunia-not-installed" style={{ display: "none" }}>
        Install Zunia to add chains
      </div>
      <div id="registred-buttons" />
      <div id="chain-list" />
      <div id="loading" style={{ display: "none" }}>
        loading
      </div>
    </div>
  );
}
