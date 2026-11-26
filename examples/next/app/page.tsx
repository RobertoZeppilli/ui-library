import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Field, FieldDescription, FieldError, FieldLabel, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Stack } from "trama";
import { ThemeSwitch } from "./theme-switch";

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const sizes = ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const;

export default function Page() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <ThemeSwitch />
      <Stack direction={{ initial: "column", md: "row" }} gap={{ initial: "2", md: "4" }}>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </Stack>
      <div className="flex items-center gap-4">
        <Checkbox aria-label="Unchecked" />
        <Checkbox aria-label="Checked" defaultChecked />
        <Checkbox aria-label="Indeterminate" indeterminate />
      </div>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Team plan</CardTitle>
          <CardDescription>Up to ten members, billed monthly.</CardDescription>
        </CardHeader>
        <CardContent>Includes shared workspaces and priority support.</CardContent>
        <CardFooter>
          <Button>Upgrade</Button>
        </CardFooter>
      </Card>
      <Field invalid className="max-w-72">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" defaultValue="not-an-email" />
        <FieldDescription>We only use it to send the receipt.</FieldDescription>
        <FieldError match>Enter a valid email address.</FieldError>
      </Field>
      <Select defaultValue="monthly" items={{ monthly: "Monthly", yearly: "Yearly" }}>
        <SelectTrigger aria-label="Billing" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>
      <Dialog>
        <DialogTrigger className="w-fit">Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Change how your name appears to others.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose>Save</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-4">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-2">
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size} aria-label={`${variant} ${size}`}>
                {size.startsWith("icon") ? "+" : `${variant} ${size}`}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
