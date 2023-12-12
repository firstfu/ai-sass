import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Sidebar from "./side-bar";

export default function MobileSidebar() {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="md:hidden pr-4">
          <Menu className="md:hidden block" />
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 bg-secondary pt-10 w-32">
          <Sidebar></Sidebar>
        </SheetContent>
      </Sheet>
    </div>
  );
}
