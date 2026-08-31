function parse(chainId) {
  // Special-case injective testnets for chain-identifier parsing.
  if (chainId === "injective-777" || chainId === "injective-888") {
    return {
      identifier: chainId,
      version: 0,
    };
  }

  const split = chainId.split(/(.+)-([\d]+)/).filter(Boolean);

  if (split.length !== 2) {
    return {
      identifier: chainId,
      version: 0,
    };
  } else {
    return { identifier: split[0], version: parseInt(split[1]) };
  }
}

const getWalletFromWindow = async () => {
  const provider = () => window.zunia || window.keplr;

  if (provider()) {
    return provider();
  }

  if (document.readyState === "complete") {
    return provider();
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        resolve(provider());
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};

async function init() {
  const wallet = await getWalletFromWindow();

  const notInstalledDiv = document.getElementById("zunia-not-installed");
  if (notInstalledDiv) {
    notInstalledDiv.style.display = "none";
  }

  const loadingDiv = document.getElementById("loading");
  loadingDiv.style.display = "flex";

  const response = await fetch("/api/chains");
  const _chainInfos = await response.json();
  const chainInfos = _chainInfos.chains.filter((chainInfo) => {
    return !chainInfo.hideInUI;
  });

  const isOnMobile = /ZuniaWalletMobile|Android|iPhone/g.test(
    navigator.userAgent,
  );

  let registeredChainIds = [];
  if (wallet) {
    const registeredResponse = await wallet.getChainInfosWithoutEndpoints();
    registeredChainIds = registeredResponse.map(
      (chainInfo) => parse(chainInfo.chainId).identifier,
    );
  } else {
    registeredChainIds = chainInfos
      .filter((chainInfo) => !chainInfo.nodeProvider)
      .map((chainInfo) => parse(chainInfo.chainId).identifier);
  }

  removeChainListChild();

  const filteredChainInfos = chainInfos
    .filter(
      (chainInfo) =>
        !registeredChainIds.includes(parse(chainInfo.chainId).identifier),
    )
    .filter((chainInfo) => {
      if (isOnMobile) {
        return !chainInfo.chainId.startsWith("eip155:");
      } else {
        return true;
      }
    });

  const registeredChainInfos = chainInfos
    .filter((chainInfo) => chainInfo.nodeProvider)
    .filter((chainInfo) =>
      registeredChainIds.includes(parse(chainInfo.chainId).identifier),
    )
    .filter((chainInfo) => {
      if (isOnMobile) {
        return !chainInfo.chainId.startsWith("eip155:");
      } else {
        return true;
      }
    });

  if (filteredChainInfos.length > 0) {
    filteredChainInfos.map((chainInfo) => {
      return createChainItem(chainInfo, wallet);
    });

    registeredChainInfos.map((chainInfo) => {
      return createChainItem(chainInfo, wallet, true);
    });
  } else {
    const addedAllChainDiv = document.createElement("div");
    addedAllChainDiv.className = "added-all-chain";
    addedAllChainDiv.style.display = "flex";

    const descriptionText = document.createTextNode("You added all chains");
    addedAllChainDiv.appendChild(descriptionText);

    const chainListDiv = document.getElementById("chain-list");
    chainListDiv.appendChild(addedAllChainDiv);
  }

  loadingDiv.style.display = "none";
}

function removeChainListChild() {
  const chainListDiv = document.getElementById("chain-list");
  while (chainListDiv.firstChild) {
    chainListDiv.removeChild(chainListDiv.lastChild);
  }
}

function createChainItem(chainInfo, wallet, registered) {
  const chainItemDiv = document.createElement("div");
  chainItemDiv.className = "chain-item";

  createChainSymbol(chainItemDiv, chainInfo);
  createChainName(chainItemDiv, chainInfo);
  createChainCurrency(chainItemDiv, chainInfo);
  createNodeProvider(chainItemDiv, chainInfo);
  if (registered) {
    createRegisteredButton(chainItemDiv);
  } else {
    createRegisterButton(chainItemDiv, chainInfo, wallet);
  }

  const chainListDiv = document.getElementById("chain-list");
  chainListDiv.appendChild(chainItemDiv);
}

function createChainSymbol(chainItemDiv, chainInfo) {
  const chainSymbolImg = document.createElement("img");
  chainSymbolImg.className = "chain-symbol";
  chainSymbolImg.src = chainInfo.chainSymbolImageUrl;

  chainItemDiv.appendChild(chainSymbolImg);
}

function createChainName(chainItemDiv, chainInfo) {
  const chainNameDiv = document.createElement("div");
  chainNameDiv.className = "chain-name";

  const chainNameText = document.createTextNode(chainInfo.chainName);
  chainNameDiv.appendChild(chainNameText);

  chainItemDiv.appendChild(chainNameDiv);
}

function createChainCurrency(chainItemDiv, chainInfo) {
  const chainCurrencyDiv = document.createElement("div");
  chainCurrencyDiv.className = "chain-currency";

  const chainCurrency = chainInfo.stakeCurrency
    ? chainInfo.stakeCurrency
    : chainInfo.currencies[0];

  const chainCurrencyText = document.createTextNode(chainCurrency.coinDenom);
  chainCurrencyDiv.appendChild(chainCurrencyText);

  chainItemDiv.appendChild(chainCurrencyDiv);
}

function createNodeProvider(chainItemDiv, chainInfo) {
  if (chainInfo.nodeProvider) {
    const nodeProviderDiv = document.createElement("div");
    nodeProviderDiv.className = "node-provider";

    const providerLinkA = document.createElement("a");
    providerLinkA.className = "provider-link";

    providerLinkA.href = chainInfo.nodeProvider.website;
    providerLinkA.target = "_blank";

    const providerNameText = document.createTextNode(
      chainInfo.nodeProvider.name,
    );
    providerLinkA.appendChild(providerNameText);

    const providerContactDiv = document.createElement("div");
    providerContactDiv.className = "provider-email";

    const isEmail = chainInfo.nodeProvider.email != null;
    const isDiscord = chainInfo.nodeProvider.discord != null;

    const providerContactText = document.createTextNode(
      isEmail
        ? chainInfo.nodeProvider.email
        : isDiscord
          ? chainInfo.nodeProvider.discord
          : "",
    );
    providerContactDiv.appendChild(providerContactText);
    providerContactDiv.onclick = function () {
      window.location = isEmail
        ? `mailto:${chainInfo.nodeProvider.email}`
        : isDiscord
          ? chainInfo.nodeProvider.discord
          : "";
    };

    nodeProviderDiv.appendChild(providerLinkA);
    nodeProviderDiv.appendChild(providerContactDiv);

    chainItemDiv.appendChild(nodeProviderDiv);
  } else {
    const nodeProviderDiv = document.createElement("div");
    nodeProviderDiv.className = "native-node-provider";

    const providerNameText = document.createTextNode("Zunia Node");
    nodeProviderDiv.appendChild(providerNameText);

    chainItemDiv.appendChild(nodeProviderDiv);
  }
}

function createRegisterButton(chainItemDiv, chainInfo, wallet) {
  const registerButton = document.createElement("button");
  registerButton.className = "chain-register";

  const registerButtonText = document.createTextNode("Add to Zunia");
  registerButton.appendChild(registerButtonText);

  registerButton.onclick = async () => {
    try {
      const provider = wallet || window.zunia || window.keplr;
      if (provider) {
        registerButton.classList.add("button-loading");
        registerButton.textContent = "Loading";

        await provider.experimentalSuggestChain(chainInfo);

        setTimeout(() => {
          registerButton.classList.remove("button-loading");
          registerButton.textContent = "Add to Zunia";
          init();
        }, 1000);
      } else {
        const notInstalledDiv = document.getElementById("zunia-not-installed");
        if (notInstalledDiv) {
          notInstalledDiv.style.display = "flex";
        }
      }
    } catch (e) {
      setTimeout(() => {
        registerButton.classList.remove("button-loading");
        registerButton.textContent = "Add to Zunia";
      }, 300);

      console.error(e);
    }
  };

  chainItemDiv.appendChild(registerButton);
}

function createRegisteredButton(chainItemDiv) {
  const registeredButton = document.createElement("button");
  registeredButton.className = "chain-added";

  const registeredButtonText = document.createTextNode("Added");
  registeredButton.appendChild(registeredButtonText);

  chainItemDiv.appendChild(registeredButton);
}

init();
