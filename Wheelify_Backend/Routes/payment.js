import express from "express";
import auth from "../Middlewares/auth.js";
import depositMoney from "../Controllers/Payment/depositMoney.js";
import withdrawMoney from "../Controllers/Payment/withdrawMoney.js";
import getTransactionHistory from "../Controllers/Payment/getTransactionHistory.js";
import getDepositHistory from "../Controllers/Payment/getDepositHistory.js";
import getWithdrawalHistory from "../Controllers/Payment/getWithdrawlHistory.js";
import getRefundHistory from "../Controllers/Payment/getRefundHistory.js";


const router = express.Router();

router.post("/deposit-money", auth, depositMoney);
router.post("/withdraw-money", auth, withdrawMoney);
router.get("/get-transaction-history",auth, getTransactionHistory);
router.get("/get-deposit-history",auth, getDepositHistory);
router.get("/get-withdrawal-history",auth, getWithdrawalHistory);
router.get("/get-refund-history",auth, getRefundHistory);


export default router;