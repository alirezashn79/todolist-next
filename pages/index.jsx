import { client } from "@/configs/client";
import { User, ClipboardPlus, LogOut, Trash2, SquarePen } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyToken } from "@/utils/auth";
import { connectToDB } from "@/configs/db-connection";
import { UserModel } from "@/models/User";

export default function IndexPage({ user }) {
  // states
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [todoForm, setTodoForm] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  // const [currentUser, setCurrentUser] = useState(null);

  // hooks
  const router = useRouter();

  // handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todoForm.trim()) {
      try {
        const res = await client.post("/todo", { title: todoForm });
        console.log(res);
        if (res.status === 201) {
          setTodoForm("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      customClass: "alert",
      icon: "warning",
      iconColor: "#e11d48",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#e11d48",
      color: "#f8fafc",
      background: "#1e293b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("deleted");
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleLogout = async () => {
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

  // lifecycles
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   setCurrentUser(user);
  // }, []);

  return (
    <main>
      <ToastContainer />
      <header className="fixed top-0 left-0 right-0 bg-slate-700 h-16">
        <div className="relative container h-full">
          <div className="w-full h-full flex items-center justify-between">
            {/* name and avatar */}
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
                    onClick={handleLogout}
                    className="h-10 flex items-center justify-center gap-2 w-full font-semibold text-rose-500 hover:bg-rose-500 hover:text-slate-50 rounded-md transition-colors cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="capitalize">logout</span>
                  </div>
                </div>
              )}
            </button>
            {/* name and avatar end */}

            {/* heading text */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              Todo List
            </h2>
            {/* heading text end */}

            {/* add btn */}
            <button
              onClick={() => setOpenSearch((prev) => !prev)}
              className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg  transition-colors ${
                openSearch
                  ? "bg-slate-50 text-slate-800"
                  : "bg-transparent text-slate-50"
              }`}
            >
              <span className="text-sm md:text-base">add todo</span>
              <ClipboardPlus className="icon" />
            </button>
            {/* add btn end */}
            {openSearch && (
              <div className="absolute min-h-10 p-1 bg-slate-700 top-full right-4 left-4 lg:right-24 lg:left-24 mt-1 rounded-lg">
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-x-2">
                    <input
                      value={todoForm}
                      onChange={(e) => setTodoForm(e.target.value)}
                      className="flex-1 p-2 bg-transparent outline-none border border-slate-50 rounded-md"
                      autoFocus
                      placeholder="write todo"
                      type="text"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-slate-50 text-slate-800 border border-slate-800 rounded-md px-4 py-2"
                    >
                      add task
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="mt-32">
        <div className="container rounded-t-lg">
          <div className="w-full lg:w-3/4 max-h-[650px] md:max-h-[550px] overflow-auto bg-slate-900 mx-auto rounded-lg">
            <div className="sticky top-0 bg-slate-900 pt-3 pb-1 px-4">
              <h3 className="text-xl font-semibold mb-4">Todos (1)</h3>
              <hr />
            </div>
            <div className="space-y-4 py-3 px-4">
              {/* card */}
              <div
                className={`card ${
                  isChecked ? "card-completed" : "card-incompleted"
                }`}
              >
                <input
                  type="checkbox"
                  className="shrink-0 w-5 h-5 shadow-none"
                  onChange={(e) => setIsChecked(e.target.checked)}
                  checked={isChecked}
                />

                <p
                  className={`text-pretty text-base mx-4 line-clamp-2 ${
                    isChecked && "line-through"
                  } transition-all`}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                  error magni non, officiis quod alias adipisci repellendus
                  minima praesentium blanditiis modi sapiente veniam ea numquam
                  repudiandae molestias repellat dolor amet!
                </p>

                <button className="mx-auto text-slate-50 bg-sky-800 p-2  rounded-l-3xl mr-1">
                  <SquarePen className="h-5 w-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="mx-auto text-slate-50 bg-rose-500 p-2  rounded-r-3xl"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              {/* card end */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  // ! check cookie exist
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  // ! verify token
  const isVerifyToken = verifyToken(token);

  if (!isVerifyToken) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  // ! connect to database
  await connectToDB();

  // !  find email
  const user = await UserModel.findOne(
    { email: isVerifyToken.email },
    "_id firstname lastname email"
  );

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}
