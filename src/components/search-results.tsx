/**
 * 검색 결과를 표시하는 컴포넌트
 */

import React, { memo } from 'react';
import { SearchResult } from '@/types/building';
import { BuildingRatioCard } from './building-ratio-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  className?: string;
}

export const SearchResults = memo(function SearchResults({ results, isLoading = false, className = '' }: SearchResultsProps) {
  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">검색 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5" />
            검색 결과
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500 text-sm">
              다른 검색 조건을 시도해보세요.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          검색 결과 ({results.length}개)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {results.map((result, index) => (
            <BuildingRatioCard
              key={`${result.city}-${result.detailedLandUseType}-${index}`}
              city={result.city}
              region={result.region}
              landUseType={result.landUseType}
              detailedLandUseType={result.detailedLandUseType}
              buildingRatio={result.buildingRatio}
              floorAreaRatio={result.floorAreaRatio}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
