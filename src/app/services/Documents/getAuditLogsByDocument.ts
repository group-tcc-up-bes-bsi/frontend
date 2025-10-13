import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { DocumentObj } from "@/app/models/DocumentObj";
import { getErrorTitle } from "../ErrorTitle";
import { AuditLogObj } from "../../models/AuditLogObj";
import { logsType } from "../ConstantsTypes";
import { getUserById } from "../User/getUserById";

export async function getAuditLogsByDocument(
  userCurrent: UserObj,
  doc: DocumentObj
): Promise<{ message: MessageObj; logs: AuditLogObj[] }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/audit-logs/document/${doc.documentId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    const responseData = await response.json().catch(() => null);

    if (
      !responseData ||
      !Array.isArray(responseData) ||
      responseData.length === 0
    ) {
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(responseData?.statusCode || 404),
          "Nenhum log de auditoria encontrado",
          "error"
        ),
        logs: [],
      };
    }

    const logs: AuditLogObj[] = await Promise.all(
      responseData.map(async (item: AuditLogObj) => {
        const userResponse = await getUserById(item.userId, userCurrent);

        const username = userResponse?.user?.username ?? `User ${item.userId}`;

        return {
          action: logsType[item.action as keyof typeof logsType] || item.action,
          message: item.message,
          userId: item.userId,
          username,
          timestamp: new Date(item.timestamp).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "medium",
          }),
        };
      })
    );

    return {
      message: new MessageObj(
        "success",
        "Logs carregados",
        "Logs de auditoria carregados com sucesso",
        "success"
      ),
      logs,
    };
  } catch {
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        "Erro: Servidor inoperante",
        "error"
      ),
      logs: [],
    };
  }
}