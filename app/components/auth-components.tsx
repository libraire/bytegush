"use client";

import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import { Button } from "./ui/button"


export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  const { login } = useCustomAuth();

  return (
    <Button
      className="ml-2 mr-2 text-gray-800"
      onClick={() => login()}
      {...props}
    >
      Sign In
    </Button>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  const { logout } = useCustomAuth();

  return (
    <Button onClick={() => {
      logout();
    }} variant="ghost" className="w-full p-0" {...props}>
      Sign Out
    </Button>
  )
}
