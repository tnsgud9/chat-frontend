import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/features/forms/SignupForm";

const Signup = () => {
  return (
    <AuthCard
      title={"Sign Up"}
      description={"Create an account by filling in the information below"}
    >
      <SignupForm />
    </AuthCard>
  );
};

export default Signup;
