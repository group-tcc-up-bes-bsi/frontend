import { useEffect } from "react";
import { getMeAuth } from "../services/User/GetAuthToken";
import { logoutUser } from "../services/User/logoutUser";
import { useUserStore } from "../state/userState";

export function useAuth() {
  const alterUserCurrent = useUserStore((state) => state.alter);
  
  useEffect(() => {
    async function fetchUserData() {
      const userCurrent = await getMeAuth();
      if (userCurrent) {
        alterUserCurrent(userCurrent);
      } else {
        logoutUser();
      }
    }
    fetchUserData();
  }, []);
}
