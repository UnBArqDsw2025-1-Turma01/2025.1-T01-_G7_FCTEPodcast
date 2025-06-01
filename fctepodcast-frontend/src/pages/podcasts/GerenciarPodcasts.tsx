import { Button, Divider, useDisclosure } from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import CriarPodcastModal from "../../components/modals/podcast/CriarPodcastModal";
import PodcastStudioCard from "../../components/podcast-studio-card/PodcastStudioCard";

import { useAuth } from "../../context/auth/AuthContext";
import { motion } from "framer-motion";
import LoaderMini from "../loader/LoaderMini";
import { useGetPodcastsUsuario } from "../../hooks/podcasts/useGetPodcastsUsurio";

const GerenciarPodcasts = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { podcasts, loading, fetchPodcasts } = useGetPodcastsUsuario(
    user?.id as string
  );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <h1 className="font-bold text-2xl">Conteúdo do Perfil</h1>
       
        <Button onPress={onOpen} color="primary">
          <FaPlus aria-hidden="true" />
          {/* Ícone apenas decorativo, `aria-hidden` evita leitura redundante pelo leitor de tela */}

          Adicionar Podcast
        
        </Button>
      </motion.div>

      <Divider />
      

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className="text-gray-500">
          Aqui você pode gerenciar seus podcasts, adicionar novos episódios e
          muito mais.
        </p>
       
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-evenly items-center bg-primary-50 p-2 rounded-xl"
      >
        <p>Dados do Podcast</p>
        <Divider orientation="vertical" className="h-8" />
        <p>Descrição</p>
        <Divider orientation="vertical" className="h-8" />
        <p>Tags</p>
        <Divider orientation="vertical" className="h-8" />
        <p>Ações</p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {loading && <LoaderMini />}
        
        {!loading && podcasts.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-center"
          >
            Você ainda não possui nenhum podcast. Clique no botão acima para
            criar um novo podcast.
            
          </motion.p>
        )}

        <CriarPodcastModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          refresh={fetchPodcasts}
          
        />

        {!loading &&
          podcasts.map((podcast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <PodcastStudioCard
                podcast={podcast}
                fetch_function={fetchPodcasts}
                
              />
            </motion.div>
          ))}
      </div>

      
      <CriarPodcastModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refresh={fetchPodcasts}
      />
    </div>
  );
};

export default GerenciarPodcasts;
