"use client";

import { FolderCrumb } from "@/components/folder-crumb";
import { FolderTable } from "@/components/table/folder-table";
import { getFolderById } from "@/client/api/folder.api";
import { useQuery } from "@tanstack/react-query";
import { FileType, FolderType } from "@/types";

interface Props {
  initialData: {
    breadCrumb: FolderType[];
    folder: FolderType[];
    file: FileType[];
  };
  id: string | null;
  q: string | null;
  filter: string | null;
}

export function FoldersClient({ initialData, id, q, filter }: Props) {
  const { data, isPending } = useQuery({
    queryKey: ["folder", id, q, filter],
    queryFn: () => getFolderById({ id, q, filter }),
    initialData: initialData,
    throwOnError: true,
  });

  if (!!isPending)
    return (
      <main className="lg:pl-64 pt-14 min-h-full">
        <section className="p-4 border-b">
          <FolderCrumb breadCrumb={[]} />
        </section>
        <FolderTable files={[]} folders={[]} />
        <section>
          <div className="p-2">
            <div className="h-8 rounded-md bg-secondary animate-pulse" />
          </div>
          <div className="p-2">
            <div className="h-8 rounded-md bg-secondary animate-pulse delay-100" />
          </div>
          <div className="p-2">
            <div className="h-8 rounded-md bg-secondary animate-pulse delay-200" />
          </div>
        </section>
      </main>
    );

  return (
    <main className="lg:pl-64 pt-14 min-h-full">
      <section className="p-4 border-b">
        <FolderCrumb breadCrumb={data.breadCrumb} />
      </section>
      <FolderTable files={data.files} folders={data.folders} />
    </main>
  );
}
