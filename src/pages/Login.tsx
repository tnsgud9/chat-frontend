import AuthCard from "@/components/auth/AuthCard";
import AuthFormCard from "@/components/auth/AuthFormCard";
import LoginForm from "@/features/forms/LoginForm";

const Login = () => {
  return (
    <AuthCard>
      <AuthFormCard
        title={"Login"}
        description={"Enter your email below to login to your account"}
      >
        <LoginForm />
      </AuthFormCard>
    </AuthCard>
  );
};

export default Login;
