import mongoose from "mongoose";
import connect_db from "../../config/connect_db";

jest.mock("mongoose");

describe("Teste de conexão com o banco de dados", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("deve chamar mongoose.connect se MONGO_URL estiver definido", async () => {
    process.env.MONGO_URL = "mongodb://localhost:27017/testdb";
    (mongoose.connect as jest.Mock).mockResolvedValue(true);

    await connect_db();

    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/testdb"
    );
  });

  it("deve logar erro e chamar process.exit se MONGO_URL não estiver definido", async () => {
    delete process.env.MONGO_URL;

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit foi chamado");
    });

    await expect(connect_db()).rejects.toThrow("process.exit foi chamado");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "MONGO_URL não está definido!"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it("deve logar erro se a conexão falhar", async () => {
    process.env.MONGO_URL = "mongodb://localhost:27017/testdb";

    const error = new Error("Falha na conexão");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await connect_db();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error connecting to the database:",
      error
    );

    consoleErrorSpy.mockRestore();
  });
});
