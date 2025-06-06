"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Headset,
  Laugh,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { createJogador } from "../../api/jogador";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import { useConfigCassino } from "@/context/ConfigCassinoContext";


// Hook para gerenciar feedback de API
function useApiFeedback(initialStatus = "idle") {
  const [status, setStatus] = useState(initialStatus);

  const setLoading = useCallback(() => setStatus("loading"), []);
  const setSuccess = useCallback(() => setStatus("success"), []);
  const setError = useCallback(() => setStatus("error"), []);
  const setIdle = useCallback(() => setStatus("idle"), []);

  return {
    status,
    setLoading,
    setSuccess,
    setError,
    setIdle,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    isIdle: status === "idle",
  };
}

// Componente de Feedback
function ApiFeedback({
  status,
  successMessage = "Operação realizada com sucesso!",
  errorMessage = "Ocorreu um erro. Tente novamente.",
  loadingMessage = "Processando...",
  onRetry,
  onDismiss,
  className,
  showRetryButton = true,
  showDismissButton = true,
}) {
  if (status === "idle") {
    return null;
  }

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (status) {
      case "loading":
        return loadingMessage;
      case "success":
        return successMessage;
      case "error":
        return errorMessage;
      default:
        return "";
    }
  };

  const getVariant = () => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Alert
      variant={getVariant()}
      className={cn(
        "flex items-center justify-center gap-1 text-left text-sm mt-2",
        "border-green-600/50 bg-gray-800/50",
        status === "success" && "border-green-500/50 bg-green-900/20",
        status === "error" && "border-red-500/50 bg-red-900/20",
        className
      )}
    >
      {getIcon()}
      <AlertDescription className="flex items-center justify-between text-gray-200">
        <span className="mt-1">{getMessage()}</span>
        {(status === "error" || status === "success") && (
          <div className="flex gap-2 ml-4">
            {status === "error" && showRetryButton && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-7 px-2 text-xs bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-400"
              >
                Tentar novamente
              </Button>
            )}
            {/*{showDismissButton && onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-7 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              >
                Dispensar
              </Button>
            )}*/}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

export default function CadastroAuth() {
  const { configCassino, loadingConfigCassino } = useConfigCassino();
  const tema = configCassino?.tema;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [nomeRegister, setNomeRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [whatsappRegister, setWhatsappRegister] = useState("");
  const [senhaRegister, setSenhaRegister] = useState("");

    const [showSplash, setShowSplash] = useState(true);


  const [message, setMessage] = useState("");

  // Feedback states
  const registerFeedback = useApiFeedback();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    registerFeedback.setLoading();

    try {
      const res = await createJogador({
        nome: nomeRegister,
        email: emailRegister,
        whatsapp: whatsappRegister,
        senha: senhaRegister,
      });

      if (res.data && res.data.success === true) {
        registerFeedback.setSuccess();

        // Auto-dismiss success after 3 seconds and switch to login
        setTimeout(() => {
          registerFeedback.setIdle();
          // Limpar campos do registro
          setNomeRegister("");
          setEmailRegister("");
          setWhatsappRegister("");
          setSenhaRegister("");
          // navegar para login
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("❌ Erro ao cadastrar:", err.response?.data || err.message);
      setMessage(err.response?.data.message);
      registerFeedback.setError();
    }
  };

  const handleRetryRegister = () => {
    registerFeedback.setIdle();
  };

  // === ✅ Splash Screen antes do conteúdo principal ===
    if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    // Se ainda estiver carregando ou não veio nada, retorna null
  if (loadingConfigCassino || !configCassino) return null;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-2 py-2 ">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/ajuda")}
            style={{ color: tema?.cor_texto_primaria }}
            className="flex items-center gap-1 bg-gray-800 px-3 py-2 rounded-md"
          >
            <span style={{ backgroundColor: tema?.cor_primaria }} className="font-bold  rounded-sm p-2">
              <Headset className="h-4 w-4" />
            </span>
            Precisa de ajuda?
          </button>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => router.push("/login")}
            style={{ color: tema?.cor_primaria }}
            className="flex items-center  bg-gray-800 px-2 py-3 rounded-md"
          >
            Faça login aqui{" "}
            <span className="font-bold bg-transparent rounded-sm px-1 py-0 flex justify-center items-center mt-1">
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between w-full px-2 py-2 ">
        <img
          //src="/assets/banner_cadastro.png"
          src="https://imagedelivery.net/BgH9d8bzsn4n0yijn4h7IQ/793a02ca-f49c-4134-4288-a5db508fda00/w=600?quality=95&format=auto"
          alt="Banner do Cassino"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
      <div className="flex items-center justify-center w-full px-2 py-2 gap-2">
        <span style={{ backgroundColor: tema?.cor_primaria, color: tema?.cor_texto_primaria }} className="font-bold  rounded-sm p-2 ">
          <Laugh className="h-4 w-4" />
        </span>
        <p style={{ color: tema?.cor_texto_primaria }} className=" text-center">
          Realize seu Cadastro para{" "}
          <span style={{ color: tema?.cor_primaria }} className=" font-semibold">jogar!</span>
        </p>
      </div>
      {/* Formulario cadastro */}
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center justify-center w-full px-2 py-2 gap-2"
      >
        <CardContent className="w-full p-0">
          <div className="w-full space-y-2">
            <Label htmlFor="name" style={{ color: tema?.cor_texto_primaria }}>
              Nome
            </Label>
            <div className="relative">
              <User style={{ color: tema?.cor_texto_primaria }} className="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="name"
                placeholder="Digite seu nome aqui"
                value={nomeRegister}
                onChange={(e) => setNomeRegister(e.target.value)}
                required
                disabled={registerFeedback.isLoading}
                style={{ borderColor: tema?.cor_primaria , color: tema?.cor_texto_primaria }}
                className="pl-10 bg-gray-800  placeholder:text-white focus:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="email-register" style={{ color: tema?.cor_texto_primaria }}>
              Seu Email
            </Label>
            <div className="relative">
              {/* Ícone do e-mail */}
              <Mail style={{ color: tema?.cor_texto_primaria }} className="absolute left-3 top-3 h-4 w-4 " />

              {/* Badge */}
              <span style={{ backgroundColor: tema?.cor_tercearia, color: tema?.cor_texto_dark }} className=" absolute -top-2 right-0 text-[10px]   px-2 py-0.5 rounded-md flex items-center justify-center gap-1 font-medium shadow-sm">
                <Lock className="h-3 w-3" />
                <span className="mt-0.5 font-bold">Dados Protegidos</span>
              </span>

              {/* Input */}
              <Input
                id="email-register"
                placeholder="Digite seu melhor email aqui"
                type="email"
                value={emailRegister}
                onChange={(e) => setEmailRegister(e.target.value)}
                required
                disabled={registerFeedback.isLoading}
                style={{ borderColor: tema?.cor_primaria , color: tema?.cor_texto_primaria }}
                className="pl-10 bg-gray-800   placeholder:text-white focus:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="email-register" className="text-gray-300">
              Telefone (Whatsapp){" "}
              <span style={{ color: tema?.cor_primaria }}>
                + Ganhe um Presente Grátis!
              </span>
            </Label>
            <div className="relative">
              {/* Ícone do e-mail<img
                src="/assets/whatsapp.svg"
                alt="Banner do Cassino"
                className="absolute left-3 top-3 h-4 w-4 object-contain"
                loading="eager"
              />
              */}
              <Smartphone style={{ color: tema?.cor_texto_primaria }} className="absolute left-3 top-3 h-4 w-4 " />
              <Input
                id="whatsapp-register"
                placeholder="Digite aqui seu número de Telefone"
                type="tel"
                value={whatsappRegister}
                onChange={(e) => setWhatsappRegister(e.target.value)}
                required
                disabled={registerFeedback.isLoading}
                className="pl-10 bg-[#2E603F] border-green-500 text-white placeholder:text-white focus:bg-[#2E603F]"
              />
            </div>
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="password-register" style={{ color: tema?.cor_texto_primaria }}>
              Senha
            </Label>
            <div className="relative">
              <Lock style={{ color: tema?.cor_texto_primaria }} className="absolute left-3 top-3 h-4 w-4 " />
              <Input
                id="password-register"
                placeholder="Escreva uma senha sua conta"
                type={showPassword ? "text" : "password"}
                value={senhaRegister}
                onChange={(e) => setSenhaRegister(e.target.value)}
                required
                disabled={registerFeedback.isLoading}
                style={{ borderColor: tema?.cor_primaria , color: tema?.cor_texto_primaria }}
                className="pl-10 pr-10 bg-gray-800  placeholder:text-white focus:bg-gray-800"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                style={{ color: tema?.cor_texto_primaria }}
                className="absolute right-1 top-1 h-8 w-8  hover:text-white"
                onClick={togglePasswordVisibility}
                disabled={registerFeedback.isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>

          {/* Feedback do Registro */}
          <ApiFeedback
            status={registerFeedback.status}
            successMessage="Conta criada com sucesso! Redirecionando para login..."
            errorMessage={message}
            loadingMessage="Criando conta..."
            onRetry={handleRetryRegister}
            onDismiss={registerFeedback.setIdle}
          />
        </CardContent>

        <CardFooter className={" w-full p-0 flex flex-col"}>
          <Button
            type="submit"
            disabled={registerFeedback.isLoading}
            style={{ backgroundColor: tema?.cor_primaria , color: tema?.cor_texto_primaria }}
            className="w-full   mt-4 disabled:opacity-50"
          >
            {registerFeedback.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                Concluir Cadastro <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p style={{ color: tema?.cor_primaria }} className=" mt-2 text-center">
            Finalmente pronto para se divertir!
          </p>
        </CardFooter>
      </form>
    </div>
  );
}
