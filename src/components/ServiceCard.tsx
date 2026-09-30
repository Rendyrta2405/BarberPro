import Image from "next/image";
import { Service } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card group overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-ink/10">
        {service.image_url && (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute right-3 bottom-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-bold text-gold">
          {formatRupiah(service.price)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold">{service.name}</h3>
        <p className="mt-1 text-sm text-ink/60">{service.description}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink/40">
          ± {service.duration} menit
        </p>
      </div>
    </div>
  );
}