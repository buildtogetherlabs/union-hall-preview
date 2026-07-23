/**
 * Union Books UI — membership office, books, board, ledger, swap gate, portfolio.
 * Union Hall (Telegram) is community, not a product tab.
 * Clock In is local mock until wallet + chain wiring.
 */
(function () {
  var STORAGE_KEY = "ibh_clocked_in";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function isClockedIn() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setClockedIn(on) {
    try {
      if (on) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function isLaunched() {
    return !!(window.IBH && window.IBH.config && window.IBH.config.launched);
  }

  function formatProtocol() {
    var m = window.IBH && window.IBH.mock;
    if (!m) return;

    var p = m.protocol;
    setText("[data-metric='totalPaid']", formatUsd(p.totalPaidUsd));
    setText("[data-metric='dues']", formatEth(p.duesEth));
    setText("[data-metric='members']", String(p.members));
    setText("[data-metric='nextRun']", p.nextRunCountdown || p.nextRunLabel);
    setText("[data-metric='hoodPrice']", p.hoodPriceUsd === "—" ? "—" : "$" + p.hoodPriceUsd);
    setText("[data-metric='treasury']", formatEth(p.treasuryEth));
    setText("[data-metric='fees']", formatEth(p.feesEth));
    setText("[data-metric='nextDist']", p.nextRunLabel);
  }

  function formatUsd(n) {
    if (n === "—" || n == null) return "—";
    if (typeof n === "number" && n === 0) return "$0.00";
    if (typeof n === "number") {
      return (
        "$" +
        n.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
    return String(n);
  }

  function formatEth(n) {
    if (n === "—" || n == null || n === "") return "—";
    if (typeof n === "number") {
      return n.toLocaleString("en-US", { maximumFractionDigits: 4 }) + " ETH";
    }
    if (typeof n === "string" && /eth/i.test(n)) return n;
    return String(n);
  }

  function setText(sel, text) {
    $all(sel).forEach(function (el) {
      el.textContent = text;
    });
  }

  function renderLatestRun() {
    var m = window.IBH && window.IBH.mock;
    var list = $("[data-latest-run]");
    if (!m || !list) return;

    var run = m.latestRun;
    setText("[data-latest-members]", String(run.membersPaid));

    list.innerHTML = "";
    run.assets.forEach(function (a) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="ticker">' +
        escapeHtml(a.ticker) +
        '</span><span class="amt">' +
        escapeHtml(a.amount) +
        '</span><span class="usd">' +
        escapeHtml(a.usd) +
        "</span>";
      list.appendChild(li);
    });
  }

  function renderBasket() {
    var m = window.IBH && window.IBH.mock;
    var board = $("[data-dividend-board]");
    if (!m || !board) return;

    board.innerHTML = "";
    m.basket.forEach(function (s) {
      var card = document.createElement("article");
      card.className = "notice";
      card.innerHTML =
        '<div class="notice-ticker">' +
        escapeHtml(s.ticker) +
        '</div><div class="notice-name">' +
        escapeHtml(s.company) +
        '</div><div class="notice-row"><span>Treasury holdings</span><span>' +
        escapeHtml(s.holdings) +
        '</span></div><div class="notice-row"><span>Price</span><span>' +
        escapeHtml(s.price) +
        '</span></div><a class="btn btn-sm" href="' +
        escapeAttr(s.url) +
        '"' +
        (s.url === "#" ? ' aria-disabled="true"' : ' target="_blank" rel="noopener"') +
        ">View asset</a>";
      board.appendChild(card);
    });
  }

  function renderLedgerTables() {
    var m = window.IBH && window.IBH.mock;
    if (!m) return;

    fillLedger("payouts", m.payouts, {
      thirdKey: "members",
      thirdLabel: "Members paid",
    });
    fillLedger("buys", m.treasuryBuys, {
      thirdKey: "members",
      thirdLabel: "Notes",
    });
  }

  function fillLedger(kind, rows, opts) {
    opts = opts || {};
    var thirdKey = opts.thirdKey || "members";
    var thirdLabel = opts.thirdLabel || "Detail";
    var tbody = $("[data-ledger-body='" + kind + "']");
    var cards = $("[data-ledger-cards='" + kind + "']");
    if (!tbody && !cards) return;

    if (tbody) {
      tbody.innerHTML = "";
      rows.forEach(function (r) {
        var tr = document.createElement("tr");
        var txCell = r.tx
          ? '<a class="tx" href="' + escapeAttr(r.tx) + '" target="_blank" rel="noopener">View →</a>'
          : '<span class="muted">—</span>';
        var third = r[thirdKey] != null ? r[thirdKey] : r.value != null ? r.value : "—";
        tr.innerHTML =
          "<td>" +
          escapeHtml(r.date) +
          '</td><td class="assets">' +
          escapeHtml(r.assets) +
          "</td><td>" +
          escapeHtml(String(third)) +
          "</td><td>" +
          txCell +
          "</td>";
        // Whole row is clickable when a tx exists
        if (r.tx) {
          tr.className = "is-link";
          tr.setAttribute("data-tx", r.tx);
          tr.setAttribute("tabindex", "0");
          tr.setAttribute("role", "link");
          tr.setAttribute("aria-label", "Open transaction");
        }
        tbody.appendChild(tr);
      });
    }

    if (cards) {
      cards.innerHTML = "";
      rows.forEach(function (r) {
        var div = document.createElement("div");
        div.className = "ledger-card";
        var third = r[thirdKey] != null ? r[thirdKey] : r.value != null ? r.value : "—";
        var tx = r.tx
          ? '<a class="tx" href="' + escapeAttr(r.tx) + '" target="_blank" rel="noopener">View transaction →</a>'
          : "<span>—</span>";
        div.innerHTML =
          '<div class="date">' +
          escapeHtml(r.date) +
          '</div><div class="assets">' +
          escapeHtml(r.assets) +
          '</div><div class="meta"><span>' +
          escapeHtml(thirdLabel) +
          ": " +
          escapeHtml(String(third)) +
          "</span>" +
          tx +
          "</div>";
        if (r.tx) {
          div.className += " is-link";
          div.setAttribute("data-tx", r.tx);
        }
        cards.appendChild(div);
      });
    }
  }

  function bindRowLinks() {
    document.addEventListener("click", function (e) {
      var row = e.target.closest("[data-tx]");
      if (!row) return;
      if (e.target.closest("a")) return;
      var url = row.getAttribute("data-tx");
      if (url) window.open(url, "_blank", "noopener");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var row = e.target.closest("tr[data-tx]");
      if (!row) return;
      e.preventDefault();
      window.open(row.getAttribute("data-tx"), "_blank", "noopener");
    });
  }

  function renderMembership() {
    var clocked = isClockedIn();
    var blank = $("[data-card-blank]");
    var live = $("[data-card-live]");
    var panelOut = $("[data-member-disconnected]");
    var panelIn = $("[data-member-connected]");

    if (blank) blank.classList.toggle("is-blank", !clocked);
    if (blank) blank.classList.toggle("hidden", clocked);
    if (live) live.classList.toggle("hidden", !clocked);
    if (panelOut) panelOut.classList.toggle("hidden", clocked);
    if (panelIn) panelIn.classList.toggle("hidden", !clocked);

    $all("[data-clocked-only]").forEach(function (el) {
      el.classList.toggle("hidden", !clocked);
    });
    $all("[data-clocked-out-only]").forEach(function (el) {
      el.classList.toggle("hidden", clocked);
    });

    $all("[data-clock-in]").forEach(function (btn) {
      if (btn.hasAttribute("data-nav-clock")) return;
      btn.textContent = clocked ? "Clock out" : "Clock in";
    });

    $all("[data-nav-clock]").forEach(function (btn) {
      btn.textContent = clocked ? "Clocked in" : "Clock in";
    });

    if (!clocked) {
      renderDividendReceipt();
      return;
    }

    var mem = window.IBH.mock.demoMember;
    setText("[data-field='memberName']", mem.memberName);
    setText("[data-field='memberSince']", mem.memberSince);
    setText("[data-field='cardNumber']", mem.cardNumber);
    setText("[data-field='dues']", mem.dues);
    setText("[data-field='status']", mem.status);
    setText("[data-field='share']", mem.sharePct);
    setText("[data-field='dividendValue']", mem.dividendValue);
    setText("[data-field='hoodBalance']", mem.hoodBalance);
    setText("[data-field='hoodValue']", mem.hoodValueUsd || "—");
    setText("[data-field='address']", mem.address);

    var stockList = $("[data-stocks-earned]");
    if (stockList) {
      stockList.innerHTML = "";
      mem.stocksEarned.forEach(function (s) {
        var li = document.createElement("li");
        var line = s.ticker + "  " + s.amount;
        if (s.usd) line += "  (" + s.usd + ")";
        li.textContent = line;
        stockList.appendChild(li);
      });
    }

    renderPortfolioHoldings();
    renderDividendReceipt();
  }

  function renderPortfolioHoldings() {
    var grid = $("[data-portfolio-holdings]");
    var mem = window.IBH && window.IBH.mock && window.IBH.mock.demoMember;
    if (!grid || !mem) return;

    grid.innerHTML = "";
    mem.stocksEarned.forEach(function (s) {
      var card = document.createElement("article");
      card.className = "notice";
      card.innerHTML =
        '<div class="notice-ticker">' +
        escapeHtml(s.ticker) +
        '</div><div class="notice-name">Stock token received</div>' +
        '<div class="notice-row"><span>Amount</span><span>' +
        escapeHtml(s.amount) +
        '</span></div><div class="notice-row"><span>Est. value</span><span>' +
        escapeHtml(s.usd || "—") +
        "</span></div>";
      grid.appendChild(card);
    });
  }

  function renderPersonalHistory() {
    var m = window.IBH && window.IBH.mock;
    if (!m || !m.demoMember) return;

    fillLedger("member-dist", m.demoMember.distributions || [], {
      thirdKey: "value",
      thirdLabel: "Value",
    });
    fillLedger("member-buys", m.demoMember.purchases || [], {
      thirdKey: "value",
      thirdLabel: "Paid",
    });
  }

  function formatConfigLabels() {
    var cfg = window.IBH && window.IBH.config;
    setText("[data-config='fee']", (cfg && (cfg.feeLabel || cfg.sellFeeLabel)) || "3.5%");
    setText("[data-config='minHood']", (cfg && cfg.minHood) || "any");
    setText("[data-config='interval']", (cfg && cfg.distributionInterval) || "30 minutes");
    setText("[data-config='chain']", (cfg && cfg.chainName) || "Robinhood Chain");
  }

  /**
   * Form 4663-R · Membership dividend receipt
   * Populates named tokens for HTML (and mirrors SVG field map):
   * status_stamp, member_name, card_number, record, run_posted,
   * est_value, asset_1..6 ticker/amount, tx_url_label
   */
  function parseReceiptAssets(dist) {
    if (!dist) return [];
    if (Array.isArray(dist.lines) && dist.lines.length) {
      return dist.lines
        .map(function (row) {
          return {
            ticker: String(row.ticker || "").trim(),
            amount: String(row.amount || "").trim(),
          };
        })
        .filter(function (row) {
          return row.ticker || row.amount;
        });
    }
    return String(dist.assets || "")
      .split("·")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean)
      .map(function (line) {
        var parts = line.split(/\s+/);
        return {
          ticker: parts[0] || "",
          amount: parts.slice(1).join(" ") || "",
        };
      });
  }

  function setReceiptStamp(el, status) {
    if (!el) return;
    var stamp = String(status || "").toUpperCase();
    el.classList.remove("is-paid", "is-pending", "is-empty");
    if (stamp === "PAID") {
      el.textContent = "PAID";
      el.classList.add("is-paid");
    } else if (stamp === "PENDING") {
      el.textContent = "PENDING";
      el.classList.add("is-pending");
    } else {
      el.textContent = "—";
      el.classList.add("is-empty");
    }
  }

  function renderDividendReceipt() {
    var root = $("[data-dividend-receipt]");
    if (!root) return;

    var clocked = isClockedIn();
    var mem =
      window.IBH && window.IBH.mock && window.IBH.mock.demoMember
        ? window.IBH.mock.demoMember
        : null;
    var dist =
      clocked && mem && mem.distributions && mem.distributions[0]
        ? mem.distributions[0]
        : null;

    var stampEl = $("[data-receipt='status_stamp']", root);
    var memberEl = $("[data-receipt='member_name']", root);
    var cardEl = $("[data-receipt='card_number']", root);
    var recordEl = $("[data-receipt='record']", root);
    var runEl = $("[data-receipt='run_posted']", root);
    var valueEl = $("[data-receipt='est_value']", root);
    var assetsEl = $("[data-receipt='assets']", root);
    var emptyEl = $("[data-receipt='empty_msg']", root);
    var txEl = $("[data-receipt='tx']", root);

    function setVal(el, text) {
      if (el) el.textContent = text == null || text === "" ? "—" : String(text);
    }

    if (!clocked || !mem || !dist) {
      root.setAttribute("data-receipt-state", "empty");
      setReceiptStamp(stampEl, "");
      setVal(memberEl, "—");
      setVal(cardEl, "—");
      setVal(recordEl, "—");
      setVal(runEl, "—");
      setVal(valueEl, "—");
      if (assetsEl) assetsEl.innerHTML = "";
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.classList.remove("hidden");
      }
      if (txEl) {
        txEl.textContent = "View transaction →";
        txEl.removeAttribute("href");
        txEl.classList.add("is-disabled");
      }
      return;
    }

    var status = dist.status || "PAID";
    root.setAttribute(
      "data-receipt-state",
      String(status).toUpperCase() === "PENDING" ? "pending" : "filled"
    );

    setReceiptStamp(stampEl, status);
    setVal(memberEl, mem.memberName);
    setVal(cardEl, mem.cardNumber);
    setVal(recordEl, mem.address);
    setVal(runEl, dist.date || dist.run_posted);
    setVal(valueEl, dist.value || dist.est_value);

    if (emptyEl) {
      emptyEl.hidden = true;
      emptyEl.classList.add("hidden");
    }

    if (assetsEl) {
      assetsEl.innerHTML = "";
      var rows = parseReceiptAssets(dist).slice(0, 6);
      if (!rows.length) {
        var tr0 = document.createElement("tr");
        tr0.className = "is-placeholder";
        tr0.innerHTML =
          '<td class="ticker" colspan="2">No line items</td>';
        assetsEl.appendChild(tr0);
      } else {
        rows.forEach(function (row, i) {
          var n = i + 1;
          var tr = document.createElement("tr");
          tr.setAttribute("data-asset-index", String(n));
          var tdT = document.createElement("td");
          tdT.className = "ticker";
          tdT.setAttribute("data-token", "asset_" + n + "_ticker");
          tdT.textContent = row.ticker || "—";
          var tdA = document.createElement("td");
          tdA.className = "amount";
          tdA.setAttribute("data-token", "asset_" + n + "_amount");
          tdA.textContent = row.amount || "—";
          tr.appendChild(tdT);
          tr.appendChild(tdA);
          assetsEl.appendChild(tr);
        });
      }
    }

    if (txEl) {
      txEl.textContent = dist.txLabel || "View transaction →";
      if (dist.tx) {
        txEl.setAttribute("href", dist.tx);
        txEl.setAttribute("target", "_blank");
        txEl.setAttribute("rel", "noopener");
        txEl.classList.remove("is-disabled");
      } else {
        txEl.removeAttribute("href");
        txEl.classList.add("is-disabled");
      }
    }
  }

  function renderSwapGate() {
    var closed = $("[data-swap-closed]");
    var open = $("[data-swap-open]");
    if (!closed && !open) return;

    var live = isLaunched();
    if (closed) closed.classList.toggle("hidden", live);
    if (open) open.classList.toggle("hidden", !live);

    var cfg = window.IBH && window.IBH.config;
    var link = $("[data-swap-external]");
    if (link && cfg && cfg.swapUrl) {
      link.href = cfg.swapUrl;
      link.classList.remove("is-disabled");
    }
  }

  function bindSwapForm() {
    var form = $("[data-swap-form]");
    if (!form) return;

    var youPay = $("[data-swap-pay]");
    var youGet = $("[data-swap-get]");
    var rateEl = $("[data-swap-rate]");
    var feeEl = $("[data-swap-fee-note]");

    function quote() {
      var m = window.IBH && window.IBH.mock;
      var price = m && m.protocol ? parseFloat(m.protocol.hoodPriceUsd) : 0;
      var ethIn = parseFloat(youPay && youPay.value ? youPay.value : "0") || 0;
      // Demo quote only — not a real pool read
      var ethUsd = 3500;
      var hoodOut = price > 0 ? (ethIn * ethUsd) / price : 0;
      if (youGet) {
        youGet.value = hoodOut > 0 ? hoodOut.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "";
      }
      if (rateEl) {
        rateEl.textContent =
          price > 0
            ? "1 ETH ≈ " +
              (ethUsd / price).toLocaleString("en-US", { maximumFractionDigits: 0 }) +
              " $HOOD (demo quote)"
            : "Quote unavailable";
      }
      if (feeEl) {
        feeEl.textContent =
          "Buys and sells of $HOOD include a " +
          ((window.IBH.config && window.IBH.config.feeLabel) || "3.5%") +
          " fee that funds the treasury.";
      }
    }

    if (youPay) {
      youPay.addEventListener("input", quote);
      youPay.addEventListener("change", quote);
    }
    quote();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isLaunched()) return;
      var cfg = window.IBH.config;
      if (cfg && cfg.swapUrl) {
        window.open(cfg.swapUrl, "_blank", "noopener");
      } else {
        alert(
          "Swap wiring is not live yet. Set IBH.config.swapUrl after launch, or connect the pool router."
        );
      }
    });
  }

  function renderContracts() {
    var tbody = $("[data-contracts-body]");
    var cfg = window.IBH && window.IBH.config;
    if (!tbody || !cfg || !cfg.contracts) return;

    tbody.innerHTML = "";
    Object.keys(cfg.contracts).forEach(function (name) {
      var c = cfg.contracts[name];
      var tr = document.createElement("tr");
      var addr = c.address || "—";
      var addrCell;
      if (addr !== "—" && cfg.explorerBase) {
        addrCell =
          '<a class="tx" href="' +
          escapeAttr(cfg.explorerBase + "/address/" + addr) +
          '" target="_blank" rel="noopener">' +
          escapeHtml(shorten(addr)) +
          "</a>";
      } else {
        addrCell = '<span class="muted">' + escapeHtml(addr) + "</span>";
      }
      tr.innerHTML =
        "<td><strong>" +
        escapeHtml(name) +
        "</strong></td><td class=\"assets\">" +
        escapeHtml(c.role || "") +
        "</td><td>" +
        addrCell +
        "</td>";
      tbody.appendChild(tr);
    });
  }

  function shorten(addr) {
    if (!addr || addr.length < 12) return addr;
    return addr.slice(0, 6) + "…" + addr.slice(-4);
  }

  function wireBuyLinks() {
    var cfg = window.IBH && window.IBH.config;
    $all("#buy-hood, #buy-hood-hero, [data-buy-hood]").forEach(function (el) {
      if (cfg && cfg.launched && cfg.swapUrl) {
        el.setAttribute("href", cfg.swapUrl);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.setAttribute("href", "swap.html");
        el.removeAttribute("target");
      }
    });
  }

  function bindClockIn() {
    $all("[data-clock-in], [data-nav-clock]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setClockedIn(!isClockedIn());
        renderMembership();
        renderPersonalHistory();
      });
    });
  }

  function bindTabs() {
    $all("[data-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("data-tab");
        var group = tab.closest("[data-tab-group]") || document;
        $all("[data-tab]", group).forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        $all("[data-tab-panel]", group).forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-tab-panel") === id);
        });
      });
    });
  }

  function bindNavToggle() {
    var toggle = $("[data-nav-toggle]");
    var collapse = $("[data-nav-collapse]");
    if (!toggle || !collapse) return;
    toggle.addEventListener("click", function () {
      var open = collapse.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /**
   * Union Hall = Telegram community. Wire footer (and any) [data-union-hall] links
   * from IBH.config.telegramUrl. Hide when unset so we never ship a dead Hall link.
   */
  function wireUnionHallLinks() {
    var url =
      window.IBH && window.IBH.config && window.IBH.config.telegramUrl
        ? String(window.IBH.config.telegramUrl).trim()
        : "";
    $all("[data-union-hall]").forEach(function (el) {
      if (url) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.removeAttribute("hidden");
        el.style.display = "";
      } else {
        el.setAttribute("hidden", "hidden");
        el.setAttribute("aria-hidden", "true");
        el.removeAttribute("href");
      }
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function init() {
    formatConfigLabels();
    formatProtocol();
    renderLatestRun();
    renderBasket();
    renderLedgerTables();
    renderPersonalHistory();
    renderMembership();
    renderSwapGate();
    renderContracts();
    wireBuyLinks();
    wireUnionHallLinks();
    bindClockIn();
    bindTabs();
    bindNavToggle();
    bindSwapForm();
    bindRowLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
