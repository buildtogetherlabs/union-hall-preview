/**
 * Demo / placeholder data for Local 4663 Union Books.
 * Looks “live” in UI previews; replace with on-chain reads before launch.
 *
 * Naming:
 *   Union Books  — the product (this app; nav tab: Books)
 *   Union Hall   — the community (Telegram)
 *
 * IBH.config.launched — flip to true after token + pool go live to unlock Swap.
 */
window.IBH = window.IBH || {};

/**
 * Product rules (locked for now — see docs.html#fees):
 * 1. Who pays: buys and sells (3.5% distribution fee in ETH).
 * 2. Path: trade fee → treasury → stock buy → distributor → member wallets.
 * 3. Eligible: any positive $HOOD balance (no minimum holdings; BANG-style).
 * 4. Cadence: distributionInterval (~30 minutes). Keep next-run clock on Books.
 * Payout: stock tokens (BB/AMC/NOK/GME) — not more $HOOD.
 * Tagline: Hold $HOOD. Collect union dividends in stocks — not more $HOOD.
 */
window.IBH.config = {
  /** When false, Swap page shows a closed-window notice only (no trade UI). */
  launched: false,
  /** Set after deploy — Uniswap / aggregator URL for ETH → $HOOD. */
  swapUrl: "",
  /**
   * Community: Union Hall lives on Telegram (not a product tab).
   * Set to full https://t.me/... URL when ready; footer “Union Hall” uses this.
   */
  telegramUrl: "",
  chainId: 4663,
  chainName: "Robinhood Chain",
  explorerBase: "https://robinhoodchain.blockscout.com",
  /**
   * No minimum holdings — any positive HOOD balance is dividend-eligible.
   * Display label for UI; owner may raise a floor later on-chain if needed.
   */
  minHood: "any",
  /** Distribution fee on $HOOD buys and sells (basis points / display label). */
  feeBps: 350,
  feeLabel: "3.5%",
  /** Books cadence for next dividend run (keep this schedule). */
  distributionInterval: "30 minutes",
  contracts: {
    ReflectionToken: {
      address: "—",
      role: "HOOD ERC-20 · holder list · any positive balance",
    },
    IndexFeeHook: {
      address: "—",
      role: "Uniswap V4 hook · 3.5% buy+sell fee → treasury",
    },
    StockTreasury: {
      address: "—",
      role: "Accumulates trade-fee dues · buys stock tokens",
    },
    StockDistributor: {
      address: "—",
      role: "Pro-rata stock airdrops on the distribution interval",
    },
    LpLock: { address: "—", role: "Full-range LP seed · fees collectable, LP locked" },
    PoolManager: {
      address: "0x8366a39cc670b4001a1121b8f6a443a643e40951",
      role: "Uniswap V4 PoolManager (chain)",
    },
    WETH: {
      address: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",
      role: "Wrapped ETH",
    },
    USDG: {
      address: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168",
      role: "USD stable · Rialto / buy path",
    },
  },
};

