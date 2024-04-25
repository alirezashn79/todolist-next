import { client } from "@/configs/client";
import { connectToDB } from "@/configs/db-connection";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/utils/auth";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function Users({ users: allUsers }) {
  const [users, setUsers] = useState(allUsers);
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      customClass: "alert",
      icon: "warning",
      iconColor: "#e11d48",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#e11d48",
      // color: "#f8fafc",
      // background: "#1e293b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const res = client
          .delete(`/admin/users/${id}`)
          .then((res) => {
            const filteredUsers = users.filter((item) => item._id !== id);
            setUsers(filteredUsers);
            toast.success(res.data.message);
          })
          .catch((err) => console.log(err.response.data));
      }
    });
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="flex mt-10">
        <div className="p-8 space-y-2  w-full md:basis-1/2 mx-auto">
          {users.length > 0 ? (
            users.map((item) => (
              <div
                key={item._id}
                className="w-full border border-gray-500 p-4 rounded flex items-center justify-between"
              >
                <span>
                  {item.firstname} {item.lastname}
                </span>
                <button
                  className="text-rose-500"
                  onClick={onDelete.bind(null, item._id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <span>No user</span>
          )}
        </div>
      </div>
    </>
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
