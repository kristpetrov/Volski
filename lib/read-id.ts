export async function readId(
  searchParams: Promise<{ id?: string | string[] }>,
) {
  const params = await searchParams;
  const id = params.id;
  if (Array.isArray(id)) return id[0] ?? null;
  return id ?? null;
}
