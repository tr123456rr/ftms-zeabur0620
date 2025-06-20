import React, { useState } from 'react';
import { Mail, Lock, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('密碼確認不一致');
      }

      let supabaseUser = null;
      if (!isLogin) {
        // 註冊，emailRedirectTo 保持
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name },
            emailRedirectTo: `${window.location.origin}/`, // **** 保持 '/', 點擊信箱後導回首頁 (或改成 /login)
          }
        });
        if (error) throw error;

        supabaseUser = data.user;
        toast({
          title: "註冊成功",
          description: `請至信箱確認郵件完成啟用，帳號：${formData.email}`,
        });
        onClose();
        setIsLoading(false);
        return;
      } else {
        // 登入
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        supabaseUser = data.user;
      }

      onAuthSuccess({
        id: supabaseUser?.id,
        email: supabaseUser?.email,
        name: supabaseUser?.user_metadata?.name || "User"
      });
      toast({
        title: isLogin ? "登入成功" : "註冊成功",
        description: `歡迎${isLogin ? '回來' : ''}，${supabaseUser?.user_metadata?.name || "User"}！`,
      });
      onClose();

    } catch (error) {
      toast({
        title: "認證失敗",
        description: error instanceof Error ? error.message : "請檢查您的資料",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {isLogin ? '登入' : '註冊'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">姓名</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="請輸入您的姓名"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">電子郵件</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="請輸入您的電子郵件"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">密碼</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="請輸入您的密碼"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">確認密碼</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="請再次輸入密碼"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isLoading ? '處理中...' : (isLogin ? '登入' : '註冊')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              {isLogin ? '沒有帳號？點此註冊' : '已有帳號？點此登入'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AuthModal;
