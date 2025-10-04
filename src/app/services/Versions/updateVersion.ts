import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { VersionObj } from "@/app/models/VersionObj";

export async function updateVersion(
  userCurrent: UserObj,
  version: VersionObj,
  Name: string,
): Promise<MessageObj> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/document-versions/${version.documentVersionId}`;

  const versionData = {
    name: Name,
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(versionData),
    });

    if (!response.ok) {
      const error = await response.json();
      return new MessageObj("error", "Erro", error.message, "error");
    }

    return new MessageObj(
      "success",
      "Versão Atualizada",
      "A versão foi atualizada com sucesso",
      "success"
    );
  } catch {
    return new MessageObj(
      "error",
      "Erro de servidor",
      "Não foi possível enviar a versão",
      "error"
    );
  }
}
