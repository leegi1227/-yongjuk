'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type SigunguRow = {
  시도: string;
  시군구: string;
  용도?: string | null;
  세부용도?: string | null;
  건폐율상한?: number | null;
  용적률하한?: number | null;
  용적률상한?: number | null;
  비고?: string | null;
};

export function SigunguOrdinancePanel() {
  const [rows, setRows] = useState<SigunguRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sido, setSido] = useState<string>('ALL');
  const [sigungu, setSigungu] = useState<string>('ALL');
  const [category, setCategory] = useState<string>('ALL');
  const [usage, setUsage] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/sigungu-ordinance.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('시군구별 조례 데이터 로드 실패');
        const json = (await res.json()) as SigunguRow[];
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

  const sidos = useMemo(() => ['ALL', ...Array.from(new Set(rows.map(r => r.시도))).sort()], [rows]);

  const sigungus = useMemo(() => {
    const list = rows.filter(r => (sido === 'ALL' ? true : r.시도 === sido)).map(r => r.시군구);
    return ['ALL', ...Array.from(new Set(list)).sort((a, b) => a.localeCompare(b, 'ko'))];
  }, [rows, sido]);

  const categories = useMemo(() => ['ALL', ...Array.from(new Set(rows.map(r => r.용도 ?? ''))).filter(Boolean).sort()], [rows]);

  const usages = useMemo(() => {
    const list = rows.filter(r => (category === 'ALL' ? true : r.용도 === category)).map(r => r.세부용도 ?? '');
    return ['ALL', ...Array.from(new Set(list)).filter(Boolean).sort()];
  }, [rows, category]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (sido !== 'ALL' && r.시도 !== sido) return false;
      if (sigungu !== 'ALL' && r.시군구 !== sigungu) return false;
      if (category !== 'ALL' && (r.용도 ?? '') !== category) return false;
      if (usage !== 'ALL' && (r.세부용도 ?? '') !== usage) return false;
      if (search) {
        const hay = `${r.시도} ${r.시군구} ${r.용도 ?? ''} ${r.세부용도 ?? ''} ${r.비고 ?? ''}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, sido, sigungu, category, usage, search]);

  if (loading) return <div className="p-6 text-sm text-gray-600">시군구별 조례 데이터를 불러오는 중...</div>;
  if (error) return <div className="p-6 text-sm text-red-600">오류: {error}</div>;

  return (
    <Card>
      <div className="p-4 sm:p-6 space-y-4">
        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs sm:text-sm text-blue-800">
            💡 <strong>사용 방법:</strong> 시도 → 시군구 → 용도지역 → 세부용도 순서로 선택하면 자동으로 검색됩니다.
          </p>
          {(sido !== 'ALL' || sigungu !== 'ALL' || category !== 'ALL' || usage !== 'ALL' || search) && (
            <p className="text-xs text-blue-700 mt-2 font-medium">
              🔍 필터 적용 중: {[
                sido !== 'ALL' && `시도(${sido})`,
                sigungu !== 'ALL' && `시군구(${sigungu})`,
                category !== 'ALL' && `용도(${category})`,
                usage !== 'ALL' && `세부용도(${usage})`,
                search && `검색어(${search})`
              ].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-44">
              <Select value={sido} onValueChange={(v) => { setSido(v); setSigungu('ALL'); }}>
                <SelectTrigger><SelectValue placeholder="시도" /></SelectTrigger>
                <SelectContent>
                  {sidos.map(v => <SelectItem key={v} value={v}>{v === 'ALL' ? '전체 시도' : v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-52">
              <Select value={sigungu} onValueChange={setSigungu}>
                <SelectTrigger><SelectValue placeholder="시군구" /></SelectTrigger>
                <SelectContent>
                  {sigungus.map(v => <SelectItem key={v} value={v}>{v === 'ALL' ? '전체 시군구' : v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-44">
              <Select value={category} onValueChange={(v) => { setCategory(v); setUsage('ALL'); }}>
                <SelectTrigger><SelectValue placeholder="용도지역" /></SelectTrigger>
                <SelectContent>
                  {categories.map(v => <SelectItem key={v} value={v}>{v === 'ALL' ? '전체 용도지역' : v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-52">
              <Select value={usage} onValueChange={setUsage}>
                <SelectTrigger><SelectValue placeholder="세부용도" /></SelectTrigger>
                <SelectContent>
                  {usages.map(v => <SelectItem key={v} value={v}>{v === 'ALL' ? '전체 세부용도' : v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input placeholder="검색: 시군구/용도/비고" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <Separator />

        {/* 검색 결과 개수 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              검색 결과: <span className="font-semibold text-blue-600">{filtered.length.toLocaleString()}</span>건
            </p>
            {rows.length > 0 && (
              <span className="text-xs text-gray-400">
                (전체 {rows.length.toLocaleString()}건)
              </span>
            )}
          </div>
          {(sido !== 'ALL' || sigungu !== 'ALL' || category !== 'ALL' || usage !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSido('ALL');
                setSigungu('ALL');
                setCategory('ALL');
                setUsage('ALL');
                setSearch('');
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              필터 초기화
            </button>
          )}
        </div>

        <div className="overflow-auto max-h-[600px]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm font-medium">검색 결과가 없습니다.</p>
              <p className="text-xs mt-2">다른 조건으로 검색해보세요.</p>
              {rows.length > 0 && (
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <p>현재 필터:</p>
                  <p>• 시도: {sido}</p>
                  <p>• 시군구: {sigungu}</p>
                  <p>• 용도지역: {category}</p>
                  <p>• 세부용도: {usage}</p>
                  {search && <p>• 검색어: {search}</p>}
                </div>
              )}
            </div>
          ) : (
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600">
                  <th className="px-3 py-2 text-left whitespace-nowrap">시도</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">시군구</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">용도지역</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">세부용도</th>
                  <th className="px-3 py-2 text-right whitespace-nowrap">건폐율 상한(%)</th>
                  <th className="px-3 py-2 text-right whitespace-nowrap">용적률 상한(%)</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">비고</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={`${r.시도}-${r.시군구}-${r.용도}-${r.세부용도}-${i}`} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">{r.시도}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{r.시군구}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{r.용도 ?? '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{r.세부용도 ?? '-'}</td>
                    <td className="px-3 py-2 text-right font-medium">{r.건폐율상한 ?? '-'}</td>
                    <td className="px-3 py-2 text-right font-medium">{r.용적률상한 ?? '-'}</td>
                    <td className="px-3 py-2 text-gray-600">{r.비고 ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Card>
  );
}

