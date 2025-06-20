
import React from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";

interface FTMSWelcomeProps {
  showAuthModal: boolean;
  setShowAuthModal: (open: boolean) => void;
  onAuthSuccess: (userData: any) => void;
}

const FTMSWelcome: React.FC<FTMSWelcomeProps> = ({
  showAuthModal,
  setShowAuthModal,
  onAuthSuccess
}) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-cyan-400">健身數據面板</h1>
        <p className="text-xl text-slate-300">連接您的健身設備，追蹤運動數據</p>
      </div>
      <div className="space-y-4">
        <Button
          onClick={() => setShowAuthModal(true)}
          size="lg"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3"
        >
          <LogIn className="mr-2 h-5 w-5" />
          登入開始使用
        </Button>
        <div className="text-sm text-slate-400">
          <p>支援 FTMS (Fitness Machine Service) 協議</p>
          <p>包含藍牙連接、數據儲存和用戶認證</p>
        </div>
      </div>
    </div>
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      onAuthSuccess={onAuthSuccess}
    />
  </div>
);

export default FTMSWelcome;
