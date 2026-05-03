/**
 * String id for comparison with session userId — handles ObjectId, string, or
 * populated docs ({ _id, name, ... }) so .toString() is never "[object Object]".
 */
export function resolveRefId(ref: unknown): string | undefined {
  if (ref == null) return undefined;
  if (typeof ref === "string") return ref;
  if (typeof ref === "object" && ref !== null && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }
  return String(ref);
}
