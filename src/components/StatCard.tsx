interface StatCardProps {
   label: string;
   value: string;
   sub?: string;
}

export default function StatCard({ label, value, sub }: StatCardProps) {
   return (      
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
         <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
           {label}
         </p>
         <p className="mt-1 text-xl font-extrabold text-gray-900">
            {value}
         </p>
         {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
      </div>
   );
}