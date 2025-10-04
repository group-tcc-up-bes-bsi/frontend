import { DocumentObj } from "@/app/models/DocumentObj";
import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";

export async function createVersion(
  userCurrent: UserObj,
  doc: DocumentObj,
  name: string,
  file: File
): Promise<MessageObj> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/document-versions`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentId", doc.documentId.toString());
  formData.append("name", name);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return new MessageObj("error", "Erro", error.message, "error");
    }

    return new MessageObj(
      "success",
      "Versão criada",
      "A nova versão foi enviada com sucesso",
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
