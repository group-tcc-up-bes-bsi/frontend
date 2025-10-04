import { UserObj } from "@/app/models/UserObj";

export async function deleteFavoriteOrganization(organizationId: number, userCurrent: UserObj) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/users/favorites/organizations/${organizationId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`
            },
        });

        await response.json().catch(() => null);
    } finally{}
}