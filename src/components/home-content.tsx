'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SearchFilters } from '@/components/search-filters';
import { SearchResults } from '@/components/search-results';
import { StatisticsPanel } from '@/components/statistics-panel';
import { StandardsPanel } from '@/components/standards-panel';
import { LoadingSpinner } from '@/components/loading-spinner';
import { parseBuildingData, convertToSearchResults, calculateStatistics } from '@/lib/data-parser';
import { SearchFilter, SearchResult, StatisticsData } from '@/types/building';
import { Building, Search, BarChart3 } from 'lucide-react';
import { SidoOrdinancePanel } from '@/components/sido-ordinance-panel';
import { SigunguOrdinancePanel } from '@/components/sigungu-ordinance-panel';

type SigunguOptionRow = {
  시도: string;
  시군구: string;
};

export default function HomeContent() {
  const [buildingData, setBuildingData] = useState<SearchResult[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData>({
    totalCities: 0,
    averageBuildingRatio: 0,
    averageFloorAreaRatio: 0,
    maxBuildingRatio: 0,
    maxFloorAreaRatio: 0,
    minBuildingRatio: 0,
    minFloorAreaRatio: 0
  });
  const [filters, setFilters] = useState<SearchFilter>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'search' | 'statistics' | 'standards' | 'sido' | 'sigungu'>('search');
  const [sigunguRows, setSigunguRows] = useState<SigunguOptionRow[]>([]);

  // 지역별 시군구 옵션(시군구별 조례 데이터 기준)
  const sigunguOptions = useMemo(() => {
    const pool = filters.region
      ? sigunguRows.filter((row) => row.시도 === filters.region)
      : sigunguRows;
    return Array.from(new Set(pool.map((row) => row.시군구))).sort((a, b) => a.localeCompare(b, 'ko'));
  }, [sigunguRows, filters.region]);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [parsedData, sigunguResponse] = await Promise.all([
          parseBuildingData(),
          fetch('/sigungu-ordinance.json', { cache: 'no-store' }),
        ]);

        if (!sigunguResponse.ok) {
          throw new Error('시군구 조례 데이터 로드 실패');
        }
        const sigunguJson = await sigunguResponse.json();
        // 시도-시군구 매핑만 추출 (중복 제거)
        const uniqueSigungu = Array.from(
          new Set(sigunguJson.map((row: any) => JSON.stringify({ 시도: row.시도, 시군구: row.시군구 })))
        ).map((str: unknown) => JSON.parse(str as string)) as SigunguOptionRow[];

        const searchResults = convertToSearchResults(parsedData);
        const stats = calculateStatistics(searchResults);

        setSigunguRows(uniqueSigungu);
        setBuildingData(searchResults);
        setStatistics(stats);
        setSearchResults(searchResults);
        setIsLoading(false);
      } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 검색 실행 (useCallback으로 최적화)
  const handleSearch = useCallback(() => {
    const filtered = buildingData.filter(result => {
      if (filters.region && result.region !== filters.region) return false;
      if (filters.sigungu && result.city !== filters.sigungu) return false;
      if (filters.landUseType && result.landUseType !== filters.landUseType) return false;
      if (filters.detailedLandUseType && result.detailedLandUseType !== filters.detailedLandUseType) return false;
      if (filters.minBuildingRatio !== undefined && result.buildingRatio < filters.minBuildingRatio) return false;
      if (filters.maxBuildingRatio !== undefined && result.buildingRatio > filters.maxBuildingRatio) return false;
      if (filters.minFloorAreaRatio !== undefined && result.floorAreaRatio < filters.minFloorAreaRatio) return false;
      if (filters.maxFloorAreaRatio !== undefined && result.floorAreaRatio > filters.maxFloorAreaRatio) return false;
      return true;
    });

    setSearchResults(filtered);
  }, [buildingData, filters]);

  // 필터 초기화 (useCallback으로 최적화)
  const handleReset = useCallback(() => {
    setFilters({});
    setSearchResults(buildingData);
  }, [buildingData]);

  // 탭 변경
  const handleTabChange = (tab: 'search' | 'statistics' | 'standards' | 'sido' | 'sigungu') => {
    setActiveTab(tab);
  };

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600" suppressHydrationWarning>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
          <div className="flex items-center justify-between h-14 sm:h-16" suppressHydrationWarning>
            <div className="flex items-center gap-2 sm:gap-3" suppressHydrationWarning>
              <Building className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900" suppressHydrationWarning>
                <span className="hidden sm:inline">건폐율/용적률 현황 조회</span>
                <span className="sm:hidden">건폐율/용적률</span>
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-500" suppressHydrationWarning>
              2025년 기준
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
          <nav className="flex space-x-4 sm:space-x-8" suppressHydrationWarning>
            <button
              onClick={() => handleTabChange('search')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Search className="w-4 h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">검색</span>
            </button>
            <button
              onClick={() => handleTabChange('statistics')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">통계</span>
            </button>
            <button
              onClick={() => handleTabChange('standards')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'standards'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">법정기준</span>
              <span className="sm:hidden">기준</span>
            </button>
            <button
              onClick={() => handleTabChange('sido')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sido'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">시도별 조례</span>
              <span className="sm:hidden">시도</span>
            </button>
            <button
              onClick={() => handleTabChange('sigungu')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sigungu'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">시군구별 조례</span>
              <span className="sm:hidden">시군구</span>
            </button>
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" suppressHydrationWarning>
        {activeTab === 'search' ? (
          <div className="space-y-4 sm:space-y-6">
            {/* 검색 필터 */}
            <SearchFilters
              filters={filters}
              sigunguOptions={sigunguOptions}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />

            {/* 검색 결과 */}
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
            />
          </div>
        ) : activeTab === 'statistics' ? (
          <div className="space-y-4 sm:space-y-6">
            {/* 통계 패널 */}
            <StatisticsPanel statistics={statistics} />
          </div>
        ) : activeTab === 'standards' ? (
          <div className="space-y-4 sm:space-y-6">
            <StandardsPanel />
          </div>
        ) : activeTab === 'sido' ? (
          <div className="space-y-4 sm:space-y-6">
            <SidoOrdinancePanel />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <SigunguOrdinancePanel />
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-8 sm:mt-12" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" suppressHydrationWarning>
          <div className="text-center text-xs sm:text-sm text-gray-500" suppressHydrationWarning>
            <p suppressHydrationWarning>건폐율/용적률 현황 조회 시스템</p>
            <p className="mt-1" suppressHydrationWarning>2025년 기준 전국 도시 건폐율/용적률 데이터</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
