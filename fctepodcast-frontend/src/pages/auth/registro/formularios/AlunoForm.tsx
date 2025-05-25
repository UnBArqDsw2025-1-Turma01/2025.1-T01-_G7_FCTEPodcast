import { addToast, Input, Button } from "@heroui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_API_URL } from "../../../../utils/constants";
import { useNavigate } from "react-router";

const AlunoForm = () => {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [erros, setErros] = useState<{ Key: string; errors: string[] }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (senha && confirmarSenha) {
      if (senha !== confirmarSenha) {
        setErros((prev) => [
          ...prev,
          {
            Key: "senha",
            errors: ["As senhas não conferem"],
          },
        ]);
      } else {
        setErros((prev) => prev.filter((error) => error.Key !== "senha"));
      }
    }
  }, [senha, confirmarSenha]);

  const handleRegisterProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nome === "" || email === "" || senha === "") {
      addToast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        color: "danger",
      });
      return;
    }
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axios.post(
        `${BASE_API_URL}/usuario/aluno/registrar`,
        {
          nome,
          email,
          senha,
        }
      );

      addToast({
        title: "Sucesso",
        description: response.data.message,
        color: "success",
      });

      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: error.response.data.title,
        description:
          error.response.data.message ||
          error.response.data.errors.join(";\n "),
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const button_disabled = () => {
    if (nome === "" || email === "" || senha === "") {
      return true;
    }
    if (erros.length > 0) {
      return true;
    }

    return false;
  };

  return (
    <form
      onSubmit={handleRegisterProfessor}
      className="flex flex-col items-center justify-center gap-5"
    >
      <Input label="Nome" onChange={(e) => setNome(e.target.value)} />
      <Input
        label="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        onChange={(e) => setSenha(e.target.value)}
      />
      <Input
        label="Confirmar Senha"
        type="password"
        onChange={(e) => setConfirmarSenha(e.target.value)}
      />
      <Button
        isDisabled={button_disabled()}
        className="w-full"
        isLoading={loading}
        type="submit"
        color="primary"
      >
        Cadastrar
      </Button>
    </form>
  );
};

export default AlunoForm;
