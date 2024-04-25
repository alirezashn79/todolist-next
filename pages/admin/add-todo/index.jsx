import { connectToDB } from "@/configs/db-connection";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/utils/auth";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { client } from "@/configs/client";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

const schema = yup.object().shape({
  userId: yup.string().required().notOneOf(["-1"], "select a user"),
  todo: yup.string().required(),
  isComplete: yup.string().required(),
});

export default function AddTodoByAdmin({ users }) {
  // hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    values: {
      userId: "-1",
      todo: "",
      isComplete: false,
    },
    resolver: yupResolver(schema),
  });

  //   handlers
  const onSubmit = async (values) => {
    try {
      const res = await client.post("/admin/todo", {
        title: values.todo,
        userId: values.userId,
        isComplete: JSON.parse(values.isComplete),
      });
      console.log(res);
      if (res.status === 201) {
        toast.success(res.data.message);
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 mt-10 md:mt-0">
      <div className="flex justify-end">
        <Link className="form-btn" href="/">
          Home
        </Link>
      </div>
      {/* <ToastContainer /> */}
      <div className="md:w-1/3 w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="userId">User</label>
              <select
                {...register("userId")}
                className="form-input w-full"
                id="userId"
                defaultValue="-1"
              >
                <option disabled value="-1">
                  --select user---
                </option>
                {users.map((user) => (
                  <option
                    className="dark:bg-slate-600 bg-slate-200"
                    value={user._id}
                  >
                    {user.firstname} {user.lastname}
                  </option>
                ))}
              </select>
              <div className="text-rose-500">
                <ErrorMessage errors={errors} name="userId" />
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="todo">todo</label>
              <input
                {...register("todo")}
                className="w-full form-input"
                id="todo"
                placeholder="todo title"
              />
              <div className="text-rose-500">
                <ErrorMessage errors={errors} name="todo" />
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <input {...register("isComplete")} type="checkbox" />
              <span className="font-bold">Completed</span>
              <div className="text-rose-500">
                <ErrorMessage errors={errors} name="isComplete" />
              </div>
            </div>

            <button className="form-btn" type="submit">
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // ! token
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  //   !  check token is valid
  const tokenPayload = verifyToken(token);

  if (!tokenPayload) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  //   !  connect to database
  await connectToDB();

  // ! check user exist
  const user = await UserModel.findOne({ email: tokenPayload.email });

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  //   ! check user role
  if (user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const users = await UserModel.find({ role: "USER" }, "firstname lastname");

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}
