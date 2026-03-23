'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type SidoRow = {
  시도: string;
  용도?: string | null;
  세부용도?: string | null;
  건폐율상한?: number | null;
  용적률하한?: number | null;
  용적률상한?: number | null;
  비고?: string | null;
};

export function SidoOrdinancePanel() {
  const [rows, setRows] = useState<SidoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sido, setSido] = useState<string>('ALL');
  const [usage, setUsage] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/sido-ordinance.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('시도별 조례 데이터 로드 실패');
        const json = (await res.json()) as SidoRow[];
        if (!cancelled) {
          setRows(json);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? '알 수 없는 오류');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true };
  }, []);

  const sidos = useMemo(() => ['ALL', ...Array.from(new Set(rows.map(r => r.시도)))], [rows]);
  const usages = useMemo(() => ['ALL', ...Array.from(new Set(rows.map(r => r.용도 ?? ''))).filter(Boolean)], [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (sido !== 'ALL' && r.시도 !== sido) return false;
      if (usage !== 'ALL' && (r.용도 ?? '') !== usage) return false;
      if (search) {
        const hay = `${r.시도} ${r.용도 ?? ''} ${r.세부용도 ?? ''} ${r.비고 ?? ''}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, sido, usage, search]);

  if (loading) return <div className="p-6 text-sm text-gray-600">시도별 조례 데이터를 불러오는 중...</div>;
  if (error) return <div className="p-6 text-sm text-red-600">오류: {error}</div>;

  return (
    <Card>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-48">
            <Select value={sido} onValueChange={setSido}>
              <SelectTrigger><SelectValue placeholder="시도" /></SelectTrigger>
              <SelectContent>
                {sidos.map(v => <SelectItem key={v} value={v}>{v === 'ALL' ? '전체 시도' : v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={usage} onValueChange={setUsage}>
              <SelectTrigger><SelectValue placeholder="용도" /></SelectTrigger>
              <SelectContent>
                {usages.map(v => <SelectItem key={v} value={v}>{v === 'ALL' ? '전체 용도' : v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input placeholder="검색: 세부용도/비고" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <Separator />

        <div className="overflow-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="px-3 py-2 text-left whitespace-nowrap">시도</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">용도</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">세부용도</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">건폐율 상한(%)</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">용적률 하한(%)</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">용적률 상한(%)</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">비고</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={`${r.시도}-${r.용도}-${r.세부용도}-${i}`} className="border-b last:border-b-0">
                  <td className="px-3 py-2 whitespace-nowrap">{r.시도}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.용도 ?? '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.세부용도 ?? '-'}</td>
                  <td className="px-3 py-2 text-right">{r.건폐율상한 ?? '-'}</td>
                  <td className="px-3 py-2 text-right">{r.용적률하한 ?? '-'}</td>
                  <td className="px-3 py-2 text-right">{r.용적률상한 ?? '-'}</td>
                  <td className="px-3 py-2">{r.비고 ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

