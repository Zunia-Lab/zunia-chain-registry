import { ChainInfo, Keplr } from "@keplr-wallet/types";
import { Wallet } from "./types";

type WalletProvider = Keplr;

function getProviderFromWindow(): WalletProvider | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  // Prefer Zunia; fall back to compatible providers
  const w = window as Window & {
    zunia?: Keplr;
    keplr?: Keplr;
  };
  return w.zunia ?? w.keplr;
}

/** Resolves the installed Zunia (or compatible) wallet provider. */
export const getWalletFromWindow: () => Promise<
  WalletProvider | undefined
> = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const existing = getProviderFromWindow();
  if (existing) {
    return existing;
  }

  if (document.readyState === "complete") {
    return getProviderFromWindow();
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        resolve(getProviderFromWindow());
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};

/** @deprecated Use getWalletFromWindow */
export const getKeplrFromWindow = getWalletFromWindow;

export class ZuniaWallet implements Wallet {
  constructor(public readonly provider: WalletProvider) {}

  getChainInfosWithoutEndpoints(): Promise<
    (Pick<ChainInfo, "chainId" | "chainName" | "bech32Config"> & {
      readonly isEthermintLike?: boolean;
    })[]
  > {
    return this.provider.getChainInfosWithoutEndpoints().then((chainInfos) => {
      return chainInfos.map((chainInfo) => {
        return {
          ...chainInfo,
          isEthermintLike:
            chainInfo.features?.includes("eth-address-gen") ||
            chainInfo.features?.includes("eth-key-sign"),
        };
      });
    });
  }

  suggestChain(chainInfo: ChainInfo): Promise<void> {
    return this.provider.experimentalSuggestChain(chainInfo);
  }

  init(chainIds: string[]): Promise<void> {
    return this.provider.enable(chainIds);
  }
}

/** @deprecated Use ZuniaWallet */
export class KeplrWallet extends ZuniaWallet {}
