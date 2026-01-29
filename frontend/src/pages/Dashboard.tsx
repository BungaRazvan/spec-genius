import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Share2, Plus, FileText, Search } from "lucide-react";

const Dashboard = () => {
  // Mock data for cleaner rendering logic
  const recentDocs = [
    { id: 1, title: "Project Specs v1" },
    { id: 2, title: "API Documentation" },
    { id: 3, title: "User Research" },
    { id: 4, title: "User Research" },
    { id: 5, title: "User Research" },
    { id: 6, title: "User Research" },
    { id: 7, title: "User Research" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Specs
            </h1>
            <nav className="flex items-center gap-2">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> New doc
              </Button>
              <Button size="sm" variant="outline">
                Validate doc
              </Button>
            </nav>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="w-full bg-muted/50 pl-9 focus-visible:bg-background"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 ">
        {/* Recent Docs Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent docs
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all
            </Button>
          </div>

          <div className="flex flex-row gap-6 ">
            {recentDocs.map((doc) => (
              <Card
                key={doc.id}
                className="w-40 aspect-square flex flex-col border-gray-200 shadow-sm hover:border-gray-400 transition-colors"
              >
                <CardHeader className="space-y-1">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                </CardHeader>

                <CardFooter className="border-t bg-muted/5 px-6 py-3 flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Edited 2h ago
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* My Docs Section */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight mb-4">My docs</h2>
          <div className="rounded-xl  max-w-xl border border-dashed border-gray-300 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No documents found in your library.
            </p>
            <Button variant="link" className="mt-2">
              Create your first spec
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
