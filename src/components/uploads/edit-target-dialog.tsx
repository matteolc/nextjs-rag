import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { typeFilters } from "./columns";
import type { Tables } from "@/app/db.types";
import { Textarea } from "@/ui/textarea";
import { useEffect } from "react";

export function EditTargetDialog({
  target,
  open,
  onOpenChange,
}: {
  target: Tables<"uploads">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Target</DialogTitle>
        </DialogHeader>
        <form>
          <div className="space-y-4">
            <input type="hidden" name="id" value={target.id} />
            <div className="mt-8">
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
