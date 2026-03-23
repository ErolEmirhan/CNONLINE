"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Upload,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart-store";
import { useStoreSettings } from "@/context/store-settings-context";
import { useCampaigns } from "@/context/campaigns-context";
import {
  CartOrderThresholds,
  cartMeetsMinimumOrder,
} from "@/components/CartOrderThresholds";
import { formatTryWhole } from "@/lib/store-settings-doc";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import type { Order, OrderItem } from "@/types";
import { calculateCartPricing } from "@/lib/campaign-pricing";

const IBAN_DISPLAY = "TR05 0006 2000 7900 0006 2907 20";
/** Boşluksuz — havale formlarına yapıştırmak için */
const IBAN_COPY = "TR050006200079000006290720";
const COMPANY_LEGAL_NAME =
  "CN Toptan Gıda Temizlik Ambalaj Sanayi Ticaret LTD.ŞTİ";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { offersByProduct } = useCampaigns();
  const pricing = calculateCartPricing(items, offersByProduct);
  const totalPrice = pricing.totalPrice;
  const lineByProductId = Object.fromEntries(
    pricing.lines.map((l) => [l.productId, l])
  );
  const { settings, isLoading: settingsLoading } = useStoreSettings();
  const meetsMinimum = cartMeetsMinimumOrder(
    totalPrice,
    settings.minimumCartTotal
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    taxIdOrTckn: "",
  });

  const [receiptBase64, setReceiptBase64] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [ibanCopied, setIbanCopied] = useState(false);
  const [ibanCopyFailed, setIbanCopyFailed] = useState(false);

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(IBAN_COPY);
      setIbanCopyFailed(false);
      setIbanCopied(true);
      window.setTimeout(() => setIbanCopied(false), 2200);
    } catch {
      setIbanCopyFailed(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Lütfen resim (JPG, PNG, GIF, WebP) veya PDF yükleyin.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    setError(null);
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setReceiptBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    return (
      form.customerName.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      form.address.trim()
    );
  };

  const handleStep2 = () => {
    if (!validateStep1()) return;
    if (
      !cartMeetsMinimumOrder(totalPrice, settings.minimumCartTotal)
    ) {
      setError(
        `Sipariş için sepet tutarı en az ${formatTryWhole(settings.minimumCartTotal)} olmalı. Sepetinize ürün ekleyin.`
      );
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!receiptBase64) {
      setError("Lütfen ödeme dekontunu yükleyin.");
      return;
    }
    if (!cartMeetsMinimumOrder(totalPrice, settings.minimumCartTotal)) {
      setError(
        `Sepet tutarı güncel minimumun (${formatTryWhole(settings.minimumCartTotal)}) altında. Sepeti güncelleyip tekrar deneyin.`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: lineByProductId[item.product.id]?.unitPrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const trimmedTax = form.taxIdOrTckn.trim();
      const orderData: Omit<Order, "id"> = {
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        ...(trimmedTax ? { taxIdOrTckn: trimmedTax } : {}),
        items: orderItems,
        totalPrice,
        receiptBase64,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "orders"), orderData);
      clearCart();
      setStep(3);

      // Sipariş onay e-postası gönder
      try {
        await fetch("/api/send-order-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: form.customerName,
            email: form.email,
            address: form.address,
            items: orderItems,
            totalPrice,
          }),
        });
      } catch {
        // E-posta gönderilemezse sessizce devam et
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sipariş gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pt-32">
          <p className="text-center text-neutral-600">
            Sepetiniz boş. Sipariş vermek için önce ürün ekleyin.
          </p>
          <Link href="/">
            <Button>Alışverişe Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Alışverişe Dön
        </Link>

        {(step === 1 || step === 2) && items.length > 0 && (
          <CartOrderThresholds
            totalPrice={totalPrice}
            settings={settings}
            isLoading={settingsLoading}
            className="mb-6"
          />
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h1 className="text-2xl font-semibold text-neutral-900">
                Müşteri Bilgileri
              </h1>
              <p className="mt-2 text-neutral-500">
                Siparişinizin teslimatı için bilgilerinizi girin.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <Label htmlFor="customerName">Ad Soyad</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleInputChange}
                    placeholder="Adınız Soyadınız"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="05XX XXX XX XX"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="ornek@email.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adres</Label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="Teslimat adresiniz"
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              <Button
                onClick={handleStep2}
                disabled={
                  !validateStep1() ||
                  settingsLoading ||
                  !meetsMinimum
                }
                className="mt-8 w-full"
                size="lg"
              >
                Devam Et
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h1 className="text-2xl font-semibold text-neutral-900">
                Ödeme
              </h1>
              <p className="mt-2 text-neutral-500">
                Havale/EFT ile ödeme yapın ve dekontu yükleyin.
              </p>

              <div className="mt-8 rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-violet-50/40 p-6 shadow-sm ring-1 ring-violet-100/60">
                <p className="text-sm font-semibold tracking-wide text-neutral-700">
                  Banka Havalesi / EFT
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-neutral-600">
                  {COMPANY_LEGAL_NAME}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
                  <div className="min-w-0 flex-1 rounded-xl border border-neutral-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      IBAN
                    </p>
                    <p className="mt-1.5 break-all font-mono text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
                      {IBAN_DISPLAY}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyIban}
                    className={cn(
                      "h-auto shrink-0 gap-2 rounded-xl border-2 px-5 py-3.5 font-semibold shadow-sm transition-all sm:self-center",
                      ibanCopied
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-50"
                        : "border-violet-200 bg-white text-violet-700 hover:border-violet-300 hover:bg-violet-50"
                    )}
                  >
                    {ibanCopied ? (
                      <>
                        <Check className="h-4 w-4 shrink-0" />
                        Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 shrink-0" />
                        IBAN&apos;ı Kopyala
                      </>
                    )}
                  </Button>
                </div>
                {ibanCopyFailed && (
                  <p className="mt-2 text-xs text-red-600">
                    IBAN kopyalanamadı. Tarayıcı pano iznini kontrol edin veya
                    manuel girin.
                  </p>
                )}
                <p className="mt-4 text-sm text-neutral-500">
                  Toplam: ₺{totalPrice.toLocaleString("tr-TR")}
                </p>
                {pricing.totalDiscount > 0 ? (
                  <p className="mt-1 text-sm font-medium text-emerald-700">
                    Kampanya indirimi: -₺{pricing.totalDiscount.toLocaleString("tr-TR")}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-neutral-200 bg-white/60 px-4 py-5 sm:px-5">
                <Label
                  htmlFor="taxIdOrTckn"
                  className="text-sm font-medium text-neutral-800"
                >
                  Vergi numarası veya TC Kimlik No{" "}
                  <span className="font-normal text-neutral-500">(opsiyonel)</span>
                </Label>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                  Fatura keserken kullanırız; KDV indirimi gibi durumlarda not
                  düşmek için de işinize yarayabilir.
                </p>
                <Input
                  id="taxIdOrTckn"
                  name="taxIdOrTckn"
                  value={form.taxIdOrTckn}
                  onChange={handleInputChange}
                  placeholder="10 haneli VKN veya 11 haneli TCKN"
                  className="mt-3"
                  maxLength={32}
                  autoComplete="off"
                />
              </div>

              <div className="mt-8">
                <Label>Ödeme Dekontu (Resim veya PDF)</Label>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 transition-colors hover:border-neutral-400 hover:bg-neutral-100">
                  <Upload className="h-10 w-10 text-neutral-400" />
                  <span className="mt-2 text-sm font-medium text-neutral-600">
                    {receiptFile
                      ? receiptFile.name
                      : "Dosya seçmek için tıklayın"}
                  </span>
                  <span className="mt-1 text-xs text-neutral-500">
                    JPG, PNG, GIF, WebP veya PDF (max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}

              <div className="mt-8 flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Geri
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!receiptBase64 || loading || !meetsMinimum}
                  size="lg"
                  className="group flex-1 gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-6 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 hover:shadow-violet-500/30 focus-visible:ring-violet-400/50 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Siparişi Tamamla</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-semibold text-neutral-900">
                Siparişiniz Alındı
              </h1>
              <p className="mt-2 text-neutral-500">
                Siparişiniz başarıyla oluşturuldu. En kısa sürede sizinle
                iletişime geçeceğiz.
              </p>
              <Link href="/">
                <Button className="mt-8">Alışverişe Dön</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
