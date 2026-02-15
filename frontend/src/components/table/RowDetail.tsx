import { Database, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const RowDetailView = (props) => {
  const { row } = props;

  return (
    <div className="mx-8 my-4 bg-white border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
      <Tabs defaultValue="notes" className="w-full">
        <div className="flex items-center justify-between px-4 py-1 border-b bg-slate-50/50">
          <TabsList className="bg-transparent gap-4">
            <TabsTrigger
              value="notes"
              className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none px-0 text-xs font-semibold"
            >
              <MessageCircle size={14} className="mr-2" /> Discussion
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none px-0 text-xs font-semibold"
            >
              <Database size={14} className="mr-2" /> Developer Specs
            </TabsTrigger>
          </TabsList>
          <Badge
            variant="secondary"
            className="text-[10px] font-mono opacity-60"
          >
            Object ID: {row.original.id}
          </Badge>
        </div>

        <TabsContent value="notes" className="p-4 m-0 space-y-4"></TabsContent>

        <TabsContent value="specs" className="p-0 m-0"></TabsContent>
      </Tabs>
    </div>
  );
};
