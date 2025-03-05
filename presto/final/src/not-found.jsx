import { Link } from "react-router-dom";
import OuterLayout from "./components/customui/OuterLayout";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  return (
    <OuterLayout>
      <div className="flex flex-col mt-28 items-center justify-center h-full text-center">
        <p className="text-2xl mb-4">The page you are looking for is not found.</p>
        <Link to="/" className="flex items-center text-blue-500 hover:text-blue-700">
          <HomeIcon className="mr-2" size={24} />
          Go Home
        </Link>
      </div>
    </OuterLayout>
  );
};

export default NotFound;
