import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserIdentifications } from "@/services/plantIdentification";
import { Identification } from "@/types/database";

interface HistoryContextType {
  error?: string;
  loading: boolean;
  selected?: string;
  history: Identification[];
  loadHistory: () => Promise<void>;
  setError: (data?: string) => void;
  setSelected: (id: string) => void;
  setLoading: (data: boolean) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>();
  const [history, setHistory] = useState<Identification[]>([]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      setError(undefined);
      setLoading(true);
      const data = await getUserIdentifications(user.id);
      setHistory(data);
    } catch (error) {
      console.error("Error loading history:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (history.length <= 0) {
      loadHistory();
    }
  }, [user]);

  return (
    <HistoryContext.Provider
      value={{
        error,
        history,
        loading,
        selected,
        setError,
        setLoading,
        setSelected,
        loadHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within an HistoryProvider");
  }
  return context;
}
