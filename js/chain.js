/**
 * Robinhood Chain Testnet wiring for Union Books UI.
 * Addresses match hood-contracts deployments/robinhood-testnet-46630.json (2026-07-24).
 */
window.IBH = window.IBH || {};

window.IBH.chain = {
  chainId: 46630,
  chainIdHex: "0xb626",
  chainName: "Robinhood Chain Testnet",
  rpcUrl: "https://rpc.testnet.chain.robinhood.com",
  explorer: "https://explorer.testnet.chain.robinhood.com",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  /** Uniswap v4 TickMath.MIN_SQRT_PRICE + 1 */
  minSqrtPriceX96Plus1: "4295128740",
  maxSqrtPriceX96Minus1: "1461446703485210103287273052203988822378723970341",
  pool: {
    currency0: "0x0000000000000000000000000000000000000000",
    currency1: null, // filled from config.hood
    fee: 3000,
    tickSpacing: 60,
    hooks: null,
  },
  addresses: {
    hood: "0xa73533aD0002DAb67b5E22afcC07760f12b097d4",
    feeHook: "0xDdd77A1E43769C12B9386e3080E7230e1E4FC0cC",
    stockTreasury: "0x2d7cE291087b1d5DFc2B424Bf89C0f434D85ccEc",
    stockDistributor: "0xE7bC80790c4a6f2d2EBA056E5A98cEA5F8C911d8",
    lpLock: "0xF0af4d2876F1Fd8B2E240c855aF97e8a69Eb7313",
    poolManager: "0x8366a39CC670B4001A1121B8F6A443A643e40951",
    swapRouter: "0x374E47C3ca1b06f4C58b1aB5d67Bf74903f17884",
    usdg: "0xa927aeC97CD1dD0A0d742fa4A4c50cCE2DA48961",
  },
};

// PoolSwapTest.swap — Uniswap v4 test router
window.IBH.abis = window.IBH.abis || {};
window.IBH.abis.poolSwapTest = [
  {
    type: "function",
    name: "swap",
    stateMutability: "payable",
    inputs: [
      {
        name: "key",
        type: "tuple",
        components: [
          { name: "currency0", type: "address" },
          { name: "currency1", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "tickSpacing", type: "int24" },
          { name: "hooks", type: "address" },
        ],
      },
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "zeroForOne", type: "bool" },
          { name: "amountSpecified", type: "int256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
      {
        name: "testSettings",
        type: "tuple",
        components: [
          { name: "takeClaims", type: "bool" },
          { name: "settleUsingBurn", type: "bool" },
        ],
      },
      { name: "hookData", type: "bytes" },
    ],
    outputs: [{ name: "delta", type: "int256" }],
  },
];

window.IBH.abis.erc20 = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
];

/** Apply chain addresses onto IBH.config (call after mock-data loads). */
window.IBH.applyTestnetConfig = function () {
  var c = window.IBH.chain;
  var cfg = window.IBH.config || (window.IBH.config = {});
  cfg.launched = true;
  cfg.network = "testnet";
  cfg.chainId = c.chainId;
  cfg.chainName = c.chainName;
  cfg.explorerBase = c.explorer;
  cfg.rpcUrl = c.rpcUrl;
  cfg.feeBps = 350;
  cfg.feeLabel = "3.5%";
  cfg.distributionInterval = "30 minutes";
  cfg.basketName = "Mag8";
  cfg.swapRouter = c.addresses.swapRouter;
  cfg.hood = c.addresses.hood;
  cfg.feeHook = c.addresses.feeHook;
  cfg.poolManager = c.addresses.poolManager;
  cfg.stockTreasury = c.addresses.stockTreasury;
  cfg.stockDistributor = c.addresses.stockDistributor;
  cfg.contracts = cfg.contracts || {};
  cfg.contracts.ReflectionToken = {
    address: c.addresses.hood,
    role: "HOOD ERC-20 · holder list · any positive balance",
  };
  cfg.contracts.IndexFeeHook = {
    address: c.addresses.feeHook,
    role: "Uniswap V4 hook · 3.5% buy+sell fee → treasury",
  };
  cfg.contracts.StockTreasury = {
    address: c.addresses.stockTreasury,
    role: "Accumulates trade-fee dues · buys stock tokens",
  };
  cfg.contracts.StockDistributor = {
    address: c.addresses.stockDistributor,
    role: "Pro-rata stock airdrops on the distribution interval",
  };
  cfg.contracts.LpLock = {
    address: c.addresses.lpLock,
    role: "Full-range LP seed · fees collectable, LP locked",
  };
  cfg.contracts.PoolManager = {
    address: c.addresses.poolManager,
    role: "Uniswap V4 PoolManager (chain)",
  };
  cfg.contracts.SwapRouter = {
    address: c.addresses.swapRouter,
    role: "PoolSwapTest · UI ETH↔HOOD swaps",
  };
  cfg.contracts.USDG = {
    address: c.addresses.usdg,
    role: "Mock USDG (testnet)",
  };
  c.pool.currency1 = c.addresses.hood;
  c.pool.hooks = c.addresses.feeHook;
};
