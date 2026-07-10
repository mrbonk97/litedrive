import { ChangePasswordForm } from "@/features/auth/ui/change-password-form";
import { DeleteAccountDialog } from "@/features/auth/ui/delete-account-dialog";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";
import { getRecentFiles } from "@/features/files/api/get-recent-files.api";
import { getFolderCount } from "@/features/folders/api/get-folder-count.api";
import { createProfileSummary } from "@/features/profile/model/profile-summary";
import { ProfileHeader } from "@/features/profile/ui/profile-header";
import { ProfileRecentFiles } from "@/features/profile/ui/profile-recent-files";
import { ProfileStats } from "@/features/profile/ui/profile-stats";
import { ProfileStorageUsage } from "@/features/profile/ui/profile-storage-usage";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  const [files, folderCount] = await Promise.all([
    getRecentFiles(supabase, user!.id),
    getFolderCount(supabase, user!.id),
  ]);

  const summary = createProfileSummary(files, folderCount);

  return (
    <main className="p-4 mx-auto max-w-5xl grid grid-cols-4 gap-4">
      <ProfileHeader user={user!} summary={summary} />
      <ProfileStats summary={summary} />
      <ProfileStorageUsage summary={summary} />
      <ProfileRecentFiles files={summary.latestFiles} />
      <ChangePasswordForm />
      <DeleteAccountDialog />
    </main>
  );
}
