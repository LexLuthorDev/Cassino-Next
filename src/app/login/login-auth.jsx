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
import { loginJogador } from "../../api/jogador";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ✅ importa o hook do contexto
import { useConfigCassino } from "@/context/ConfigCassinoContext";
import SplashScreen from "@/components/SplashScreen";

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

export default function LoginAuth() {
  const { configCassino, loadingConfigCassino } = useConfigCassino();
  const tema = configCassino?.tema;
  const router = useRouter();
  const { login: loginContext } = useAuth(); // ✅ pega a função login do contexto
  const [showPassword, setShowPassword] = useState(false);

  const [showSplash, setShowSplash] = useState(true);

  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  const [message, setMessage] = useState("");

  // Feedback states
  const loginFeedback = useApiFeedback();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    loginFeedback.setLoading();

    try {
      const res = await loginJogador({ email: emailLogin, senha: senhaLogin });
      //console.log("✅ Login sucesso:", res.data);

      if (res.data && res.data.success === true) {
        loginFeedback.setSuccess();
        setMessage(res.data.message);

        // ✅ Sinaliza ao contexto que o usuário está autenticado
        loginContext();

        // Auto-dismiss success after 3 seconds
        setTimeout(() => {
          loginFeedback.setIdle();
          // Aqui você pode redirecionar o usuário
          router.push("/");
        }, 3000);
      }
    } catch (err) {
      console.error("❌ Erro ao logar:", err.response?.data || err.message);
      setMessage(err.response?.data.message);
      loginFeedback.setError();
    }
  };

  const handleRetryLogin = () => {
    loginFeedback.setIdle();
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
            className="flex items-center gap-1  bg-gray-800 px-3 py-2 rounded-md"
          >
            <span
              style={{ backgroundColor: tema?.cor_primaria }}
              className="font-bold  rounded-sm p-2"
            >
              <Headset className="h-4 w-4" />
            </span>
            Precisa de ajuda?
          </button>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => router.push("/cadastro")}
            style={{ color: tema?.cor_primaria }}
            className="flex items-center  bg-gray-800 px-2 py-3 rounded-md"
          >
            Cadastro aqui
            <span className="font-bold bg-transparent rounded-sm px-1 py-0 flex justify-center items-center mt-1">
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between w-full px-2 py-2 ">
        <img
          //src="/assets/banner_cadastro.png"
          src="https://imagedelivery.net/BgH9d8bzsn4n0yijn4h7IQ/8976a3cd-95f8-4140-6a5d-cbf70041f400/w=600?quality=95&format=auto"
          alt="Banner do Cassino"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
      <div className="flex items-center justify-center w-full px-2 py-2 gap-2">
        <span
          style={{ backgroundColor: tema?.cor_primaria }}
          className="font-bold  rounded-sm p-2 text-white"
        >
          <Laugh className="h-4 w-4" />
        </span>
        <p style={{ color: tema?.cor_texto_primaria }} className=" text-center">
          Realize seu Login para{" "}
          <span
            style={{ color: tema?.cor_primaria }}
            className=" font-semibold"
          >
            jogar!
          </span>
        </p>
      </div>
      {/* Formulario cadastro */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center w-full px-2 py-2 gap-2"
      >
        <CardContent className="w-full p-0">
          <div className="space-y-2 mt-3">
            <Label
              htmlFor="email-register"
              style={{ color: tema?.cor_texto_primaria }}
            >
              Seu Email
            </Label>
            <div className="relative">
              {/* Ícone do e-mail */}
              <Mail
                style={{ color: tema?.cor_texto_primaria }}
                className="absolute left-3 top-3 h-4 w-4 "
              />

              {/* Badge */}
              <span
                style={{
                  backgroundColor: tema?.cor_tercearia,
                  color: tema?.cor_texto_dark,
                }}
                className=" absolute -top-2 right-0 text-[10px]   px-2 py-0.5 rounded-md flex items-center justify-center gap-1 font-medium shadow-sm"
              >
                <Lock className="h-3 w-3" />
                <span className="mt-0.5 font-bold">Dados Protegidos</span>
              </span>

              {/* Input */}
              <Input
                id="email-register"
                placeholder="Digite seu melhor email aqui"
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                required
                disabled={loginFeedback.isLoading}
                style={{
                  borderColor: tema?.cor_primaria,
                  color: tema?.cor_texto_primaria,
                }}
                className="pl-10 bg-gray-800   placeholder:text-white focus:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2 mt-3">
            <Label
              htmlFor="password-register"
              style={{ color: tema?.cor_texto_primaria }}
            >
              Senha
            </Label>
            <div className="relative">
              <Lock
                style={{ color: tema?.cor_texto_primaria }}
                className="absolute left-3 top-3 h-4 w-4"
              />
              <Input
                id="password-register"
                placeholder="Escreva uma senha sua conta"
                type={showPassword ? "text" : "password"}
                value={senhaLogin}
                onChange={(e) => setSenhaLogin(e.target.value)}
                required
                disabled={loginFeedback.isLoading}
                style={{
                  borderColor: tema?.cor_primaria,
                  color: tema?.cor_texto_primaria,
                }}
                className="pl-10 pr-10 bg-gray-800   placeholder:text-white focus:bg-gray-800"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                style={{ color: tema?.cor_texto_primaria }}
                className="absolute right-1 top-1 h-8 w-8 hover:text-white"
                onClick={togglePasswordVisibility}
                disabled={loginFeedback.isLoading}
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

          {/* Feedback do Login */}
          <ApiFeedback
            status={loginFeedback.status}
            successMessage={message}
            errorMessage={message}
            loadingMessage="Fazendo login..."
            onRetry={handleRetryLogin}
            onDismiss={loginFeedback.setIdle}
          />
        </CardContent>

        <CardFooter className={" w-full p-0 flex flex-col"}>
          <Button
            type="submit"
            disabled={loginFeedback.isLoading}
            style={{
              backgroundColor: tema?.cor_primaria,
              color: tema?.cor_texto_primaria,
            }}
            className="w-full   mt-4 disabled:opacity-50"
          >
            {loginFeedback.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                Concluir Login <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p
            style={{ color: tema?.cor_primaria }}
            className=" mt-2 text-center"
          >
            Finalmente pronto para se divertir!
          </p>
        </CardFooter>
      </form>
    </div>
  );
}
