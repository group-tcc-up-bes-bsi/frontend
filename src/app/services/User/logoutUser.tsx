import { useUserStore } from "@/app/state/userState";

const alterUserCurrent = useUserStore.getState().alter;

export function logoutUser() {
  localStorage.removeItem("jwtToken");
  
  alterUserCurrent({
    userId: 0,
    username: "",
    jwtToken: ""
  });

  window.location.href = "/";
}
