import { useEffect } from "react";
import { getAuthToken, getMeAuth } from "../services/User/GetAuthToken";
import { useUserStore } from "../state/userState";
import { logoutUser } from "../services/User/logoutUser";

export function useAuth() {
  const alterUserCurrent = useUserStore((state) => state.alter);

  useEffect(() => {
    const token = getAuthToken();
    if (token === "Usuário não autenticado") {
      logoutUser();
      return;
    }

    async function fetchUserData() {
      const userCurrent = await getMeAuth();
      if (userCurrent) {
        alterUserCurrent(userCurrent);
      } else {
        logoutUser();
      }
    }

    fetchUserData();
  }, [alterUserCurrent]);
}
