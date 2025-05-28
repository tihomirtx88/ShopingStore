'use client';
import { useActionState } from "react";
import { actionFunction } from "../../../utils/types";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState = {
  message: '',
};

export default function FormContainer({ action, children,}: { action: actionFunction; children: React.ReactNode;}) {
const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.message) {
      toast("Notification", {
        description: state.message,
      });
    }
  }, [state]);

  return <form action={formAction}>{children}</form>;
}
