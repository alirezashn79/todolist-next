import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import { client } from "@/configs/client";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyToken } from "@/utils/auth";
import { UserModel } from "@/models/User";
import { connectToDB } from "@/configs/db-connection";

const schema = yup.object().shape({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  username: yup.string().min(6).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});
export default function SignUpPage() {
  // hooks
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  // handlers
  const onSubmit = async (values) => {
    try {
      const res = await client.post("/auth/signup", values);
      console.log(res);
      if (res.status === 201) {
        // localStorage.setItem("user", JSON.stringify(res.data.data));
        toast.success(res.data.message);
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data.message);
      if (err.response.status === 409) {
        setTimeout(() => {
          router.push("/signin");
        }, 500);
      }
    }
  };
  return (
    <div className="w-screen h-screen mt-20 md:mt-0 flex md:items-center justify-center">
      {/* <ToastContainer /> */}
      <div className="form-box">
        <h2 className="text-2xl font-semibold text-center">SignUp Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-2 flex flex-col gap-y-2">
            <label htmlFor="firstname">firstname</label>
            <input
              {...register("firstname")}
              autoFocus
              id="firstname"
              type="text"
              className="form-input"
              placeholder="Enter username or email"
            />
            <ErrorMessage
              errors={errors}
              name="firstname"
              render={({ message }) => (
                <small className="text-rose-500">{message}</small>
              )}
            />
          </div>

          <div className="my-2 flex flex-col gap-y-2">
            <label htmlFor="lastname">lastname</label>
            <input
              {...register("lastname")}
              id="lastname"
              type="text"
              className="form-input"
              placeholder="Enter username or email"
            />
            <ErrorMessage
              errors={errors}
              name="lastname"
              render={({ message }) => (
                <small className="text-rose-500">{message}</small>
              )}
            />
          </div>

          <div className="my-2 flex flex-col gap-y-2">
            <label htmlFor="username">username</label>
            <input
              {...register("username")}
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter username or email"
            />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => (
                <small className="text-rose-500">{message}</small>
              )}
            />
          </div>

          <div className="my-2 flex flex-col gap-y-2">
            <label htmlFor="email">email</label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter username or email"
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <small className="text-rose-500">{message}</small>
              )}
            />
          </div>

          <div className="my-2 flex flex-col gap-y-2">
            <label htmlFor="password">password</label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="form-input"
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
            <button className="form-btn">submit</button>
          </div>
        </form>
        <div className="mt-1">
          <span>Do you have an account? </span>
          <Link className="form-link" href="/signin">
            signin
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
