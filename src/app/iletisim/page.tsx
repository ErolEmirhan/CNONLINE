import Link from "next/link";
import { ArrowLeft, Clock3, MapPin, MessageSquare, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const CONTACT_ITEMS = [
  {
    title: "Telefon",
    value: "+90 545 400 7941",
    hint: "+90 543 724 2529",
    Icon: Phone,
  },
  {
    title: "Adres",
    value: "CN Toptan Gıda, Musalla Bağları, Gürz Sk. No:7, 42600 Selçuklu/Konya",
    hint: "Merkez ofis",
    Icon: MapPin,
  },
  {
    title: "Çalışma Saatleri",
    value: "09:00 – 18:00",
    hint: "Pazartesi - Cumartesi",
    Icon: Clock3,
  },
];

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="rounded-3xl border border-neutral-200/80 bg-gradient-to-br from-white via-neutral-50/70 to-white p-6 shadow-[0_10px_45px_-20px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-neutral-700">
              <MessageSquare className="h-3.5 w-3.5 text-neutral-500" />
              Kurumsal İletişim
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
            İletişim
          </h1>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
            Ürünler, sipariş süreçleri, teklif talepleri ve kurumsal iş birliği
            konularında ekibimizle kolayca iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CONTACT_ITEMS.map(({ title, value, hint, Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 inline-flex rounded-xl bg-neutral-100 p-2.5">
                <Icon className="h-5 w-5 text-neutral-700" />
              </div>
              <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
              <p className="mt-1 text-base font-medium text-neutral-700">{value}</p>
              <p className="mt-2 text-sm text-neutral-500">{hint}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Hızlı geri dönüş politikamız
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Operasyonel taleplerde aynı iş günü içerisinde, kurumsal teklif ve
            iş birliği taleplerinde en geç 24 saat içinde geri dönüş sağlıyoruz.
          </p>
        </section>
      </main>
    </div>
  );
}
