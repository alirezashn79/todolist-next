const { connect, connections } = require("mongoose");

export async function connectToDB() {
  try {
    if (connections[0].readyState) return;
    await connect(process.env.DATABASE_URI);
    console.log("connected to database 🙂");
  } catch (error) {
    console.log("database connection error =>", error);
  }
}
