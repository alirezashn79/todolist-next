import { client } from "@/configs/client";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Profile({ user }) {
  // states
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  // hooks
  const router = useRouter();

  // handlers
  const onLogout = async () => {
    try {
      const res = await client.get("/auth/signout");
      if (res.status === 200) {
        toast.success("logout ❤️👋");
        setTimeout(() => {
          router.replace("/signin");
        }, 1000);
      }
    } catch (error) {
      toast.success("Error");
    }
  };

  return (
    <button
      onFocus={() => setIsOpenProfile(true)}
      onBlur={() => setIsOpenProfile(false)}
      className="relative flex items-center gap-x-2"
    >
      <User className="icon" />
      <h3 className="text-sm md:text-base lg:text-lg font-semibold capitalize">
        {user?.firstname} {user?.lastname}
      </h3>
      {isOpenProfile && (
        <div className="absolute top-full mt-6 lg:mt-5 bg-slate-700  border border-slate-800 rounded-lg  w-32 md:w-36 lg:w-40 p-1 z-10">
          <div
            onClick={onLogout}
            className="h-10 flex items-center justify-center gap-2 w-full font-semibold text-rose-500 hover:bg-rose-500 hover:text-slate-50 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span className="capitalize">logout</span>
          </div>
        </div>
      )}
    </button>
  );
}
