document.addEventListener("DOMContentLoaded", () => {
  const heartCountEl = document.querySelector(".heart-count");
  const coinCountEl = document.querySelector(".coin-count");
  const copyCountEl = document.querySelector(".copy-count");
  const historyListEl = document.querySelector(".history-details");
  const clearWrapEl = document.querySelector(".history-btn");

  const parseIntFromText = (txt, fallback = 0) => {
    const match = String(txt ?? "").match(/\d+/);
    return match ? Number(match[0]) : fallback;
  };

  const getCardData = (btnEl) => {
    const cardEl = btnEl.closest(".card");
    if (!cardEl) return null;

    const h1s = cardEl.querySelectorAll(".card-content h1");
    const serviceName = h1s[0]?.textContent.trim() ?? "";
    const serviceNumber = h1s[1]?.textContent.trim() ?? "";
    return { serviceName, serviceNumber };
  };

  const updateHeartCount = (val) => {
    if (heartCountEl) heartCountEl.textContent = String(val);
  };

  const updateCoinCount = (val) => {
    if (coinCountEl) coinCountEl.textContent = String(val);
  };

  const updateCopyCount = (val) => {
    if (copyCountEl) copyCountEl.textContent = `${val} copy`;
  };

  const copyToClipboard = async (text) => {
    if (!text) throw new Error("Nothing to copy");
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for clipboard copy
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  // Navbar state (single source of truth)
  let heartCount = parseIntFromText(heartCountEl?.textContent, 0);
  let coins = parseIntFromText(coinCountEl?.textContent, 100);
  let copyCount = parseIntFromText(copyCountEl?.textContent, 0);

  updateHeartCount(heartCount);
  updateCoinCount(coins);
  updateCopyCount(copyCount);

  // Start empty
  if (historyListEl) historyListEl.innerHTML = "";

  const getExactLocalTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return { now, timeStr, iso: now.toISOString() };
  };

  // One event handler for all interactive buttons
  document.addEventListener("click", async (e) => {
    const hotlineBtn = e.target.closest(".hotline");
    if (hotlineBtn) {
      heartCount++;
      updateHeartCount(heartCount);
      return;
    }

    const clearClicked = e.target.closest(".history-btn");
    if (clearClicked) {
      if (historyListEl) historyListEl.innerHTML = "";
      return;
    }

    const copyBtn = e.target.closest(".copy");
    if (copyBtn) {
      const data = getCardData(copyBtn);
      if (!data) return;

      try {
        await copyToClipboard(data.serviceNumber);
        copyCount++;
        updateCopyCount(copyCount);
        alert(`Copied ${data.serviceNumber} (${data.serviceName})`);
      } catch {
        alert("Copy failed. Please try again.");
      }
      return;
    }

    const callBtn = e.target.closest(".call");
    if (callBtn) {
      const data = getCardData(callBtn);
      if (!data) return;

      if (coins < 20) {
        alert("Not enough coins for this call.");
        return;
      }

      alert(`Calling ${data.serviceName} at ${data.serviceNumber}...`);

      coins -= 20;
      updateCoinCount(coins);

      const { iso, timeStr } = getExactLocalTime();

      if (historyListEl) {
        const item = document.createElement("div");
        item.className = "history-item call-card";
        item.innerHTML = `
          <div class="dt-left">
            <h1 class="history-title">${data.serviceName}</h1>
            <p>${data.serviceNumber}</p>
          </div>
          <div class="dt-right">
            <time datetime="${iso}">${timeStr}</time>
          </div>
        `;
        historyListEl.appendChild(item);
      }
      return;
    }
  });
});
