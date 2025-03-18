import { useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  depositMoney,
  getUserWallet,
  getWalletTransactions,
} from "@/Redux/Wallet/Action";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";

// UI Components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

// Icons
import {
  CopyIcon,
  DownloadIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { DollarSign, WalletIcon } from "lucide-react";

// Forms
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";

// Custom hook for query parameters
const useQuery = () => new URLSearchParams(useLocation().search);

// Memoized wallet action components 
const ActionButton = memo(({ icon: Icon, label, onClick }) => (
  <div 
    onClick={onClick}
    className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-slate-800 shadow-md"
  >
    <Icon />
    <span className="text-sm mt-2">{label}</span>
  </div>
));

// Transaction item component
const TransactionItem = memo(({ transaction }) => (
  <Card className="lg:w-[50] px-5 py-2 flex justify-between items-center">
    <div className="flex items-center gap-5">
      <Avatar>
        <AvatarFallback>
          <ShuffleIcon />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h1>{transaction.type || transaction.purpose}</h1>
        <p className="text-sm text-gray-500">{transaction.date}</p>
      </div>
    </div>
    <div>
      <p className="flex items-center">
        <span className={`${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
          {transaction.amount} USD
        </span>
      </p>
    </div>
  </Card>
));

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wallet } = useSelector((store) => store);
  const query = useQuery();
  const { order_id } = useParams();
  
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const orderId = query.get("order_id");
  
  const jwt = localStorage.getItem("jwt");

  // Memoized handlers to prevent unnecessary re-renders
  const handleFetchUserWallet = useCallback(() => {
    dispatch(getUserWallet(jwt));
  }, [dispatch, jwt]);

  const handleFetchWalletTransactions = useCallback(() => {
    dispatch(getWalletTransactions({ jwt }));
  }, [dispatch, jwt]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      
      // Fallback for browsers that don't support clipboard API
      const element = document.createElement("textarea");
      element.value = text;
      document.body.appendChild(element);
      element.select();
      document.execCommand("copy");
      document.body.removeChild(element);
    }
  }, []);

  // Handle payment processing
  useEffect(() => {
    const effectiveOrderId = orderId || order_id;
    if (effectiveOrderId) {
      dispatch(
        depositMoney({
          jwt,
          orderId: effectiveOrderId,
          paymentId: razorpayPaymentId || "AuedkfeuUe",
          navigate,
        })
      );
    }
  }, [dispatch, jwt, navigate, order_id, orderId, razorpayPaymentId]);

  // Initial data loading
  useEffect(() => {
    handleFetchUserWallet();
    handleFetchWalletTransactions();
    dispatch(getPaymentDetails({ jwt }));
  }, [dispatch, handleFetchUserWallet, handleFetchWalletTransactions, jwt]);

  if (wallet.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">
                      #FAVHJY{wallet.userWallet?.id}
                    </p>
                    <CopyIcon
                      onClick={() => copyToClipboard(wallet.userWallet?.id)}
                      className="cursor-pointer hover:text-slate-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <ReloadIcon
                  onClick={handleFetchUserWallet}
                  className="w-6 h-6 cursor-pointer hover:text-gray-400"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign />
              <span className="text-2xl font-semibold">
                {wallet.userWallet?.balance}
              </span>
            </div>

            <div className="flex gap-7 mt-5">
              <Dialog>
                <DialogTrigger asChild>
                  <ActionButton icon={UploadIcon} label="Add Money" />
                </DialogTrigger>
                <DialogContent className="p-10">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                      Top Up Your Wallet
                    </DialogTitle>
                    <TopupForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <ActionButton icon={DownloadIcon} label="Withdraw" />
                </DialogTrigger>
                <DialogContent className="p-10">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Request Withdrawal
                    </DialogTitle>
                    <WithdrawForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <ActionButton icon={ShuffleIcon} label="Transfer" />
                </DialogTrigger>
                <DialogContent className="p-10">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Transfer To Other Wallet
                    </DialogTitle>
                    <TransferForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-semibold">History</h1>
            <UpdateIcon
              onClick={handleFetchWalletTransactions}
              className="p-0 h-7 w-7 cursor-pointer hover:text-gray-400"
            />
          </div>

          <div className="space-y-5">
            {wallet.transactions?.map((item, index) => (
              <TransactionItem key={index} transaction={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;