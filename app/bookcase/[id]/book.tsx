import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, PlusIcon, UserRoundPlusIcon } from "lucide-react";

export default function Book() {
  return (
    <div className="flex w-96 flex-col justify-start rounded-lg border-2 border-red-300 bg-slate-200 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="my-2 font-medium text-xl">Book Title 22</h1>
          <Badge
            variant={"outline"}
            className="ml-2 h-5 min-w-5 rounded-full bg-slate-50 px-1"
          >
            8
          </Badge>
        </div>
        <Button
          variant={"ghost"}
          className="font-semibold text-lg hover:bg-slate-300"
        >
          <UserRoundPlusIcon />
        </Button>
      </div>

      <div className="max-h-full space-y-2 overflow-y-scroll rounded-lg bg-sky-300 p-2">
        <h3 className="bg-white text-9xl">Marks</h3>
        <h3 className="bg-white text-9xl">Marks</h3>
        <h3 className="bg-white text-9xl">Marks</h3>
        <h3 className="bg-white text-9xl">Marks</h3>
        <h3 className="bg-white text-9xl">Marks</h3>
        <h3 className="bg-white text-9xl">Marks</h3>
        <h3 className="bg-white text-9xl">Marks</h3>
      </div>
      <div className="my-1 flex justify-between font-medium">
        <Button
          variant={"ghost"}
          className="flex w-[80%] justify-start font-semibold text-lg hover:bg-slate-300"
        >
          <PlusIcon /> Add a Mark
        </Button>

        <Button
          variant={"ghost"}
          className="font-semibold text-lg hover:bg-slate-300"
        >
          <MoreHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}
