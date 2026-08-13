import { ensurePressReleasesTable, db, type JsonValue } from "@/lib/db";
import type { PressRelease } from "@/data/pressReleases";

const isPressReleaseArray = (value: unknown): value is PressRelease[] => {
  return Array.isArray(value);
};

export const listPressReleases = async (): Promise<PressRelease[]> => {
  await ensurePressReleasesTable();

  const rows = await db
    .selectFrom("press_releases")
    .select(["payload", "updated_at"])
    .orderBy("updated_at", "desc")
    .where('title', '=', '医療法人せせらぎ')
    .execute();

  const releases = rows
    .map((row): unknown => row.payload)
    .filter((row): row is PressRelease => {
      return typeof row === "object" && row !== null && "id" in row && "title" in row;
    });

  return releases;
};

export const upsertPressRelease = async (release: PressRelease): Promise<PressRelease> => {
  await ensurePressReleasesTable();

  await db
    .insertInto("press_releases")
    .values({
      id: release.id,
      title: release.title,
      company: release.company,
      category: release.category,
      published_at: release.publishedAt,
      payload: release as unknown as JsonValue,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflict((oc) =>
      oc.column("id").doUpdateSet({
        title: release.title,
        company: release.company,
        category: release.category,
        published_at: release.publishedAt,
        payload: release as unknown as JsonValue,
        updated_at: new Date(),
      })
    )
    .execute();

  return release;
};

export const upsertPressReleases = async (releases: PressRelease[]) => {
  if (!isPressReleaseArray(releases) || releases.length === 0) {
    return;
  }

  await Promise.all(releases.map((release) => upsertPressRelease(release)));
};
