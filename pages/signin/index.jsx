import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import { client } from "@/configs/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { verifyToken } from "@/utils/auth";
import { UserModel } from "@/models/User";
import { connectToDB } from "@/configs/db-connection";

const schema = yup.object().shape({
  identifier: yup.string().required(),
  password: yup.string().min(6).required(),
});
export default function SignInPage() {
  // hooks
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      identifier: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  // handlers
  const onSubmit = async (values) => {
    try {
      const res = await client.post("/auth/signin", values);
      if (res.status === 200) {
        // localStorage.setItem("user", JSON.stringify(res.data.data));
        toast.success(res.data.message);
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data.message);
      console.log(err.response);
    }
  };
  return (
    <div className="w-screen h-screen mt-20 md:mt-0 flex md:items-center justify-center">
      <ToastContainer />
      <div className="h-fit bg-slate-600 w-96 p-4 rounded-md capitalize">
        <h2 className="text-2xl font-semibold text-center">Signin Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4 flex flex-col gap-y-2">
            <label htmlFor="identifier">email | username</label>
            <input
              {...register("identifier")}
              id="identifier"
              autoFocus={true}
              type="text"
              className="p-2 border-2 border-slate-50 rounded-lg bg-transparent outline-none"
              placeholder="Enter username or email"
            />
            <ErrorMessage
              errors={errors}
              name="identifier"
              render={({ message }) => (
                <small className="text-rose-500">{message}</small>
              )}
            />
          </div>

          <div className="my-4 flex flex-col gap-y-2">
            <label htmlFor="password">password</label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="p-2 border-2 border-slate-50 rounded-lg bg-transparent outline-none"
              placeholder="Enter password"
            />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <small className="text-rose-500">{message}</small>
              )}
            />
          </div>

          <div className="flex justify-center">
            <button className="bg-slate-700 py-3 rounded px-8 disabled:opacity-50">
              submit
            </button>
          </div>
        </form>
        <div className="mt-1">
          <span>Have you not registered? </span>
          <Link className="text-indigo-300 underline" href="/signup">
            signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // !  check token
  const { token } = context.req.cookies;

  if (!!token) {
    // !  verify token
    const isVerifyToken = verifyToken(token);

    if (!!isVerifyToken) {
      // !  connect to database
      await connectToDB();
    }
    // !  check user
    const user = await UserModel.findOne({ email: isVerifyToken.email });

    if (!!user) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }
  }

  return {
    props: {},
  };
}
