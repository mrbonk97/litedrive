import { z } from "zod";
import { db } from "@/db/db";
import { and, eq, isNull, like, sql } from "drizzle-orm";
import { files, folders, users } from "@/db/schema";
import { toDrizzleSet } from "./service-utils";
import { patchFolderSchema } from "@/schemas/folder-schema";

export async function getRootFolder(
  userId: string,
  q: string | null,
  filter: string | null
) {
  // 검색을 했을 때
  if (q?.trim()) {
    const _files = await db
      .select({
        id: files.id,
        name: files.name,
        type: files.type,
        size: files.size,
        share: files.share,
        ownerId: files.ownerId,
        ownerName: users.username,
        folderId: files.folderId,
        createdAt: files.createdAt,
        updatedAt: files.updatedAt,
      })
      .from(files)
      .innerJoin(users, eq(files.ownerId, users.id))
      .where(
        and(
          like(sql`lower(${files.name})`, `%${q.toLowerCase()}%`),
          eq(files.ownerId, userId),
          eq(files.uploadStatus, "success")
        )
      )
      .orderBy(files.createdAt);

    const _folders = await db
      .select({
        id: folders.id,
        name: folders.name,
        ownerId: folders.ownerId,
        ownerName: users.username,
        parentFolderId: folders.parentFolderId,
        createdAt: folders.createdAt,
        updatedAt: folders.updatedAt,
      })
      .from(folders)
      .innerJoin(users, eq(folders.ownerId, users.id))
      .where(and(like(folders.name, `%${q}%`), eq(folders.ownerId, userId)))
      .orderBy(folders.createdAt);

    return { files: _files, folders: _folders };
  }

  // filter를 걸었을 때
  if (filter === "share") {
    const _files = await db
      .select({
        id: files.id,
        name: files.name,
        type: files.type,
        size: files.size,
        share: files.share,
        ownerId: files.ownerId,
        ownerName: users.username,
        folderId: files.folderId,
        createdAt: files.createdAt,
        updatedAt: files.updatedAt,
      })
      .from(files)
      .innerJoin(users, eq(files.ownerId, users.id))
      .where(
        and(
          eq(files.share, true),
          eq(files.ownerId, userId),
          eq(files.uploadStatus, "success")
        )
      )
      .orderBy(files.createdAt);

    return { files: _files, folders: [] };
  }

  const _files = await db
    .select({
      id: files.id,
      name: files.name,
      type: files.type,
      size: files.size,
      share: files.share,
      ownerId: files.ownerId,
      ownerName: users.username,
      folderId: files.folderId,
      createdAt: files.createdAt,
      updatedAt: files.updatedAt,
    })
    .from(files)
    .innerJoin(users, eq(files.ownerId, users.id))
    .where(
      and(
        isNull(files.folderId),
        eq(files.ownerId, userId),
        eq(files.uploadStatus, "success")
      )
    )
    .orderBy(files.createdAt);

  const _folders = await db
    .select({
      id: folders.id,
      name: folders.name,
      ownerId: folders.ownerId,
      ownerName: users.username,
      parentFolderId: folders.parentFolderId,
      createdAt: folders.createdAt,
      updatedAt: folders.updatedAt,
    })
    .from(folders)
    .innerJoin(users, eq(folders.ownerId, users.id))
    .where(and(isNull(folders.parentFolderId), eq(folders.ownerId, userId)))
    .orderBy(folders.createdAt);

  return { files: _files, folders: _folders };
}

export async function getFolderById(userId: string, folderId: string) {
  const _files = await db
    .select({
      id: files.id,
      name: files.name,
      type: files.type,
      size: files.size,
      share: files.share,
      ownerId: files.ownerId,
      ownerName: users.username,
      folderId: files.folderId,
      createdAt: files.createdAt,
      updatedAt: files.updatedAt,
    })
    .from(files)
    .innerJoin(users, eq(files.ownerId, users.id))
    .where(
      and(
        eq(files.folderId, folderId),
        eq(files.ownerId, userId),
        eq(files.uploadStatus, "success")
      )
    )
    .orderBy(files.createdAt);

  const _folders = await db
    .select({
      id: folders.id,
      name: folders.name,
      ownerId: folders.ownerId,
      ownerName: users.username,
      parentFolderId: folders.parentFolderId,
      createdAt: folders.createdAt,
      updatedAt: folders.updatedAt,
    })
    .from(folders)
    .innerJoin(users, eq(folders.ownerId, users.id))
    .where(
      and(eq(folders.parentFolderId, folderId), eq(folders.ownerId, userId))
    )
    .orderBy(folders.createdAt);

  return { files: _files, folders: _folders };
}

export async function getFolderBreadcrumb(userId: string, folderId: string) {
  const breadcrumb: { id: string; name: string }[] = [];

  let currentFolderId: string | null = folderId;

  while (currentFolderId) {
    const [folder] = await db
      .select({
        id: folders.id,
        name: folders.name,
        parentFolderId: folders.parentFolderId,
      })
      .from(folders)
      .where(and(eq(folders.id, currentFolderId), eq(folders.ownerId, userId)))
      .limit(1);

    if (!folder) break;

    breadcrumb.push({
      id: folder.id,
      name: folder.name,
    });

    currentFolderId = folder.parentFolderId;
  }

  return breadcrumb.reverse(); // root → current
}

export async function postFolder(
  userId: string,
  name: string,
  parentFolderId: string | null | undefined
) {
  const [folder] = await db
    .insert(folders)
    .values({ ownerId: userId, name: name, parentFolderId: parentFolderId })
    .returning();

  if (!folder) {
    throw new Error("FOLDER CREATE FAILED");
  }

  return folder;
}

export async function deleteFolderById(userId: string, folderId: string) {
  const [folder] = await db
    .delete(folders)
    .where(and(eq(folders.id, folderId), eq(folders.ownerId, userId)))
    .returning();

  if (!folder) {
    throw new Error("FILE NOT FOUND OR UNAUTHORIZED");
  }

  return folder;
}

export async function patchFolderById(
  userId: string,
  folderId: string,
  data: z.infer<typeof patchFolderSchema>
) {
  const updateData = toDrizzleSet(data);

  const [folder] = await db
    .update(folders)
    .set({ ...updateData, updatedAt: new Date() })
    .where(and(eq(folders.id, folderId), eq(folders.ownerId, userId)))
    .returning();

  if (!folder) {
    throw new Error("FOLDER NOT FOUND OR UNAUTHORIZED");
  }

  return folder;
}
