import { RegisterForm } from "../components/RegisterForm";
import { RegisterHero } from "../components/RegisterHero";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <RegisterHero />
      <RegisterForm />
    </div>
  );
}
