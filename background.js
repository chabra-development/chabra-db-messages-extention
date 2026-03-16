const API_BASE = "https://chabra-db-messages-extention.vercel.app";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "TAGS_REQUEST") return;

  handleRequest(message.payload)
    .then((data) => sendResponse({ ok: true, data }))
    .catch((err) => sendResponse({ ok: false, error: err.message }));

  return true;
});

async function handleRequest({ action, ...args }) {
  switch (action) {

    case "GET_CONTACT_TAGS":
      return apiFetch(`/api/tags/${encode(args.contactIdentity)}`);

    case "SET_CONTACT_TAGS":
      return apiFetch(`/api/tags/${encode(args.contactIdentity)}`, {
        method: "PUT",
        body: { tagIds: args.tagIds },
      });

    case "SEARCH_TAGS":
      return apiFetch(`/api/tags?search=${encode(args.query)}&take=6`);

    case "CREATE_TAG":
      return apiFetch("/api/tags", {
        method: "POST",
        body: { tags: [args.name], ...(args.color ? { color: args.color } : {}) },
      });

    default:
      throw new Error(`Ação desconhecida: ${action}`);
  }
}

async function apiFetch(path, { method = "GET", body } = {}) {
  const url = `${API_BASE}${path}`;
  const reqBody = body ? JSON.stringify(body) : undefined;

  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: reqBody,
  });

  let rawText = "";
  let json = {};
  try {
    rawText = await res.text();
    json = JSON.parse(rawText);
  } catch {
    json = {};
  }

  if (!res.ok) {
    console.error(`[TAGS API] ${method} ${url} → ${res.status}\nReq: ${reqBody}\nRes: ${rawText}`);
    const errMsg = typeof json.error === "object"
      ? JSON.stringify(json.error)
      : (json.error || `Erro ${res.status}`);
    throw new Error(errMsg);
  }

  return json;
}

function encode(value) {
  return encodeURIComponent(value ?? "");
}
