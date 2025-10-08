'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SearchFilters } from '@/components/search-filters';
import { SearchResults } from '@/components/search-results';
import { StatisticsPanel } from '@/components/statistics-panel';
import { LoadingSpinner } from '@/components/loading-spinner';
import { parseBuildingData, convertToSearchResults, calculateStatistics } from '@/lib/data-parser';
import { SearchFilter, SearchResult, StatisticsData } from '@/types/building';
import { Building, Search, BarChart3 } from 'lucide-react';

export default function Home() {
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
  const [activeTab, setActiveTab] = useState<'search' | 'statistics'>('search');

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const parsedData = await parseBuildingData();
        const searchResults = convertToSearchResults(parsedData);
        const stats = calculateStatistics(searchResults);
        
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
  const handleTabChange = (tab: 'search' | 'statistics') => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Building className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                <span className="hidden sm:inline">건폐율/용적률 현황 조회</span>
                <span className="sm:hidden">건폐율/용적률</span>
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              2024년 기준
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-8">
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
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'search' ? (
          <div className="space-y-4 sm:space-y-6">
            {/* 검색 필터 */}
            <SearchFilters
              filters={filters}
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
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* 통계 패널 */}
            <StatisticsPanel statistics={statistics} />
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            <p>건폐율/용적률 현황 조회 시스템</p>
            <p className="mt-1">2024년 기준 전국 도시 건폐율/용적률 데이터</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
