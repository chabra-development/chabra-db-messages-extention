const checkingEl     = document.getElementById("checking");
const noPortalEl     = document.getElementById("no-portal");
const contactEl      = document.getElementById("contact-section");
const contactDisplay = document.getElementById("contact-display");

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.url?.includes("chabra.desk.blip.ai")) {
    checkingEl.hidden = true;
    noPortalEl.hidden = false;
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "GET_CURRENT_CONTACT" }, (res) => {
    checkingEl.hidden = true;
    if (chrome.runtime.lastError || !res?.contactIdentity) return;
    contactEl.hidden = false;
    contactDisplay.textContent = res.contactIdentity;
  });
}

init();