window.IBH.mock = {
  protocol: {
    totalPaidUsd: 128450.75,
    duesEth: 42.18,
    members: 1863,
    nextRunLabel: "18:00 UTC",
    nextRunCountdown: "00:24:12",
    hoodPriceUsd: "0.0012",
    treasuryEth: 3.42,
    feesEth: 42.18,
  },

  latestRun: {
    membersPaid: 1863,
    assets: [
      { ticker: "BB", amount: "+1,204.50", usd: "$4,812" },
      { ticker: "AMC", amount: "+890.25", usd: "$3,561" },
      { ticker: "NOK", amount: "+2,410.00", usd: "$2,892" },
      { ticker: "GME", amount: "+312.80", usd: "$5,004" },
    ],
  },

  basket: [
    {
      ticker: "BB",
      company: "BlackBerry",
      holdings: "48,200",
      price: "$4.00",
      url: "#",
    },
    {
      ticker: "AMC",
      company: "AMC Entertainment",
      holdings: "32,100",
      price: "$4.00",
      url: "#",
    },
    {
      ticker: "NOK",
      company: "Nokia",
      holdings: "91,400",
      price: "$1.20",
      url: "#",
    },
    {
      ticker: "GME",
      company: "GameStop",
      holdings: "9,850",
      price: "$16.00",
      url: "#",
    },
  ],

  /** Hall-wide dividend runs (Index: distributions). Each row links to tx. */
  payouts: [
    {
      date: "21 Jul 2026 · 17:30 UTC",
      assets: "BB 1,204.50 · AMC 890.25 · NOK 2,410.00 · GME 312.80",
      members: "1,863",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 17:00 UTC",
      assets: "BB 640.00 · AMC 410.10 · NOK 1,100.00 · GME 155.40",
      members: "1,858",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:30 UTC",
      assets: "BB 220.15 · AMC 180.00 · NOK 540.25 · GME 88.00",
      members: "1,851",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:00 UTC",
      assets: "BB 410.00 · AMC 300.50 · NOK 880.00 · GME 120.00",
      members: "1,842",
      tx: "https://robinhoodchain.blockscout.com/",
    },
  ],

  /** Treasury stock purchases funded by dues. */
  treasuryBuys: [
    {
      date: "21 Jul 2026 · 17:20 UTC",
      assets: "Purchased BB / AMC / NOK / GME with dues (equal split)",
      members: "Treasury",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:50 UTC",
      assets: "Purchased BB / AMC / NOK / GME with dues (equal split)",
      members: "Treasury",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:20 UTC",
      assets: "Purchased BB / AMC / NOK / GME with dues (equal split)",
      members: "Treasury",
      tx: "https://robinhoodchain.blockscout.com/",
    },
  ],

  demoMember: {
    address: "0x4663…a1b2",
    memberName: "Brother / Sister",
    memberSince: "21 Jul 2026",
    cardNumber: "4663-01863",
    dues: "Paid via 3.5% buy/sell fee",
    status: "Member in Good Standing",
    sharePct: "0.12%",
    dividendValue: "$154.20",
    hoodBalance: "48,000",
    hoodValueUsd: "$57.60",
    stocksEarned: [
      { ticker: "BB", amount: "12.40", usd: "$49.60" },
      { ticker: "AMC", amount: "9.10", usd: "$36.40" },
      { ticker: "NOK", amount: "28.50", usd: "$34.20" },
      { ticker: "GME", amount: "3.20", usd: "$51.20" },
    ],
    /**
     * Personal dividend receipts (Form 4663-R + distributions history).
     * Prefer `lines: [{ticker, amount}]` for the receipt table; `assets` string
     * remains for ledger rows and as a parse fallback.
     * status: "PAID" | "PENDING"
     */
    distributions: [
      {
        date: "21 Jul 2026 · 17:30 UTC",
        assets: "BB 0.48 · AMC 0.35 · NOK 0.96 · GME 0.12",
        lines: [
          { ticker: "BB", amount: "0.48" },
          { ticker: "AMC", amount: "0.35" },
          { ticker: "NOK", amount: "0.96" },
          { ticker: "GME", amount: "0.12" },
        ],
        value: "$1.92",
        status: "PAID",
        tx: "https://robinhoodchain.blockscout.com/",
        txLabel: "View transaction →",
      },
      {
        date: "21 Jul 2026 · 17:00 UTC",
        assets: "BB 0.26 · AMC 0.16 · NOK 0.44 · GME 0.06",
        lines: [
          { ticker: "BB", amount: "0.26" },
          { ticker: "AMC", amount: "0.16" },
          { ticker: "NOK", amount: "0.44" },
          { ticker: "GME", amount: "0.06" },
        ],
        value: "$1.01",
        status: "PAID",
        tx: "https://robinhoodchain.blockscout.com/",
      },
      {
        date: "21 Jul 2026 · 16:30 UTC",
        assets: "BB 0.09 · AMC 0.07 · NOK 0.22 · GME 0.04",
        lines: [
          { ticker: "BB", amount: "0.09" },
          { ticker: "AMC", amount: "0.07" },
          { ticker: "NOK", amount: "0.22" },
          { ticker: "GME", amount: "0.04" },
        ],
        value: "$0.42",
        status: "PAID",
        tx: "https://robinhoodchain.blockscout.com/",
      },
    ],
    /** Personal $HOOD purchase / swap history. */
    purchases: [
      {
        date: "21 Jul 2026 · 14:12 UTC",
        assets: "Bought 25,000 $HOOD for 0.032 ETH",
        value: "0.032 ETH",
        tx: "https://robinhoodchain.blockscout.com/",
      },
      {
        date: "21 Jul 2026 · 11:05 UTC",
        assets: "Bought 23,000 $HOOD for 0.028 ETH",
        value: "0.028 ETH",
        tx: "https://robinhoodchain.blockscout.com/",
      },
    ],
  },
};
