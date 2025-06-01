interface AuthorCardProps {
  name: string;
  imageUrl: string;
  description: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const AuthorCard = ({ name, imageUrl, description, onClick, ariaLabel }: AuthorCardProps) => {
  // Acessibilidade: permite ativar o clique no card via teclado (Enter ou espaço),
  // garantindo que usuários que navegam pelo teclado possam interagir com o componente.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      // Acessibilidade: define o papel do elemento como "button", indicando que é interativo
      role="button"
      // Acessibilidade: permite que o elemento seja focável via teclado (Tab)
      tabIndex={0}
      // Acessibilidade: fornece um texto alternativo para leitores de tela. 
      aria-label={ariaLabel || `Ver perfil de ${name}, ${description}`}
      // Estilos visuais e de foco para indicar interatividade e estado focado (para teclado)
      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
    >
      {/* Acessibilidade: o alt da imagem usa o nome do autor para descrever a imagem,
          permitindo que leitores de tela interpretem a imagem corretamente. */}
      <img
        src={imageUrl}
        alt={name}
        className="w-24 h-24 rounded-full object-cover shadow-lg mb-2"
      />
      <h2 className="text-lg font-medium">{name}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default AuthorCard;
