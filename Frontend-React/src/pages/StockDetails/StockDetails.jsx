import { useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookmarkFilledIcon, BookmarkIcon, DotIcon } from "@radix-ui/react-icons";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

// Custom Components
import StockChart from "./StockChart";
import TreadingForm from "./TreadingForm";

// Redux Actions
import { fetchCoinDetails } from "@/Redux/Coin/Action";
import { addItemToWatchlist, getUserWatchlist } from "@/Redux/Watchlist/Action";
import { getUserWallet } from "@/Redux/Wallet/Action";

// Utilities
import { existInWatchlist } from "@/Util/existInWatchlist";

const StockDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { coin, watchlist, auth } = useSelector((store) => store);

  // Get stored JWT once
  const jwt = useMemo(() => auth.jwt || localStorage.getItem("jwt"), [auth.jwt]);

  // Fetch coin details when ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails({ coinId: id, jwt }));
    }
  }, [id, jwt, dispatch]);

  // Fetch user data once on component mount
  useEffect(() => {
    dispatch(getUserWatchlist());
    dispatch(getUserWallet(jwt));
  }, [dispatch, jwt]);

  // Memoize coin details for performance
  const coinDetails = useMemo(() => coin.coinDetails, [coin.coinDetails]);

  // Memoize price change class
  const priceChangeClass = useMemo(() => {
    if (!coinDetails?.market_data?.market_cap_change_24h) return "text-gray-400";
    return coinDetails.market_data.market_cap_change_24h < 0
      ? "text-red-500"
      : "text-green-500";
  }, [coinDetails?.market_data?.market_cap_change_24h]);

  // Handle add to watchlist with useCallback
  const handleAddToWatchlist = useCallback(() => {
    if (coinDetails?.id) {
      dispatch(addItemToWatchlist(coinDetails.id));
    }
  }, [dispatch, coinDetails?.id]);

  // Show loading state
  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

  // Safely check for required data
  if (!coinDetails) {
    return <div className="p-6 text-center text-white">No coin data available</div>;
  }

  return (
    <div className="p-6 mt-6 bg-gray-900 rounded-xl shadow-lg">
      <div className="flex justify-between items-center">
        {/* Left Section: Coin Details */}
        <div className="flex gap-6 items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={coinDetails.image?.large} alt={coinDetails.name} />
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <p>{coinDetails.symbol?.toUpperCase()}</p>
              <DotIcon className="text-gray-500" />
              <p className="text-gray-400">{coinDetails.name}</p>
            </div>
            
            <div className="flex items-end gap-3 mt-1">
              <p className="text-3xl font-bold text-white">
                ${coinDetails.market_data?.current_price?.usd?.toLocaleString() || "N/A"}
              </p>
              <p className={`text-lg font-medium ${priceChangeClass}`}>
                {coinDetails.market_data?.market_cap_change_24h?.toFixed(2) || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-6">
          <Button
            onClick={handleAddToWatchlist}
            className="h-12 w-12 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300"
            aria-label={existInWatchlist(watchlist.items, coinDetails) ? "Remove from watchlist" : "Add to watchlist"}
          >
            {existInWatchlist(watchlist.items, coinDetails) ? (
              <BookmarkFilledIcon className="h-6 w-6 text-yellow-500" />
            ) : (
              <BookmarkIcon className="h-6 w-6 text-gray-300" />
            )}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-500 transition-all duration-300 rounded-lg text-lg shadow-md">
                TRADE
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-700 rounded-lg">
              <DialogHeader>
                <DialogTitle className="px-10 pt-5 text-center text-lg font-semibold">
                  How much do you want to spend?
                </DialogTitle>
              </DialogHeader>
              <TreadingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-6">
        <StockChart coinId={coinDetails.id} />
      </div>
    </div>
  );
};

export default StockDetails;