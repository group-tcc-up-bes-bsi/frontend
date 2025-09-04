import { useEffect } from "react";
import { getAuthToken } from "../services/User/GetAuthToken";
import { logoutUser } from "../services/User/logoutUser";

export function useAuth() {

  useEffect(() => {
    const token = getAuthToken();
    if (token === "Usuário não autenticado") {
      logoutUser();
      return;
    }
  }, []);
}
