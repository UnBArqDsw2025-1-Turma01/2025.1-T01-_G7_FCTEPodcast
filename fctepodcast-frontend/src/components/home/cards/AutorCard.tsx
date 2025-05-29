interface AuthorCardProps {
  name: string;
  imageUrl: string;
  description: string;
  onClick?: () => void;
}

const AuthorCard = ({ name, imageUrl, description, onClick }: AuthorCardProps) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
    >
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
