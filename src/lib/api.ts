type FetcherParams = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: User;
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

type User = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export const register = (user: User) => {
  return fetcher({ url: "/api/auth/register", method: "POST", body: user });
};

export const signin = (user: User) => {
  return fetcher({ url: "/api/auth/signin", method: "POST", body: user });
};
