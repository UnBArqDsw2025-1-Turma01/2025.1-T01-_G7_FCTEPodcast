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
} from "@heroui/react";
import logo from "../../assets/logo.png";
import { FaSearch } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../../context/auth/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <Navbar className="bg-primary-50">
      <NavbarBrand>
        <Image src={logo} className="h-12" />
      </NavbarBrand>

      <NavbarContent justify="center" className="">
        <Input startContent={<FaSearch />} className="w-full" />
      </NavbarContent>

      <NavbarContent justify="end">
        <Dropdown className="cursor-pointer">
          <DropdownTrigger>
            <button>
              <Avatar />
            </button>
          </DropdownTrigger>
          <DropdownMenu
            disabledKeys={["profile_info"]}
            className="cursor-default"
          >
            <DropdownItem key="profile_info">
              <p className="font-bold">Logado(a) como: {user?.nome}</p>
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
