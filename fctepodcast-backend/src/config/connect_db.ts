import mongoose from "mongoose";

if (process.env.MONGO_URL === undefined) {
  console.error("MONGO_URL não está definido!");
  process.exit(1);
}

const connect_db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export default connect_db;
