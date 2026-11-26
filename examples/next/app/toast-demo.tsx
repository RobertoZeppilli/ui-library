"use client";

import { Button, toast } from "trama";

export function ToastDemo() {
  return (
    <Button className="w-fit" onClick={() => toast({ title: "Changes saved", description: "Your profile is up to date." })}>
      Show toast
    </Button>
  );
}
