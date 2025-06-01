import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Input,
} from "@heroui/react";
import logo from "../../../assets/logo.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [showSenha, setShowSenha] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      addToast({
        title: "Preencha todos os campos",
        color: "danger",
      });
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      navigate("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Aqui você pode adicionar um tratamento de erro, como exibir uma mensagem para o usuário
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Image src={logo} alt="Logo" aria-label="Logo" className="h-20" />
      </motion.div>
      {/* Logo com alt e aria-label para leitores de tela */}

      {/* Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="w-96" role="form" aria-label="Formulário de Login">
          /* role "form" e aria-label "Formulário de Login" para acessibilidade */         
          <CardHeader className="flex flex-col items-center justify-center gap-5">
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Login
            </motion.h1>
          </CardHeader>

          <CardBody>
            <motion.form
              onSubmit={handleLogin}
              className="flex flex-col items-center justify-center gap-5 w-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="w-full"
              >
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>

              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="w-full"
              >
                <Input
                  label="Senha"
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  endContent={
                    <Button
                      type="button"
                      isIconOnly
                      onPress={() => setShowSenha ((prev) => !prev)}
                      aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                      className="w-10"
                      // Acessibilidade: aria-label dinâmico para descrever a ação do botão
                    >
                      {showSenha ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  }
                />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="w-full"
              >
                <Button
                  isLoading={loading}
                  className="w-full"
                  color="primary"
                  type="submit"
                  // O botão padrão <button> já é acessível para teclado e leitores de tela
                >
                  Login
                </Button>
              </motion.div>
            </motion.form>
          </CardBody>
        </Card>
      </motion.div>
      <motion.p
        className="font-bold"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        Não tem conta?
      </motion.p>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.9,
          duration: 0.3,
          type: "spring",
          stiffness: 80,
        }}
      >
        <Button
          onPress={() => {
            navigate("/registro");
          }}
          color="primary"
        >
          Criar Conta
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Login;
