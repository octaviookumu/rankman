let baseApiUrl: string;

if (process.env.NODE_ENV === "production") {
  baseApiUrl = `https://${process.env.NEXT_PUBLIC_API_HOST}`;
} else {
  baseApiUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}`;
}

interface APIError {
  messages: string[];
  statusCode?: number;
}

interface MakeRequestResponse<T> {
  data: T | Record<string, never>;
  error?: APIError;
}

const makeRequest = async <T>(
  endpoint: string,
  reqInit?: RequestInit
): Promise<MakeRequestResponse<T>> => {
  try {
    const response = await fetch(`${baseApiUrl}${endpoint}`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : "https://rankman-client-git-fixer-octaviookumu.vercel.app",
      },
      ...reqInit,
    });

    const responseJSON = await response.json();

    if (!response.ok) {
      return {
        data: {},
        error: responseJSON as APIError,
      };
    }

    return {
      data: responseJSON as T,
    };
  } catch (e) {
    const error =
      e instanceof Error
        ? {
            messages: [
              process.env.MODE === "development" ? e.message : "Unknown error",
            ],
          }
        : {
            messages: ["Unknown error"],
          };

    return {
      data: {},
      error,
    };
  }
};

export { makeRequest };
