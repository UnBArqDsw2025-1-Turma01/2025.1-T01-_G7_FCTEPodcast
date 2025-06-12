import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Tab,
  Tabs,
} from "@heroui/react";
import logo from "../../../assets/logo.png";
import AlunoForm from "./formularios/AlunoForm";
import ProfessorForm from "./formularios/ProfessorForm";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const Registro = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Image src={logo} alt="Logo" aria-label="Logo" className="h-20" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="w-96">
          <CardHeader className="flex flex-col items-center justify-center gap-5">
            <h1 className="font-bold text-2xl">Cadastro</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center justify-center gap-5 w-full overflow-hidden">
            <Tabs aria-label="Seleção de tipo de Cadastro">
              <Tab key={"aluno"} title="Aluno" className="w-full">
                <motion.div
                  key="aluno-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlunoForm />
                </motion.div>
              </Tab>
              <Tab key={"professor"} title="Professor" className="w-full">
                <motion.div
                  key="professor-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfessorForm />
                </motion.div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </motion.div>
      <motion.p
        className="font-bold text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        Já tem uma conta?
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
        className="flex flex-col items-center justify-center gap-5 w-full"
      >
        <Button
          onPress={() => {
            navigate("/login");
          }}
          color="primary"
        >
          Logar
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Registro;
