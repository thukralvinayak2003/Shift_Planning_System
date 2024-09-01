import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../..//components/ui/input";
import { Label } from "../..//components/ui/label";
import { CalendarDays, LogIn, Lock, User } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      toast.error(error.message);
    }

    <Navigate to="/" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <CalendarDays className="mr-2 h-6 w-6" />
            Shift Management System
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              <LogIn className="mr-2 h-4 w-4" />
              Log In
            </Button>
          </CardFooter>
          <div className="text-sm text-center my-5">
            Create an account{" "}
            <Link to="/signup" className="text-primary hover:underline">
              SignUp
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
