import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import { toast } from "@/components/blood/Toast";
import axiosInstance from "@/lib/axios";

function Activate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Activation token is missing. Please click the full link in your email.");
      return;
    }

    let isMounted = true;

    async function verifyAccount() {
      try {
        const res = await axiosInstance.get(`/auth/activate?token=${token}`);
        if (!isMounted) return;

        setStatus("success");
        setMessage(res.data?.message || "Your account has been activated successfully!");
        toast.success("Account Verified!", {
          description: "You can now log in with your credentials.",
        });

        setTimeout(() => {
          if (isMounted) navigate("/login?verified=true");
        }, 3000);
      } catch (err) {
        if (!isMounted) return;

        console.error("Activation failed:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.message || 
          "The activation link is invalid or has expired (24 hours limit). Please register again."
        );
      }
    }

    verifyAccount();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md border border-border rounded-xl p-8 bg-card shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {status === "loading" && (
          <div className="space-y-4 py-8">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Verifying Account</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we activate your account...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-success animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Email Verified!</h2>
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            </div>
            <div className="p-4 bg-success-soft/30 rounded-xl text-sm text-success font-medium">
              Redirecting to login in 3 seconds...
            </div>
            <Button as="link" to="/login?verified=true" className="w-full h-12 text-base font-semibold">
              Go to Login Now
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Activation Failed</h2>
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            </div>
            <div className="space-y-3">
              <Button as="link" to="/register" className="w-full h-12 text-base font-semibold">
                Register Again
              </Button>
              <Button as="link" to="/login" variant="secondary" className="w-full h-12 text-base font-semibold">
                Back to Login
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Activate;
