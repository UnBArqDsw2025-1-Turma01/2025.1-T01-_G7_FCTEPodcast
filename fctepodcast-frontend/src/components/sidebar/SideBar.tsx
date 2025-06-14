import { useLocation } from "react-router";
import HomeButtonLayout from "./button-set/HomeButtonLayout";
import StudioButtonLayout from "./button-set/StudioButtonLayout";

const SideBar = () => {
  const location = useLocation();
  const path = location.pathname;

  const renderButtonLayout = () => {
    if (path.startsWith("/studio")) {
      return <StudioButtonLayout />;
    }
    if (path.startsWith("/")) {
      return <HomeButtonLayout />;
    }
    return null;
  };

  return (
    <div className="w-72 bg-primary-50 text-white p-4">
      <div className="w-full flex flex-col gap-4">{renderButtonLayout()}</div>
    </div>
  );
};

export default SideBar;
