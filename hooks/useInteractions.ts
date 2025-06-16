"use client";

import { useEffect, useState } from "react";

type Interaction = {
  id: string;
  role: string;
  content: string;
};

export function useInteractions(threadId: string) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!threadId) return;

    setLoading(true);

    fetch(`/api/interactions?threadId=${threadId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch interactions");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.error) {
          setInteractions(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching interactions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [threadId]);

  return { interactions, loading };
}
