import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImdbTable from "./imdb-table";
import { useImdbContext } from "@/context/imdb.context";
import Loading from "@/components/loading";

const ImdbListDialog = () => {
  const { imdbListTable } = useImdbContext();

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button variant="outline">View List in Table</Button>
      </DialogTrigger>
      <DialogContent className="w-[825px] max-w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            View IMDb List
          </DialogTitle>
        </DialogHeader>
        {imdbListTable ? (
          <ImdbTable imdbListTable={imdbListTable} />
        ) : (
          <div className="w-full flex justify-center">
            <Loading />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImdbListDialog;
