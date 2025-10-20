import { UsageChart } from "@/components/chart/usage-chart";
import { UserUpdateForm } from "@/components/form/user-update-form";
import { getUserInfo } from "@/services/user-server";
import { UserRound } from "lucide-react";

const ProfilePage = async () => {
  const { user } = await getUserInfo();

  return (
    <main className="p-4 pt-[4.5rem] mx-auto max-w-2xl">
      <header className="mt-4 p-4 bg-rose-200 rounded">
        <h1 className="text-2xl font-bold opacity-80">프로필</h1>
        <div className="mt-2 flex justify-between">
          <div className="">
            <h2 className="text-sm font-medium opacity-80">아이디: {user.USERNAME}</h2>
            <div className="text-sm font-medium opacity-70">
              가입일: {user.CREATED_AT.substring(0, 10)}
            </div>
          </div>
          <UserRound className="p-2 text-rose-400" size={128} />
        </div>
      </header>

      <section className="mt-8">
        <h4 className="pb-2 text-2xl font-bold opacity-80 border-b">사용량</h4>
        <UsageChart usage={user.TOTAL_FILE_SIZE} />
        <div className="text-lg font-semibold opacity-80 text-center">
          총 파일수: {user.FILE_COUNT}개
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
