/**
 * 검색 필터 컴포넌트
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { SearchFilter, Region, LandUseType, DetailedLandUseType } from '@/types/building';

interface SearchFiltersProps {
  filters: SearchFilter;
  onFiltersChange: (filters: SearchFilter) => void;
  onSearch: () => void;
  onReset: () => void;
  className?: string;
}

const REGIONS: Region[] = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도'
];

const LAND_USE_TYPES: LandUseType[] = [
  '전용주거지역',
  '일반주거지역',
  '준주거지역',
  '상업지역',
  '공업지역',
  '녹지지역',
  '관리지역',
  '농림지역',
  '자연환경보전지역'
];

const DETAILED_LAND_USE_TYPES: DetailedLandUseType[] = [
  '제1종전용주거',
  '제2종전용주거',
  '제1종일반주거',
  '제2종일반주거',
  '제3종일반주거',
  '중심상업',
  '일반상업',
  '근린상업',
  '유통상업',
  '전용공업',
  '일반공업',
  '준공업',
  '보전녹지',
  '생산녹지',
  '자연녹지',
  '보전관리',
  '생산관리',
  '계획관리'
];

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  className = ''
}: SearchFiltersProps) {
  const handleFilterChange = (key: keyof SearchFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '전체' ? undefined : value
    });
  };

  const handleNumberChange = (key: 'minBuildingRatio' | 'maxBuildingRatio' | 'minFloorAreaRatio' | 'maxFloorAreaRatio', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value, 10);
    onFiltersChange({
      ...filters,
      [key]: isNaN(numValue!) ? undefined : numValue
    });
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          검색 필터
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* 지역 선택 */}
        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm font-medium">
            지역
          </Label>
          <Select
            value={filters.region || '전체'}
            onValueChange={(value) => handleFilterChange('region', value)}
          >
            <SelectTrigger id="region" className="w-full">
              <SelectValue placeholder="지역을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 용도지역 선택 */}
        <div className="space-y-2">
          <Label htmlFor="landUseType" className="text-sm font-medium">
            용도지역
          </Label>
          <Select
            value={filters.landUseType || '전체'}
            onValueChange={(value) => handleFilterChange('landUseType', value)}
          >
            <SelectTrigger id="landUseType" className="w-full">
              <SelectValue placeholder="용도지역을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              {LAND_USE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 세부 용도지역 선택 */}
        <div className="space-y-2">
          <Label htmlFor="detailedLandUseType" className="text-sm font-medium">
            세부 용도지역
          </Label>
          <Select
            value={filters.detailedLandUseType || '전체'}
            onValueChange={(value) => handleFilterChange('detailedLandUseType', value)}
          >
            <SelectTrigger id="detailedLandUseType" className="w-full">
              <SelectValue placeholder="세부 용도지역을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              {DETAILED_LAND_USE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 건폐율 범위 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">건폐율 범위 (%)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minBuildingRatio" className="text-xs text-gray-500">
                최소
              </Label>
              <Input
                id="minBuildingRatio"
                type="number"
                placeholder="0"
                value={filters.minBuildingRatio || ''}
                onChange={(e) => handleNumberChange('minBuildingRatio', e.target.value)}
                className="text-sm h-9"
              />
            </div>
            <div>
              <Label htmlFor="maxBuildingRatio" className="text-xs text-gray-500">
                최대
              </Label>
              <Input
                id="maxBuildingRatio"
                type="number"
                placeholder="100"
                value={filters.maxBuildingRatio || ''}
                onChange={(e) => handleNumberChange('maxBuildingRatio', e.target.value)}
                className="text-sm h-9"
              />
            </div>
          </div>
        </div>

        {/* 용적률 범위 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">용적률 범위 (%)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minFloorAreaRatio" className="text-xs text-gray-500">
                최소
              </Label>
              <Input
                id="minFloorAreaRatio"
                type="number"
                placeholder="0"
                value={filters.minFloorAreaRatio || ''}
                onChange={(e) => handleNumberChange('minFloorAreaRatio', e.target.value)}
                className="text-sm h-9"
              />
            </div>
            <div>
              <Label htmlFor="maxFloorAreaRatio" className="text-xs text-gray-500">
                최대
              </Label>
              <Input
                id="maxFloorAreaRatio"
                type="number"
                placeholder="1500"
                value={filters.maxFloorAreaRatio || ''}
                onChange={(e) => handleNumberChange('maxFloorAreaRatio', e.target.value)}
                className="text-sm h-9"
              />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={onSearch} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 h-9"
            size="sm"
          >
            <Search className="w-4 h-4 mr-1" />
            검색
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="flex-1 h-9"
            size="sm"
          >
            <X className="w-4 h-4 mr-1" />
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
