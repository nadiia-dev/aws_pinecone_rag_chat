import { useAuthStore } from "@/store/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import type React from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { loginUser } = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userEmail = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    loginUser(userEmail);
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 border border-stone-400 rounded-2xl w-full md:w-[400px]">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Label htmlFor="email">Login with your email address</Label>
          <Input type="email" placeholder="Email" name="email" required />
          <Button type="submit">Log in</Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
