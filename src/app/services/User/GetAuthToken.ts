export function getAuthToken(): string {
  const jwtToken = localStorage.getItem("jwtToken");
  if (jwtToken) {
    return jwtToken;
  }
  return "Usuário não autenticado";
}
