'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type LawStandardRow = {
  대분류: string;
  용도: string;
  건폐율상한?: number | null;
  용적률하한?: number | null;
  용적률상한?: number | null;
  층수기준?: string | null;
  주요허용건축물?: string | null;
  개발특징?: string | null;
  투자포인트?: string | null;
  조례위임?: string | null;
  비고?: string | null;
};

interface StandardsPanelProps {
  className?: string;
}

export function StandardsPanel({ className }: StandardsPanelProps) {
  const [rows, setRows] = useState<LawStandardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>('ALL');
  const [usage, setUsage] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/standards.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('표준 데이터 로드 실패');
        const json = (await res.json()) as LawStandardRow[];
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
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => set.add(r.대분류));
    return ['ALL', ...Array.from(set)];
  }, [rows]);

  const usages = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => set.add(r.용도));
    return ['ALL', ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (category !== 'ALL' && r.대분류 !== category) return false;
      if (usage !== 'ALL' && r.용도 !== usage) return false;
      if (search) {
        const hay = `${r.대분류} ${r.용도} ${r.층수기준 ?? ''} ${r.주요허용건축물 ?? ''} ${r.개발특징 ?? ''} ${r.투자포인트 ?? ''} ${r.비고 ?? ''}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, category, usage, search]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-600">법정 기준 데이터를 불러오는 중...</div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">오류: {error}</div>
    );
  }

  return (
    <Card className={className}>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-48">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="대분류" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c === 'ALL' ? '전체 대분류' : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={usage} onValueChange={setUsage}>
              <SelectTrigger>
                <SelectValue placeholder="용도" />
              </SelectTrigger>
              <SelectContent>
                {usages.map(u => (
                  <SelectItem key={u} value={u}>{u === 'ALL' ? '전체 용도' : u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              placeholder="검색: 용도/특징/비고"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="overflow-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="px-3 py-2 text-left whitespace-nowrap">대분류</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">용도</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">건폐율 상한(%)</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">용적률 하한(%)</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">용적률 상한(%)</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">층수 기준</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={`${r.대분류}-${r.용도}-${idx}`} className="border-b last:border-b-0">
                  <td className="px-3 py-2 whitespace-nowrap">{r.대분류}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.용도}</td>
                  <td className="px-3 py-2 text-right">{r.건폐율상한 ?? '-'}</td>
                  <td className="px-3 py-2 text-right">{r.용적률하한 ?? '-'}</td>
                  <td className="px-3 py-2 text-right">{r.용적률상한 ?? '-'}</td>
                  <td className="px-3 py-2">{r.층수기준 ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

