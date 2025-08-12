"use client";

import { useState } from "react";
import { joinTeamAction } from "@/app/features/team/actions/inviteTeam";
import Button from "@/components/Button";

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
    <div className="flex flex-col justify-center items-center gap-2">
      <Button onClick={handleJoin}>Accept Invite</Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
