import { addToast, Button, Input } from "@heroui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../../utils/constants";
import { useNavigate } from "react-router";

const ProfessorForm = () => {
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
      const response: any = await axios.post(
        `${BASE_API_URL}/usuario/registrar`,
        {
          nome,
          email,
          senha,
          role: "PROFESSOR",
        }
      );

      addToast({
        title: "Sucesso",
        description: response.data.message,
        color: "success",
      });
      navigate("/login");
    } catch (error: any) {
      console.log(error);
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
      <Input
        label="Nome"
        onChange={(e) => setNome(e.target.value)}
        // Indica que o campo está com erro, se aplicável
        aria-invalid={erros.some((e) => e.Key === "nome")}
        // Conecta este campo com a descrição de erro, se houver
        aria-describedby={
          erros.some((e) => e.Key === "nome") ? "erro-nome" : undefined
        }
      />
      {/* Mensagem descritiva associada ao campo "Nome" via aria-describedby */}
      {erros.some((e) => e.Key === "nome") && (
        <p id="erro-nome" className="text-red-500 text-sm">
          {erros.find((e) => e.Key === "nome")?.errors[0]}
        </p>
      )}

      <Input
        label="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        // Indica se o campo está inválido
        aria-invalid={erros.some((e) => e.Key === "email")}
        // Conecta o campo à mensagem de erro, se existir
        aria-describedby={
          erros.some((e) => e.Key === "email") ? "erro-email" : undefined
        }
      />
      {/* Mensagem de erro do campo email, referenciada pelo aria-describedby */}
      {erros.some((e) => e.Key === "email") && (
        <p id="erro-email" className="text-red-500 text-sm">
          {erros.find((e) => e.Key === "email")?.errors[0]}
        </p>
      )}

      <Input
        label="Senha"
        type="password"
        onChange={(e) => setSenha(e.target.value)}
        // Marca o campo como inválido, se houver erro
        aria-invalid={erros.some((e) => e.Key === "senha")}
        // Associa o campo à descrição de erro da senha
        aria-describedby={
          erros.some((e) => e.Key === "senha") ? "erro-senha" : undefined
        }
      />
      {/* Texto descritivo do erro da senha */}
      {erros.some((e) => e.Key === "senha") && (
        <p id="erro-senha" className="text-red-500 text-sm">
          {erros.find((e) => e.Key === "senha")?.errors[0]}
        </p>
      )}

      <Input
        label="Confirmar Senha"
        type="password"
        onChange={(e) => setConfirmarSenha(e.target.value)}
        // Também herda a marcação de erro caso as senhas não coincidam
        aria-invalid={erros.some((e) => e.Key === "senha")}
        // Conecta ao mesmo erro de "senha", pois são relacionados
        aria-describedby={
          erros.some((e) => e.Key === "senha") ? "erro-senha" : undefined
        }
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

export default ProfessorForm;
