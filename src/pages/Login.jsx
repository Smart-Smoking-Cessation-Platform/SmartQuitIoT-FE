import logoBanner from "@/assets/login-banner.png";
import logo from "@/assets/logo.png";
import LoginForm from "@/components/ui/login-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <img src={logo} alt="Logo" className="mx-auto h-20 w-auto" />
            <h1 className="text-3xl font-bold tracking-tight text-emerald-500">
              Smart Quit IoT Management
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 relative bg-muted">
        <div className="absolute inset-0 " />
        <div className="relative h-full flex justify-center">
          <img src={logoBanner} alt="Your Image" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Login;
