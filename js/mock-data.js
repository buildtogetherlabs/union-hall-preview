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
 * 3. Eligible: any positive $HOOD balance (no minimum holdings).
 * 4. Cadence: distributionInterval (~30 minutes). Keep next-run clock on Books.
 * Payout: Mag8 stock tokens (GOOGL/AMZN/AAPL/META/MSFT/NFLX/NVDA/TSLA) — not more $HOOD.
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
  /** Dividend basket label (owner can update on-chain; UI mock tracks product intent). */
  basketName: "Mag8",
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
      { ticker: "GOOGL", amount: "+42.10", usd: "$7,620" },
      { ticker: "AMZN", amount: "+38.50", usd: "$7,120" },
      { ticker: "AAPL", amount: "+48.20", usd: "$9,640" },
      { ticker: "META", amount: "+14.80", usd: "$7,840" },
      { ticker: "MSFT", amount: "+18.60", usd: "$7,990" },
      { ticker: "NFLX", amount: "+9.40", usd: "$6,110" },
      { ticker: "NVDA", amount: "+52.30", usd: "$6,800" },
      { ticker: "TSLA", amount: "+28.70", usd: "$7,180" },
    ],
  },

  /** Mag8 dividend basket — Alphabet, Amazon, Apple, Meta, Microsoft, Netflix, Nvidia, Tesla. */
  basket: [
    { ticker: "GOOGL", company: "Alphabet", holdings: "1,240", price: "$181.00", url: "#" },
    { ticker: "AMZN", company: "Amazon", holdings: "980", price: "$185.00", url: "#" },
    { ticker: "AAPL", company: "Apple", holdings: "1,520", price: "$200.00", url: "#" },
    { ticker: "META", company: "Meta", holdings: "420", price: "$530.00", url: "#" },
    { ticker: "MSFT", company: "Microsoft", holdings: "560", price: "$430.00", url: "#" },
    { ticker: "NFLX", company: "Netflix", holdings: "210", price: "$650.00", url: "#" },
    { ticker: "NVDA", company: "Nvidia", holdings: "1,680", price: "$130.00", url: "#" },
    { ticker: "TSLA", company: "Tesla", holdings: "890", price: "$250.00", url: "#" },
  ],

  /** Hall-wide dividend runs (Index: distributions). Each row links to tx. */
  payouts: [
    {
      date: "21 Jul 2026 · 17:30 UTC",
      assets: "GOOGL 42.10 · AMZN 38.50 · AAPL 48.20 · META 14.80 · MSFT 18.60 · NFLX 9.40 · NVDA 52.30 · TSLA 28.70",
      members: "1,863",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 17:00 UTC",
      assets: "GOOGL 22.00 · AMZN 20.10 · AAPL 25.40 · META 7.80 · MSFT 9.70 · NFLX 5.00 · NVDA 27.60 · TSLA 15.10",
      members: "1,858",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:30 UTC",
      assets: "GOOGL 8.40 · AMZN 7.60 · AAPL 9.60 · META 2.95 · MSFT 3.70 · NFLX 1.88 · NVDA 10.40 · TSLA 5.70",
      members: "1,851",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:00 UTC",
      assets: "GOOGL 14.20 · AMZN 12.90 · AAPL 16.30 · META 5.00 · MSFT 6.25 · NFLX 3.15 · NVDA 17.60 · TSLA 9.65",
      members: "1,842",
      tx: "https://robinhoodchain.blockscout.com/",
    },
  ],

  /** Treasury stock purchases funded by dues. */
  treasuryBuys: [
    {
      date: "21 Jul 2026 · 17:20 UTC",
      assets: "Purchased Mag8 (GOOGL / AMZN / AAPL / META / MSFT / NFLX / NVDA / TSLA) with dues (equal split)",
      members: "Treasury",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:50 UTC",
      assets: "Purchased Mag8 (GOOGL / AMZN / AAPL / META / MSFT / NFLX / NVDA / TSLA) with dues (equal split)",
      members: "Treasury",
      tx: "https://robinhoodchain.blockscout.com/",
    },
    {
      date: "21 Jul 2026 · 16:20 UTC",
      assets: "Purchased Mag8 (GOOGL / AMZN / AAPL / META / MSFT / NFLX / NVDA / TSLA) with dues (equal split)",
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
      { ticker: "GOOGL", amount: "0.42", usd: "$76.00" },
      { ticker: "AMZN", amount: "0.38", usd: "$70.30" },
      { ticker: "AAPL", amount: "0.48", usd: "$96.00" },
      { ticker: "META", amount: "0.15", usd: "$79.50" },
      { ticker: "MSFT", amount: "0.19", usd: "$81.70" },
      { ticker: "NFLX", amount: "0.09", usd: "$58.50" },
      { ticker: "NVDA", amount: "0.52", usd: "$67.60" },
      { ticker: "TSLA", amount: "0.29", usd: "$72.50" },
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
        assets: "GOOGL 0.018 · AMZN 0.016 · AAPL 0.021 · META 0.006 · MSFT 0.008 · NFLX 0.004 · NVDA 0.022 · TSLA 0.012",
        lines: [
          { ticker: "GOOGL", amount: "0.018" },
          { ticker: "AMZN", amount: "0.016" },
          { ticker: "AAPL", amount: "0.021" },
          { ticker: "META", amount: "0.006" },
          { ticker: "MSFT", amount: "0.008" },
          { ticker: "NFLX", amount: "0.004" },
          { ticker: "NVDA", amount: "0.022" },
          { ticker: "TSLA", amount: "0.012" },
        ],
        value: "$1.92",
        status: "PAID",
        tx: "https://robinhoodchain.blockscout.com/",
        txLabel: "View transaction →",
      },
      {
        date: "21 Jul 2026 · 17:00 UTC",
        assets: "GOOGL 0.009 · AMZN 0.008 · AAPL 0.011 · META 0.003 · MSFT 0.004 · NFLX 0.002 · NVDA 0.012 · TSLA 0.006",
        lines: [
          { ticker: "GOOGL", amount: "0.009" },
          { ticker: "AMZN", amount: "0.008" },
          { ticker: "AAPL", amount: "0.011" },
          { ticker: "META", amount: "0.003" },
          { ticker: "MSFT", amount: "0.004" },
          { ticker: "NFLX", amount: "0.002" },
          { ticker: "NVDA", amount: "0.012" },
          { ticker: "TSLA", amount: "0.006" },
        ],
        value: "$1.01",
        status: "PAID",
        tx: "https://robinhoodchain.blockscout.com/",
      },
      {
        date: "21 Jul 2026 · 16:30 UTC",
        assets: "GOOGL 0.004 · AMZN 0.003 · AAPL 0.004 · META 0.001 · MSFT 0.002 · NFLX 0.001 · NVDA 0.004 · TSLA 0.002",
        lines: [
          { ticker: "GOOGL", amount: "0.004" },
          { ticker: "AMZN", amount: "0.003" },
          { ticker: "AAPL", amount: "0.004" },
          { ticker: "META", amount: "0.001" },
          { ticker: "MSFT", amount: "0.002" },
          { ticker: "NFLX", amount: "0.001" },
          { ticker: "NVDA", amount: "0.004" },
          { ticker: "TSLA", amount: "0.002" },
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
