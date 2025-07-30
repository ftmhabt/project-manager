"use client";

import { useState } from "react";
import { joinTeamAction } from "@/app/features/team/actions/inviteTeam";

export default function Invite({ inviteCode }: { inviteCode: string }) {
  const [error, setError] = useState("");

  async function handleJoin() {
    setError("");
    try {
      await joinTeamAction(inviteCode);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to join team";
      setError(message);
    }
  }

  return (
    <div>
      <button onClick={handleJoin}>Accept Invite</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
