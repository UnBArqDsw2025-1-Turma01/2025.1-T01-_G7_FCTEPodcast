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

  // Atualiza erro de senha em tempo real
  useEffect(() => {
    const senhaDiferente = senha && confirmarSenha && senha !== confirmarSenha;
    setErros((prev) => {
      const semSenhaErro = prev.filter((e) => e.Key !== "senha");
      if (senhaDiferente) {
        return [
          ...semSenhaErro,
          { Key: "senha", errors: ["As senhas não conferem"] },
        ];
      }
      return semSenhaErro;
    });
  }, [senha, confirmarSenha]);

  const getErro = (campo: string): string[] =>
    erros.find((e) => e.Key === campo)?.errors || [];

  const handleRegisterAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      addToast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        color: "danger",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_API_URL}/usuario/registrar`, {
        nome,
        email,
        senha,
        role: "ALUNO",
      });

      addToast({
        title: "Sucesso",
        description: response.data.message,
        color: "success",
      });

      navigate("/login");
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

  const buttonDisabled = () => {
    return !nome || !email || !senha || erros.length > 0;
  };

  return (
    <form
      onSubmit={handleRegisterAluno}
      className="flex flex-col items-center justify-center gap-5 w-full"
      noValidate
    >
      {/* Nome */}
      <div className="w-full">
        <Input
          label="Nome"
          onChange={(e) => setNome(e.target.value)}
          // 'aria-invalid' indica que o campo contém um erro
          aria-invalid={!!getErro("nome").length}
          // 'aria-describedby' associa o erro ao campo (quando houver erro)
          aria-describedby={getErro("nome").length ? "erro-nome" : undefined}
        />
        {/* Exibe o erro de forma acessível */}
        {getErro("nome").length > 0 && (
          <p id="erro-nome" className="text-red-500 text-sm mt-1">
            {getErro("nome")[0]}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="w-full">
        <Input
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          // 'aria-invalid' indica que o campo contém um erro
          aria-invalid={!!getErro("email").length}
          // 'aria-describedby' associa o erro ao campo (quando houver erro)
          aria-describedby={getErro("email").length ? "erro-email" : undefined}
        />
        {/* Exibe o erro de forma acessível */}
        {getErro("email").length > 0 && (
          <p id="erro-email" className="text-red-500 text-sm mt-1">
            {getErro("email")[0]}
          </p>
        )}
      </div>

      {/* Senha */}
      <div className="w-full">
        <Input
          label="Senha"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
          // 'aria-invalid' indica que o campo contém um erro
          aria-invalid={!!getErro("senha").length}
          // 'aria-describedby' associa o erro ao campo (quando houver erro)
          aria-describedby={getErro("senha").length ? "erro-senha" : undefined}
        />
      </div>

      {/* Confirmar Senha */}
      <div className="w-full">
        <Input
          label="Confirmar Senha"
          type="password"
          onChange={(e) => setConfirmarSenha(e.target.value)}
          // 'aria-invalid' indica que o campo contém um erro
          aria-invalid={!!getErro("senha").length}
          // 'aria-describedby' associa o erro ao campo (quando houver erro)
          aria-describedby={getErro("senha").length ? "erro-senha" : undefined}
        />
        {/* Exibe o erro de forma acessível */}
        {getErro("senha").length > 0 && (
          <p id="erro-senha" className="text-red-500 text-sm mt-1">
            {getErro("senha")[0]}
          </p>
        )}
      </div>

      {/* Botão Cadastrar */}
      <Button
        isDisabled={buttonDisabled()}
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
