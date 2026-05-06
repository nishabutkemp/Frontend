import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export function BackButton({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} />{children}</Button>;
}
