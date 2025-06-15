import { Button, Divider, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";

const GerenciarMonitores = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center
        justify-between"
      >
       <h1 className="font-bold
       text-2xl">Monitores</h1>
       <Button onPress={onOpen}
       color="primary">
         Adicionar Monitor
       </Button>  
      </motion.div>

      <Divider />

      <motion.div
        initial={{ opacity: 0, y: -5}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className="text-gray-500">
          Aqui você pode gerenciar seus monitores, e adicionar novos monitores aos Podcasts.
        </p>
      </motion.div>

      
    </div>
  );
};

export default GerenciarMonitores;
