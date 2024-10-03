import { UserData } from "../utils/types";
import { useState } from "react";
import { postUser } from "../utils/postUser";

export const useCreateUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const submitNewUser = async (data: UserData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await postUser(data);
      console.log("Submission successful:", result);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unknown error occurred"));
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  return { submitNewUser, isSubmitting, error };
};
