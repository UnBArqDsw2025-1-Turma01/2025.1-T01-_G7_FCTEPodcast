import express from "express";
import file_router from "../../routes/file_router/file_router";
import request from "supertest";
import fs from "fs";

jest.mock("fs");

describe("Testes do roteador de arquivos", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use("/file", file_router);
  });

  it("Deve retornar status 200 na rota /status", async () => {
    const response = await request(app).get("/file/status");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      message: "File router is running",
    });
  });

  //   it("Deve retornar áudio com streaming parcial", async () => {
  //     // Mock do tamanho do arquivo
  //     (fs.statSync as jest.Mock).mockReturnValue({ size: 1000000 });

  //     // Cria um stream PassThrough customizado que emite dados e fecha corretamente
  //     const mockStream = new stream.PassThrough();

  //     (fs.createReadStream as jest.Mock).mockImplementation(() => {
  //       // Simula um fluxo de dados com delay e depois finaliza
  //       process.nextTick(() => {
  //         mockStream.write("FAKE_AUDIO_DATA");
  //         mockStream.end();
  //       });
  //       return mockStream;
  //     });

  //     const response = await request(app)
  //       .get("/file/audio/fake_path.mp3")
  //       .set("Range", "bytes=0-");

  //     expect(response.status).toBe(206);
  //     expect(response.headers["content-range"]).toBe("bytes 0-999999/1000000");
  //     expect(response.headers["content-type"]).toBe("audio/mpeg");
  //     expect(response.text).toContain("FAKE_AUDIO_DATA");
  //   });

  it("Deve retornar erro 404 se Range não for fornecido", async () => {
    const response = await request(app).get("/file/audio/test.mp3");

    expect(response.status).toBe(400);
    expect(response.text).toBe("Requires Range header");
  });

  it("Deve retornar erro 500 se o arquivo não existir", async () => {
    (fs.statSync as jest.Mock).mockImplementation(() => {
      throw new Error("Arquivo não encontrado");
    });

    const response = await request(app)
      .get("/file/audio/inexistente.mp3")
      .set("Range", "bytes=0-");

    expect(response.status).toBe(500);
  });
});
