type FetcherParams = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, any>;
  json?: boolean;
};

export const fetcher = async ({
  url,
  method,
  body,
  json = true,
}: FetcherParams) => {
  const res = await fetch(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("API error");

  if (json) {
    console.log(res);
    const data = await res.json();
    return data.data;
  }
};

export const register = (user) => {
  return fetcher({ url: "/api/register", method: "POST", body: user });
};

export const signin = (user) => {
  return fetcher({ url: "/api/signin", method: "POST", body: user });
};

export const createNewProject = (name) => {
  return fetcher({
    url: "/api/project",
    method: "POST",
    body: { name },
  });
};
