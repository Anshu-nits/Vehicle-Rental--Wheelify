import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Wallet,
  Plus,
  Minus,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../AuthContext/AuthContext";

const WalletPage = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("All");
  const [userBalance, setUserBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const tabs = ["All", "Deposits", "Withdrawals", "Refunds"];

  // API endpoint mapping for different transaction types
  const getApiEndpoint = (tabType) => {
    const endpoints = {
      "All": "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-transaction-history",
      "Deposits": "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-deposit-history",
      "Withdrawals": "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-withdrawal-history",
      "Refunds": "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-refund-history"
    };
    return endpoints[tabType] || endpoints["All"];
  };

  // Fetch initial wallet data (first page)
  const fetchWalletData = async (tabType = "All", page = 1, reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const [balanceRes, transactionRes] = await Promise.all([
        axios.get("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-profile-details", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(getApiEndpoint(tabType), {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          params: {
            page: page,
            limit: ITEMS_PER_PAGE,
            offset: (page - 1) * ITEMS_PER_PAGE
          }
        }),
      ]);

      const user = balanceRes.data.data;
      setUserBalance(user.userBalance || user.balance || 0);
      
      const responseData = transactionRes.data;
      const newTransactions = responseData.history || responseData.transactions || responseData.data || [];
      
      // Handle pagination data from API response - fix for total count
      let total = responseData.total || responseData.totalCount || responseData.totalTransactions;
      
      // If API doesn't return total, use current transactions length as fallback
      // This happens when API doesn't implement proper pagination metadata
      if (total === undefined || total === null || total === 0) {
        if (reset) {
          // First load - we don't know total yet, use current length
          total = newTransactions.length;
        } else {
          // Loading more - keep existing total or calculate
          total = Math.max(totalTransactions, transactions.length + newTransactions.length);
        }
      }
      
      setTotalTransactions(total);
      
      if (reset) {
        // First load or tab change - replace all transactions
        setTransactions(newTransactions);
        setCurrentPage(1);
      } else {
        // Load more - append new transactions
        setTransactions(prev => [...prev, ...newTransactions]);
        setCurrentPage(page);
      }
      
      // Calculate if there are more transactions to load
      const currentLoadedCount = reset ? newTransactions.length : transactions.length + newTransactions.length;
      
      // Better logic for hasMore - if we got exactly ITEMS_PER_PAGE, there might be more
      // If we got less than ITEMS_PER_PAGE, we've reached the end
      let hasMore = false;
      
      if (total > currentLoadedCount) {
        // We know there are more based on total count
        hasMore = true;
      } else if (newTransactions.length === ITEMS_PER_PAGE) {
        // We got a full page, so there might be more (API doesn't provide total)
        hasMore = true;
      } else {
        // We got less than a full page, so we're at the end
        hasMore = false;
      }
      
      setHasMoreTransactions(hasMore);
      
      console.log('Debug - Loaded:', currentLoadedCount, 'Total:', total, 'NewCount:', newTransactions.length, 'HasMore:', hasMore);
      
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      setError("Failed to fetch wallet data");
      if (reset) {
        setUserBalance(0);
        setTransactions([]);
        setTotalTransactions(0);
        setHasMoreTransactions(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more transactions (next page)
  const handleSeeMore = async () => {
    if (loadingMore || !hasMoreTransactions) return;
    
    const nextPage = currentPage + 1;
    await fetchWalletData(activeTab, nextPage, false);
  };

  const handleDeposit = async () => {
    try {
      setDepositLoading(true);
      const res = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/deposit-money",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("₹100 deposited successfully!");
        // Refresh wallet data after deposit
        await fetchWalletData(activeTab, 1, true);
      } else {
        throw new Error(res.data.message || "Deposit failed");
      }
    } catch (err) {
      console.error("Deposit failed:", err);
      if (err.response) {
        alert(`Failed to deposit: ${err.response.data.message}`);
      } else if (err.request) {
        alert("Failed to deposit: Network error.");
      } else {
        alert(`Failed to deposit: ${err.message}`);
      }
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      const res = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/withdraw-money",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("₹100 withdrawn successfully!");
        // Refresh wallet data after withdrawal
        await fetchWalletData(activeTab, 1, true);
      } else {
        throw new Error(res.data.message || "Withdrawal failed");
      }
    } catch (err) {
      console.error("Withdraw failed:", err);
      if (err.response) {
        alert(`Failed to withdraw: ${err.response.data.message}`);
      } else if (err.request) {
        alert("Failed to withdraw: Network error.");
      } else {
        alert(`Failed to withdraw: ${err.message}`);
      }
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Handle tab change with API call
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchWalletData(tab, 1, true);
  };

  useEffect(() => {
    if (token) {
      fetchWalletData();
    }
  }, [token]);

  // Remove client-side filtering since API already handles filtering
  const displayTransactions = transactions;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchWalletData(activeTab, 1, true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 border-b">
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          My Wallet
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Total Balance</h2>
                  <p className="text-green-100 text-sm">Available funds</p>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold">
                  ₹{userBalance.toFixed(2)}
                </span>
              </div>
              <p className="text-green-100 text-sm">Last updated: Just now</p>
            </div>

            <div className="flex flex-col space-y-4 ml-6">
              <button
                onClick={handleDeposit}
                disabled={depositLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-4 px-6 rounded-xl flex items-center space-x-3 font-medium text-lg transition-colors"
              >
                {depositLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Deposit</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWithdraw}
                disabled={withdrawLoading}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-4 px-6 rounded-xl flex items-center space-x-3 font-medium text-lg transition-colors"
              >
                {withdrawLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-5 h-5" />
                    <span>Withdraw</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl mt-6 flex-1">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Transaction History
            </h2>
            <p className="text-gray-500">
              All your wallet transactions in one place
            </p>
          </div>

          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {displayTransactions.length > 0 ? (
              <>
                {displayTransactions.map((transaction, idx) => (
                  <div
                    key={`${transaction.id || idx}-${transaction.timestamp || idx}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div
                      className={`p-3 rounded-full ${
                        transaction.type === "credit" ||
                        transaction.type === "deposit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "credit" ||
                      transaction.type === "deposit" ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {transaction.title ||
                          (transaction.type === "credit"
                            ? "Deposit"
                            : transaction.type === "debit"
                            ? "Withdrawal"
                            : transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)) ||
                          "Transaction"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {transaction.description ||
                          (transaction.type === "credit"  
                            ? "Money deposited to wallet"
                            : transaction.type === "debit"
                            ? "Money withdrawn from wallet"
                            : "No description available")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {transaction.timestamp
                          ? new Date(transaction.timestamp).toLocaleString()
                          : transaction.date
                          ? new Date(transaction.date).toLocaleString()
                          : "No date available"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold text-lg ${
                          transaction.type === "credit" ||
                          transaction.type === "deposit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ||
                        transaction.type === "deposit"
                          ? "+"
                          : "-"}
                        ₹
                        {transaction.amount
                          ? Math.abs(transaction.amount).toFixed(2)
                          : "0.00"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.status ||
                          transaction.paymentStatus ||
                          "Completed"}
                      </p>
                    </div>
                  </div>
                ))}

                {/* See More Button - Now properly visible */}
                {hasMoreTransactions && (
                  <div className="text-center py-6">
                    <button
                      onClick={handleSeeMore}
                      disabled={loadingMore}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-4 rounded-xl flex items-center space-x-3 mx-auto font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Loading more transactions...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            See More ({Math.max(0, totalTransactions - displayTransactions.length)} remaining)
                          </span>
                          <ChevronDown className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Debug info - remove this in production */}
                <div className="text-center py-2 text-sm text-gray-400">
                  <p>
                    Showing {displayTransactions.length} of {totalTransactions} transactions
                    {hasMoreTransactions ? " (More available)" : " (All loaded)"}
                  </p>
                  <p className="text-xs">
                    Current Page: {currentPage} | Has More: {hasMoreTransactions.toString()}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No transactions found for {activeTab.toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;