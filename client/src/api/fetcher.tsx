export const fetcher = (info: RequestInfo, init?: RequestInit) =>
  fetch(info, init).then(async (res) => {
    if (!res.ok) {
      throw await res.json();
    }

    return res.json();
  });
