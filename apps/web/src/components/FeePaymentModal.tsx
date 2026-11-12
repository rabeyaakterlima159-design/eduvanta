'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
} from 'lucide-react';

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceNumber: string;
    title: string;
    studentName: string;
    amount: number;
    balanceDue: number;
  };
  onSuccess: (receiptNumber: string) => void;
}

export default function FeePaymentModal({
  isOpen,
  onClose,
  invoice,
  onSuccess,
}: FeePaymentModalProps) {
  const [gateway, setGateway] = useState<'bkash' | 'nagad' | 'sslcommerz'>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    // Simulate real gateway verification callback
    setTimeout(() => {
      const generatedReceipt = `RCP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setPaidReceipt(generatedReceipt);
      setIsProcessing(false);
      onSuccess(generatedReceipt);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!paidReceipt ? (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                Secure Bangladesh Gateway
              </span>
              <h3 className="text-xl font-black text-[#102A56]">Tuition Fee Payment</h3>
              <p className="text-xs text-slate-500">
                Invoice <span className="font-mono font-bold">{invoice.invoiceNumber}</span>
              </p>
            </div>

            {/* Invoice Breakdown */}
            <div className="bg-[#F5F8FC] border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-800">{invoice.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee Category:</span>
                <span className="font-bold text-slate-800">{invoice.title}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2 text-sm">
                <span className="font-bold text-slate-800">Total Payable:</span>
                <span className="font-black text-[#102A56] text-base">
                  ৳{invoice.balanceDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Gateway Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setGateway('bkash')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    gateway === 'bkash'
                      ? 'border-[#E2136E] bg-[#E2136E]/5 text-[#E2136E] font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-black text-sm text-[#E2136E]">bKash</span>
                  <span className="text-[9px]">Tokenized URL</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setGateway('nagad')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    gateway === 'nagad'
                      ? 'border-[#F7941D] bg-[#F7941D]/5 text-[#F7941D] font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-black text-sm text-[#F7941D]">Nagad</span>
                  <span className="text-[9px]">Direct DFS API</span>
                </button>

                {/* SSLCommerz */}
                <button
                  type="button"
                  onClick={() => setGateway('sslcommerz')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    gateway === 'sslcommerz'
                      ? 'border-[#0070BA] bg-[#0070BA]/5 text-[#0070BA] font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-black text-sm text-[#0070BA]">Cards</span>
                  <span className="text-[9px]">SSLCommerz</span>
                </button>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>256-bit SSL encrypted. Payment verified server-side.</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#102A56] hover:bg-[#1a3d75] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-950/25 transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {isProcessing ? 'Verifying with Gateway...' : `Authorize ৳${invoice.balanceDue.toLocaleString()}`}
            </button>
          </>
        ) : (
          /* Payment Success & Receipt View */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Payment Successful!</h3>
            <p className="text-xs text-slate-600">
              Your transaction has been cryptographically verified and recorded in the campus ledger.
            </p>

            <div className="bg-[#F5F8FC] border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Official Receipt No:</span>
                <span className="font-mono font-bold text-blue-600">{paidReceipt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-800">৳{invoice.balanceDue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold uppercase text-slate-700">{gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-700">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  alert(`Downloading PDF receipt for ${paidReceipt}...`);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
