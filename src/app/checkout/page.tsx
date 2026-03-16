"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Upload } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart-store";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import type { Order, OrderItem } from "@/types";

const IBAN = "TR00 0000 0000 0000 0000 0000 00";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [receiptBase64, setReceiptBase64] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

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
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!receiptBase64) {
      setError("Lütfen ödeme dekontunu yükleyin.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const orderData: Omit<Order, "id"> = {
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        address: form.address,
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
                disabled={!validateStep1()}
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

              <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                <p className="text-sm font-medium text-neutral-600">
                  Banka Havalesi / EFT
                </p>
                <p className="mt-2 font-mono text-lg font-semibold text-neutral-900">
                  IBAN: {IBAN}
                </p>
                <p className="mt-4 text-sm text-neutral-500">
                  Toplam: ₺{totalPrice.toLocaleString("tr-TR")}
                </p>
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
                  disabled={!receiptBase64 || loading}
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
