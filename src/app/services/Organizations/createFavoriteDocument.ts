import { UserObj } from "@/app/models/UserObj";

export async function createFavoriteOrganization(
    orgId: number,
    userCurrent: UserObj
){
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/users/favorites/organizations/${orgId}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    await response.json().catch(() => null);
  } catch (error) {
    console.error(error);
  }
}
