import { useEffect, useState } from "react";
import { ChainInfo } from "@keplr-wallet/types";
import { getWalletFromWindow, ZuniaWallet } from "../wallet";
import { ChainItem } from "../components/chain-item";

interface ChainsResponse {
  chains: ChainInfo[];
}

type DisplayType = "normal" | "registered";

export type DisplayChainInfo = ChainInfo & { displayType: DisplayType };

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [wallet, setWallet] = useState<ZuniaWallet>();
  const [isExist, setIsExist] = useState<boolean>();
  const [chainInfos, setChainInfos] = useState<DisplayChainInfo[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const chainIds = await checkWallet();
      await fetchChains(chainIds);
    } catch (e) {
      console.error(e);
    }
  };

  const checkWallet = async () => {
    const provider = await getWalletFromWindow();

    if (provider === undefined) {
      setIsExist(false);
      return;
    }

    setIsExist(true);

    const wallet = new ZuniaWallet(provider);
    setWallet(wallet);

    const chainIds = (await wallet.getChainInfosWithoutEndpoints()).map(
      (c) => c.chainId,
    );

    await wallet.init(chainIds);

    return chainIds;
  };

  const fetchChains = async (chainIds: string[] | undefined) => {
    const chainsResponse: ChainsResponse = await (
      await fetch("/api/chains")
    ).json();

    const registeredChainInfos = chainsResponse.chains;

    const displayChainInfo: DisplayChainInfo[] = registeredChainInfos.map(
      (chainInfo) => {
        if (chainIds?.includes(chainInfo.chainId)) {
          return { ...chainInfo, displayType: "registered" };
        }

        return { ...chainInfo, displayType: "normal" };
      },
    );

    setChainInfos(displayChainInfo);
  };

  const onClickChainItem = async (chainInfo: ChainInfo) => {
    await wallet?.suggestChain(chainInfo);
  };

  return (
    <div>
      <input
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        placeholder="Search chains"
      />
      {!isExist ? (
        <div>
          Install{" "}
          <a href="https://github.com/Zunia-Lab/zunia-extension">Zunia</a>
        </div>
      ) : null}
      {chainInfos
        .filter(
          (chainInfo) =>
            chainInfo.chainId.toLowerCase().includes(search.toLowerCase()) ||
            chainInfo.chainName.toLowerCase().includes(search.toLowerCase()),
        )
        .map((chainInfo) => (
          <ChainItem
            key={chainInfo.chainId}
            chainItem={chainInfo}
            onClick={onClickChainItem}
          />
        ))}
    </div>
  );
}
