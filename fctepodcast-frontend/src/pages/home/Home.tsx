import { useAuth } from "../../context/auth/AuthContext";
import { Button } from "@heroui/react";

const Home = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      {user?.nome}
      <Button onPress={logout}>LOGOUT</Button>
    </div>
  );
};

export default Home;
