import { DocumentObj } from "@/app/models/DocumentObj";

export function countDocuments(
    documents: DocumentObj[]
): number {
    if (!documents || documents.length === 0) return 0;
    return documents.length;
}
