"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function AuthControls() {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton mode="redirect">
          <button className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="redirect">
          <button className="min-h-11 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
            Create account
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
