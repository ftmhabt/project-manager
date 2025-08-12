"use client";

import { useState } from "react";

export default function Credentials() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mt-4 text-sm p-3">
      <p className="mb-2 font-medium">
        Feel free to use these demo credentials if you don’t want to sign up:
      </p>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Username:</span>
          <button
            onClick={() => handleCopy("alice@mail.com", "Username")}
            className="px-2 py-1 bg-violet-400 rounded hover:bg-violet-500 transition"
          >
            alice@mail.com
          </button>
          {copied === "Username" && (
            <span className="text-violet-600 text-xs">Copied!</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-medium">Password:</span>
          <button
            onClick={() => handleCopy("alice123", "Password")}
            className="px-2 py-1 bg-violet-400 rounded hover:bg-violet-500 transition"
          >
            alice123
          </button>
          {copied === "Password" && (
            <span className="text-violet-600 text-xs">Copied!</span>
          )}
        </div>
      </div>
    </div>
  );
}
