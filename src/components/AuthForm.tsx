
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";

type AuthFormProps = {
  onSuccessfulAuth: (userData: { id: string; email: string; name: string }) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ onSuccessfulAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This simulates an API call for auth - would be replaced by actual auth in a real app
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate successful auth
      const userData = {
        id: '1',
        email,
        name: name || email.split('@')[0],
      };
      
      toast.success(isLogin ? "Logged in successfully" : "Account created successfully");
      onSuccessfulAuth(userData);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-vault-light">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? "Enter your credentials to access your vault" 
            : "Enter your details to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-vault-gray" />
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
              </div>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-vault-gray" />
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-vault-gray" />
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-vault-primary hover:bg-vault-primary/90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin mr-2"></span>
                {isLogin ? "Logging in..." : "Creating account..."}
              </span>
            ) : (
              <span>{isLogin ? "Login" : "Create Account"}</span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
