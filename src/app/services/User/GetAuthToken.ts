import { UserObj } from "@/app/models/UserObj";

export function getAuthToken(): string {
  const jwtToken = localStorage.getItem("jwtToken");
  if (jwtToken) {
    return jwtToken;
  }
  return "Usuário não autenticado";
}

export function getMeAuth(): Promise<UserObj | null> {
  const jwtTokenCurrent = getAuthToken();
  if (!jwtTokenCurrent) {
    return Promise.resolve(null);
  }

  return fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtTokenCurrent}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((data) => {
      return {
        userId: data.userId,
        username: data.username,
        jwtToken: jwtTokenCurrent,
      } as UserObj;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      return null;
    });
}
