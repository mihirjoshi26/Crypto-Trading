import { useEffect, useCallback, memo, useState } from "react";
import { removeItemFromWatchlist, getUserWatchlist } from "@/Redux/Watchlist/Action";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon, ReloadIcon } from "@radix-ui/react-icons";

// Memoized table row component to prevent unnecessary re-renders
const WatchlistRow = memo(({ item, onRemoveFromWatchlist, onNavigate, isRemoving }) => (
  <TableRow key={item.id}>
    <TableCell
      onClick={() => onNavigate(item.id)}
      className="font-medium flex items-center gap-2 cursor-pointer"
    >
      <Avatar className="-z-50">
        <AvatarImage src={item.image} alt={item.symbol} />
      </Avatar>
      <span>{item.name}</span>
    </TableCell>
    <TableCell>{item.symbol.toUpperCase()}</TableCell>
    <TableCell>{Number(item.total_volume).toLocaleString()}</TableCell>
    <TableCell>{Number(item.market_cap).toLocaleString()}</TableCell>
    <TableCell
      className={item.market_cap_change_percentage_24h < 0 ? "text-red-600" : "text-green-600"}
    >
      {item.market_cap_change_percentage_24h.toFixed(2)}%
    </TableCell>
    <TableCell>{Number(item.current_price).toLocaleString()}</TableCell>
    <TableCell className="text-right">
      <Button
        onClick={() => onRemoveFromWatchlist(item.id)}
        className="h-10 w-10"
        variant="outline"
        size="icon"
        disabled={isRemoving === item.id}
        aria-label={`Remove ${item.name} from watchlist`}
      >
        {isRemoving === item.id ? (
          <ReloadIcon className="h-4 w-4 animate-spin" />
        ) : (
          <BookmarkFilledIcon className="h-6 w-6" />
        )}
      </Button>
    </TableCell>
  </TableRow>
));

WatchlistRow.displayName = "WatchlistRow";

const Watchlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((store) => store.watchlist);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    dispatch(getUserWatchlist());
  }, [dispatch]);

  const handleRemoveFromWatchlist = useCallback((id) => {
    setRemovingId(id);
    dispatch(removeItemFromWatchlist(id))
      .finally(() => {
        setRemovingId(null);
      });
  }, [dispatch]);

  const handleNavigate = useCallback((id) => {
    navigate(`/market/${id}`);
  }, [navigate]);

  return (
    <div className="pt-8 lg:px-10">
      <div className="flex items-center pt-5 pb-10 gap-5">
        <BookmarkFilledIcon className="h-10 w-10" />
        <h1 className="text-4xl font-semibold">Watchlist</h1>
      </div>

      <Table className="px-5 lg:px-20 border-t relative border-x border-b p-10">
        <ScrollArea>
          <TableHeader>
            <TableRow className="sticky top-0 left-0 right-0 bg-background">
              <TableHead className="py-4">Coin</TableHead>
              <TableHead>SYMBOL</TableHead>
              <TableHead>VOLUME</TableHead>
              <TableHead>MARKET CAP</TableHead>
              <TableHead>24H</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead className="text-right text-red-700">Remove</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <ReloadIcon className="h-6 w-6 animate-spin mr-2" />
                    Loading watchlist...
                  </div>
                </TableCell>
              </TableRow>
            ) : items && items.length > 0 ? (
              items.map((item) => (
                <WatchlistRow
                  key={item.id}
                  item={item}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                  onNavigate={handleNavigate}
                  isRemoving={removingId === item.id}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No items in your watchlist
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
};

export default Watchlist;