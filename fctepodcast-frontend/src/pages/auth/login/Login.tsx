import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Input,
} from "@heroui/react";
import logo from "../../../assets/logo.png";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <Image src={logo} alt="Logo" aria-label="Logo" className="h-20" />
      <Card className="w-96">
        <CardHeader className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col items-center justify-center gap-5 w-full overflow-hidden">
            <Input label="Email" type="email" />
            <Input label="Senha" type="password" />
            <Button className="w-full" color="primary">
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
