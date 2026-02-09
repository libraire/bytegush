"use client";

import { Button } from "./ui/button"
import { redirect } from "next/navigation"
import { signOut } from "next-auth/react"


export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        // Get current page URL for redirect after login
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const loginUrl = `https://app.bytegush.com/auth/login?redirect_url=${encodeURIComponent(currentUrl)}`;
        redirect(loginUrl);
      }}
    >
      <Button className="ml-2 mr-2 text-gray-800" {...props}>Sign In</Button>
    </form>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button onClick={() => {
      signOut({ redirect: false });
    }} variant="ghost" className="w-full p-0" {...props}>
      Sign Out
    </Button>
  )
}
