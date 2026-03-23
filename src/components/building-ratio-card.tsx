/**
 * 건폐율/용적률 정보를 표시하는 카드 컴포넌트
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BuildingRatio, Region } from '@/types/building';

interface BuildingRatioCardProps {
  city: string;
  region: Region;
  landUseType: string;
  detailedLandUseType: string;
  buildingRatio: number;
  floorAreaRatio: number;
  className?: string;
}

export const BuildingRatioCard = memo(function BuildingRatioCard({
  city,
  region,
  landUseType,
  detailedLandUseType,
  buildingRatio,
  floorAreaRatio,
  className = ''
}: BuildingRatioCardProps) {
  return (
    <Card className={`w-full mb-2 sm:mb-3 ${className}`}>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
            {city}
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {region}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1">
              {landUseType}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            {detailedLandUseType}
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {buildingRatio}%
              </div>
              <div className="text-xs text-blue-500 font-medium">
                건폐율
              </div>
            </div>
            
            <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {floorAreaRatio}%
              </div>
              <div className="text-xs text-green-500 font-medium">
                용적률
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
