import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  return (
    <div className="w-full bg-card p-4">
      <header className="flex items-center gap-4">
        <h1 className="text-lg font-medium text-foreground">Specs</h1>

        <div className="flex gap-2">
          <Button>New doc</Button>
          <Button>Validate doc</Button>
        </div>

        {/* Spacer to push search input to the right */}
        <div className="flex-1"></div>

        <div className="w-64">
          <Input placeholder="Search documents" />
        </div>
      </header>

      <Separator className="my-4" />
    </div>
  );
};

export default Dashboard;
