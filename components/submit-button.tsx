"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

interface Props {
  text: string;
  className?: string;
  varient?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function SubmitButton({ text, className, varient }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={varient}
      disabled={pending}
      className={className}
    >
      {pending ? <Spinner /> : text}
    </Button>
  );
}
