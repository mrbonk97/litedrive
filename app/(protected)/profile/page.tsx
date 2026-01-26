import { getUserMe } from "@/client/api/user.api.ssr";
import { UsageChart } from "@/components/chart/usage-chart";
import { UserUpdateForm } from "@/components/form/user-update-form";
import { UserRound } from "lucide-react";

const ProfilePage = async () => {
  const user = await getUserMe();

  return (
    <main className="p-4 pt-18 mx-auto max-w-2xl">
      <header className="mt-4 p-4 bg-rose-200 rounded">
        <h1 className="text-2xl font-bold opacity-80">프로필</h1>
        <div className="mt-2 flex justify-between">
          <div className="">
            <h2 className="text-sm font-medium opacity-80">{user.username}</h2>
            <div className="text-sm font-medium opacity-70">
              가입일: {user.createdAt.substring(0, 10)}
            </div>
          </div>
          <UserRound className="p-2 text-rose-400" size={128} />
        </div>
      </header>

      <section className="mt-8">
        <h4 className="pb-2 text-2xl font-bold opacity-80 border-b">사용량</h4>
        <UsageChart usage={user.totalSize} />
        <div className="text-lg font-semibold opacity-80 text-center">
          총 파일수: {user.fileCount}개
        </div>
      </section>

      <section className="mt-8">
        <h4 className="pb-2 text-2xl font-bold opacity-80 border-b">수정</h4>
        <UserUpdateForm />
      </section>
    </main>
  );
};

export default ProfilePage;
