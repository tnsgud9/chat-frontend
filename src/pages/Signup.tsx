import AuthCard from "@/components/auth/AuthCard";
import AuthFormCard from "@/components/auth/AuthFormCard";
import SignupForm from "@/features/forms/SignupForm";

const Signup = () => {
  return (
    <AuthCard>
      <AuthFormCard
        title={"Sign Up"}
        description={"Create an account by filling in the information below"}
      >
        <SignupForm />
      </AuthFormCard>
    </AuthCard>
  );
};

export default Signup;
