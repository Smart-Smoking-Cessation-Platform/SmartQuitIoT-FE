import logoBanner from "@/assets/login-banner.png";
import LoginForm from "@/components/ui/login-form";
import logo from "@/assets/logo.png";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
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
