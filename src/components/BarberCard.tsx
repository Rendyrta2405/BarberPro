import Image from "next/image";
import { Barber } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function BarberCard({ barber }: { barber: Barber }) {
  return (
    <div className="card group overflow-hidden">
      <div className="h-64 overflow-hidden bg-ink/10">
        {barber.photo_url ? (
          <Image
            src={barber.photo_url}
            alt={barber.name}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-5xl font-bold text-ink/20">
            {getInitials(barber.name)}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold">{barber.name}</h3>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gold">
          {barber.title}
        </p>
        {barber.bio && (
          <p className="mt-3 text-sm leading-relaxed text-ink/60">{barber.bio}</p>
        )}
      </div>
    </div>
  );
}