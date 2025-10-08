/**
 * 건폐율/용적률 현황 데이터 타입 정의
 */

// 지역 타입
export type Region = 
  | '서울특별시'
  | '부산광역시'
  | '대구광역시'
  | '인천광역시'
  | '광주광역시'
  | '대전광역시'
  | '울산광역시'
  | '세종특별자치시'
  | '경기도'
  | '강원특별자치도'
  | '충청북도'
  | '충청남도'
  | '전북특별자치도'
  | '전라남도'
  | '경상북도'
  | '경상남도'
  | '제주특별자치도';

// 용도지역 타입
export type LandUseType = 
  | '전용주거지역'
  | '일반주거지역'
  | '준주거지역'
  | '상업지역'
  | '공업지역'
  | '녹지지역'
  | '관리지역'
  | '농림지역'
  | '자연환경보전지역';

// 세부 용도지역 타입
export type DetailedLandUseType = 
  | '제1종전용주거'
  | '제2종전용주거'
  | '제1종일반주거'
  | '제2종일반주거'
  | '제3종일반주거'
  | '준주거'
  | '중심상업'
  | '일반상업'
  | '근린상업'
  | '유통상업'
  | '전용공업'
  | '일반공업'
  | '준공업'
  | '보전녹지'
  | '생산녹지'
  | '자연녹지'
  | '보전관리'
  | '생산관리'
  | '계획관리'
  | '농림'
  | '자연환경보전';

// 건폐율/용적률 데이터
export interface BuildingRatio {
  건폐율: number;
  용적률: number;
}

// 세부 용도지역별 건폐율/용적률
export interface DetailedBuildingRatio {
  [key: string]: BuildingRatio;
}

// 도시별 건폐율/용적률 현황
export interface CityBuildingData {
  도시명: string;
  시도: Region;
  전용주거지역: {
    제1종전용주거: BuildingRatio;
    제2종전용주거: BuildingRatio;
  };
  일반주거지역: {
    제1종일반주거: BuildingRatio;
    제2종일반주거: BuildingRatio;
    제3종일반주거: BuildingRatio;
  };
  준주거지역: {
    준주거: BuildingRatio;
  };
  상업지역: {
    중심상업: BuildingRatio;
    일반상업: BuildingRatio;
    근린상업: BuildingRatio;
    유통상업: BuildingRatio;
  };
  공업지역: {
    전용공업: BuildingRatio;
    일반공업: BuildingRatio;
    준공업: BuildingRatio;
  };
  녹지지역: {
    보전녹지: BuildingRatio;
    생산녹지: BuildingRatio;
    자연녹지: BuildingRatio;
  };
  관리지역: {
    보전관리: BuildingRatio;
    생산관리: BuildingRatio;
    계획관리: BuildingRatio;
  };
  농림지역: {
    농림: BuildingRatio;
  };
  자연환경보전지역: {
    자연환경보전: BuildingRatio;
  };
}

// 검색 필터 타입
export interface SearchFilter {
  region?: Region;
  landUseType?: LandUseType;
  detailedLandUseType?: DetailedLandUseType;
  minBuildingRatio?: number;
  maxBuildingRatio?: number;
  minFloorAreaRatio?: number;
  maxFloorAreaRatio?: number;
}

// 검색 결과 타입
export interface SearchResult {
  city: string;
  region: Region;
  landUseType: LandUseType;
  detailedLandUseType: DetailedLandUseType;
  buildingRatio: number;
  floorAreaRatio: number;
}

// 통계 데이터 타입
export interface StatisticsData {
  totalCities: number;
  averageBuildingRatio: number;
  averageFloorAreaRatio: number;
  maxBuildingRatio: number;
  maxFloorAreaRatio: number;
  minBuildingRatio: number;
  minFloorAreaRatio: number;
}
