import type { LeadEntry } from "@/lib/content/types";

import { Badge } from "@/components/ui/badge";

type LeadsTableProps = {
  leads: LeadEntry[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  if (!leads.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-800 p-6 text-sm text-brand-300">
        Belum ada lead masuk.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-800/70 bg-brand-925/70">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-brand-800 bg-brand-950/70 text-brand-300">
          <tr>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Kontak</th>
            <th className="px-4 py-3">Pesan</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-brand-800/70 align-top text-brand-100">
              <td className="px-4 py-3">
                <p className="font-medium text-white">{lead.name}</p>
                {lead.company ? <p className="text-xs text-brand-400">{lead.company}</p> : null}
              </td>
              <td className="px-4 py-3 text-xs">
                <p>{lead.email}</p>
                <p>{lead.phone}</p>
              </td>
              <td className="px-4 py-3 text-xs leading-6 text-brand-200">{lead.message}</td>
              <td className="px-4 py-3">
                <Badge className="bg-brand-300 text-brand-950">{lead.status}</Badge>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-brand-400">
                {new Date(lead.createdAt).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
