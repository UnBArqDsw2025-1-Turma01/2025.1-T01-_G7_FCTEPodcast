import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  Avatar,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
} from "@heroui/react";
import logo from "../../assets/logo.png";
import { FaSearch, FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router";
import { IoIosNotifications } from "react-icons/io";
import { useNotifications } from "../../context/notifications/NotificationsContext";

import { useEffect, useState } from "react";
import { getImageUrlFromPath } from "../../hooks/static/useImageFromPath";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { notifications } = useNotifications();
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    async function fetchImage() {
      if (!user?.profile_picture) {
        setImageBlobUrl("");
        return;
      }

      try {
        const url = await getImageUrlFromPath(user.profile_picture);
        if (isActive) {
          setImageBlobUrl(url);
          objectUrl = url;
        } else {
          // Se já não está ativo, revoga a URL criada para evitar vazamento
          URL.revokeObjectURL(url);
        }
      } catch {
        if (isActive) {
          setImageBlobUrl("");
        }
      }
    }

    fetchImage();

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user?.profile_picture]);

  return (
    <Navbar className="bg-primary-50">
      <NavbarBrand>
        <button onClick={() => navigate("/home")}>
          <Image src={logo} className="h-12" />
        </button>
      </NavbarBrand>

      <NavbarContent justify="center" className="">
        <Input startContent={<FaSearch />} className="w-full" />
      </NavbarContent>

      <NavbarContent justify="end">
        {user?.role === "PROFESSOR" && (
          <Badge
            color="primary"
            content={notifications.filter((n) => !n.lida).length}
          >
            <Button onPress={() => navigate(`/studio/notificacoes`)} isIconOnly>
              <IoIosNotifications size={25} />
            </Button>
          </Badge>
        )}

        <Dropdown backdrop="blur" className="cursor-pointer">
          <DropdownTrigger>
            <button>
              <Avatar src={imageBlobUrl} />
            </button>
          </DropdownTrigger>
          <DropdownMenu
            disabledKeys={["profile_info"]}
            className="cursor-default"
          >
            <DropdownItem key="profile_info">
              <p className="font-bold">Logado(a) como: {user?.nome}</p>
            </DropdownItem>
            <DropdownItem
              onPress={() => navigate(`/perfil/${user?.id}`)}
              key={"profile"}
            >
              <p className="flex items-center gap-2">
                <FaUser />
                Meu Perfil
              </p>
            </DropdownItem>
            <DropdownItem onPress={() => logout()} key="logout">
              <p className="flex items-center gap-2">
                <MdLogout size={20} />
                Logout
              </p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
