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

export const createNewTask = ({ name, description, projectId, due }) =>
  // : {
  //   name: string;
  //   description: string;
  //   projectId: string;
  // }
  {
    return fetcher({
      url: "/api/task",
      method: "POST",
      body: { name, description, projectId, due },
    });
  };

export const editTask = ({ id, name, description, projectId }) =>
  // : {
  //   name: string;
  //   description: string;
  //   projectId: string;
  // }
  {
    return fetcher({
      url: "/api/task",
      method: "PUT",
      body: { id, name, description, projectId },
    });
  };

export const changeTaskStatus = ({ id, status, projectId }) =>
  // : {
  //   name: string;
  //   description: string;
  //   projectId: string;
  // }
  {
    return fetcher({
      url: "/api/status",
      method: "PUT",
      body: { id, status, projectId },
    });
  };
