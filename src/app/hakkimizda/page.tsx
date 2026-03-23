import Link from "next/link";
import { ArrowLeft, BadgeCheck, Boxes, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const STATS = [
  { label: "Kurumsal kalite", value: "Standart süreç" },
  { label: "Operasyon", value: "Hızlı tedarik" },
  { label: "Müşteri odağı", value: "Şeffaf iletişim" },
];

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="rounded-3xl border border-neutral-200/80 bg-gradient-to-br from-white via-neutral-50/70 to-white p-6 shadow-[0_10px_45px_-20px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-neutral-700">
              <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
              Kurumsal Profil
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfa
            </Link>
          </div>

          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Hakkımızda
          </h1>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
            CN Toptan Gıda, işletmelerin tedarik süreçlerini yalınlaştırmak için
            modern dijital sipariş deneyimi sunar. Ürün seçimi, sipariş yönetimi
            ve operasyonel takibi tek noktada birleştirir.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {STATS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-neutral-200 bg-white/85 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-neutral-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-neutral-100 p-2.5">
              <Boxes className="h-5 w-5 text-neutral-700" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Ürün Güveni</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Ürün bilgilerini standartlaştırır, stok ve sipariş akışını anlaşılır
              hale getiririz.
            </p>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-neutral-100 p-2.5">
              <Truck className="h-5 w-5 text-neutral-700" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Hızlı Operasyon</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Siparişten teslimata kadar net adımlarla, süreci hız ve kalite
              dengesinde yönetiriz.
            </p>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-neutral-100 p-2.5">
              <ShieldCheck className="h-5 w-5 text-neutral-700" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Kurumsal Disiplin</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Şeffaf iletişim, sürdürülebilir tedarik ve uzun vadeli iş ortaklığı
              yaklaşımını esas alırız.
            </p>
          </article>
        </div>

        <section className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
            <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
              Amacımız yalnızca ürün satmak değil; işletmeler için güvenilir,
              ölçülebilir ve sürdürülebilir bir tedarik altyapısı kurmaktır.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
