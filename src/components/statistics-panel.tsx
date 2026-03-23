/**
 * 통계 정보를 표시하는 패널 컴포넌트
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatisticsData } from '@/types/building';
import { BarChart3, TrendingUp, TrendingDown, MapPin } from 'lucide-react';

interface StatisticsPanelProps {
  statistics: StatisticsData;
  className?: string;
}

export function StatisticsPanel({ statistics, className = '' }: StatisticsPanelProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
          통계 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* 전체 도시 수 */}
        <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium text-blue-800">전체 도시</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-blue-600">
            {statistics.totalCities}개
          </span>
        </div>

        {/* 평균 건폐율 */}
        <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs sm:text-sm font-medium text-green-800">평균 건폐율</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-green-600">
            {statistics.averageBuildingRatio}%
          </span>
        </div>

        {/* 평균 용적률 */}
        <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-xs sm:text-sm font-medium text-purple-800">평균 용적률</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-purple-600">
            {statistics.averageFloorAreaRatio}%
          </span>
        </div>

        {/* 최대/최소 값들 */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-medium text-orange-800">최대 건폐율</span>
            </div>
            <span className="text-sm sm:text-lg font-bold text-orange-600">
              {statistics.maxBuildingRatio}%
            </span>
          </div>

          <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-xs font-medium text-red-800">최소 건폐율</span>
            </div>
            <span className="text-sm sm:text-lg font-bold text-red-600">
              {statistics.minBuildingRatio}%
            </span>
          </div>

          <div className="p-2 sm:p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-800">최대 용적률</span>
            </div>
            <span className="text-sm sm:text-lg font-bold text-indigo-600">
              {statistics.maxFloorAreaRatio}%
            </span>
          </div>

          <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-800">최소 용적률</span>
            </div>
            <span className="text-sm sm:text-lg font-bold text-gray-600">
              {statistics.minFloorAreaRatio}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
