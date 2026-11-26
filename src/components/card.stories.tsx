import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  title: "Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-4">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Team plan</CardTitle>
          <CardDescription>Up to ten members, billed monthly.</CardDescription>
        </CardHeader>
        <CardContent>Includes shared workspaces and priority support.</CardContent>
        <CardFooter>
          <Button>Upgrade</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
