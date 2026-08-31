import { Window as CosmosWalletWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends CosmosWalletWindow {
    zunia?: CosmosWalletWindow["keplr"];
  }
}
