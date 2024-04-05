import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyToken } from "@/utils/auth";
import { connectToDB } from "@/configs/db-connection";
import { UserModel } from "@/models/User";
import Header from "@/components/Header";
import TodoCard from "@/components/TodoCard";
import { useEffect, useState } from "react";
// import { client } from "@/configs/client";
import TodoList from "@/components/Admin/TodoList";
import { TodoModel } from "@/models/Todo";
import { totalTodos } from "@/utils/utils";

export default function IndexPage({ user, todos }) {
  // states
  // const [currentUser, setCurrentUser] = useState(null);
  // const [todos, setTodos] = useState([]);
  const [reload, setReload] = useState(false);
  const [allTodos, setAllTodos] = useState([...todos]);

  // useEffect(() => {
  //   const getTodos = async () => {
  //     try {
  //       const res = await client.get("/todo");
  //       if (res.status === 200) {
  //         setTodos(res.data.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getTodos();
  // }, [reload]);

  // lifecycles
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   setCurrentUser(user);
  // }, []);

  return (
    <main>
      <ToastContainer />
      <Header user={user} setReload={setReload} />

      <section className="mt-32">
        <div className="container rounded-t-lg">
          <div className="w-full lg:w-3/4 max-h-[650px] md:max-h-[550px] overflow-auto bg-slate-900 mx-auto rounded-lg">
            {allTodos.length ? (
              <>
                <div className="sticky top-0 bg-slate-900 pt-3 pb-1 px-4">
                  <h3 className="text-xl font-semibold mb-4">
                    All Todos (
                    {user.role === "ADMIN" ? totalTodos(todos) : todos.length})
                  </h3>
                  <hr />
                </div>

                <div className="space-y-4 py-3 px-4">
                  {/* card */}
                  {user.role === "ADMIN" ? (
                    <TodoList setReload={setReload} todos={allTodos} />
                  ) : (
                    allTodos.map((todo) => (
                      <TodoCard
                        setReload={setReload}
                        todo={todo}
                        key={todo._id}
                      />
                    ))
                  )}
                  {/* card end */}
                </div>
              </>
            ) : (
              <h3 className="text-center text-4xl m-20">There is no todo</h3>
            )}
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
    "_id firstname lastname email role"
  );
  let todos;
  if (user.role === "ADMIN") {
    const allTodos = await TodoModel.find({}).populate("user").exec();
    const users = [...new Set(allTodos.map((todo) => todo.user._id))];
    console.log(users);
    todos = users.map((user) => {
      return allTodos.filter((todo) => todo.user._id === user);
    });
    console.log(todos);
  } else if (user.role === "USER") {
    todos = await TodoModel.find().where({ user: user._id });
  } else {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      todos: JSON.parse(JSON.stringify(todos)),
    },
  };
}
