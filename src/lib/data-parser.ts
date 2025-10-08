/**
 * CSV 데이터 파싱 및 변환 유틸리티
 */

import { CityBuildingData, Region, BuildingRatio, SearchResult, StatisticsData } from '@/types/building';

// 실제 CSV 데이터를 사용하기 위해 별도 파일에서 로드
// 이 부분은 실제 CSV 파일을 읽어오는 로직으로 대체됩니다.

/**
 * CSV 문자열을 파싱하여 2차원 배열로 변환
 */
function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  });
}

/**
 * 도시명으로부터 시도 추출
 */
function extractRegion(cityName: string): Region {
  if (cityName.includes('서울')) return '서울특별시';
  if (cityName.includes('부산')) return '부산광역시';
  if (cityName.includes('대구')) return '대구광역시';
  if (cityName.includes('인천')) return '인천광역시';
  if (cityName.includes('광주')) return '광주광역시';
  if (cityName.includes('대전')) return '대전광역시';
  if (cityName.includes('울산')) return '울산광역시';
  if (cityName.includes('세종')) return '세종특별자치시';
  if (cityName.includes('경기')) return '경기도';
  if (cityName.includes('강원')) return '강원특별자치도';
  if (cityName.includes('충북')) return '충청북도';
  if (cityName.includes('충남')) return '충청남도';
  if (cityName.includes('전북')) return '전북특별자치도';
  if (cityName.includes('전남')) return '전라남도';
  if (cityName.includes('경북')) return '경상북도';
  if (cityName.includes('경남')) return '경상남도';
  if (cityName.includes('제주')) return '제주특별자치도';
  
  // 기본값으로 경기도 반환
  return '경기도';
}

/**
 * 숫자 문자열을 숫자로 변환 (0이거나 빈 문자열인 경우 0 반환)
 */
function parseNumber(value: string): number {
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * 건폐율/용적률 객체 생성
 */
function createBuildingRatio(buildingRatio: string, floorAreaRatio: string): BuildingRatio {
  return {
    건폐율: parseNumber(buildingRatio),
    용적률: parseNumber(floorAreaRatio)
  };
}

/**
 * CSV 데이터를 파싱하여 CityBuildingData 배열로 변환
 */
export async function parseBuildingData(): Promise<CityBuildingData[]> {
  try {
    // CSV 파일을 fetch로 로드
    const response = await fetch('/building-data.csv');
    const csvText = await response.text();
    const csvData = parseCSV(csvText);
    const result: CityBuildingData[] = [];
    
    // 헤더 행들을 건너뛰고 데이터 행부터 처리 (5행부터)
    for (let i = 5; i < csvData.length; i++) {
      const row = csvData[i];
      if (row.length < 42 || !row[0] || row[0].trim() === '') continue;
      
      const cityName = row[0].trim();
      if (cityName === '도시명' || cityName.includes('도') || cityName === '') continue;
      
      const region = extractRegion(cityName);
      
      const cityData: CityBuildingData = {
        도시명: cityName,
        시도: region,
        전용주거지역: {
          제1종전용주거: createBuildingRatio(row[1], row[2]),
          제2종전용주거: createBuildingRatio(row[3], row[4])
        },
        일반주거지역: {
          제1종일반주거: createBuildingRatio(row[5], row[6]),
          제2종일반주거: createBuildingRatio(row[7], row[8]),
          제3종일반주거: createBuildingRatio(row[9], row[10])
        },
        준주거지역: {
          준주거: createBuildingRatio(row[11], row[12])
        },
        상업지역: {
          중심상업: createBuildingRatio(row[13], row[14]),
          일반상업: createBuildingRatio(row[15], row[16]),
          근린상업: createBuildingRatio(row[17], row[18]),
          유통상업: createBuildingRatio(row[19], row[20])
        },
        공업지역: {
          전용공업: createBuildingRatio(row[21], row[22]),
          일반공업: createBuildingRatio(row[23], row[24]),
          준공업: createBuildingRatio(row[25], row[26])
        },
        녹지지역: {
          보전녹지: createBuildingRatio(row[27], row[28]),
          생산녹지: createBuildingRatio(row[29], row[30]),
          자연녹지: createBuildingRatio(row[31], row[32])
        },
        관리지역: {
          보전관리: createBuildingRatio(row[33], row[34]),
          생산관리: createBuildingRatio(row[35], row[36]),
          계획관리: createBuildingRatio(row[37], row[38])
        },
        농림지역: {
          농림: createBuildingRatio(row[39], row[40])
        },
        자연환경보전지역: {
          자연환경보전: createBuildingRatio(row[41], row[42] || '0')
        }
      };
      
      result.push(cityData);
    }
    
    return result;
  } catch (error) {
    console.error('CSV 데이터 로드 중 오류 발생:', error);
    return [];
  }
}

/**
 * 건폐율/용적률 데이터를 검색 결과 형태로 변환
 */
export function convertToSearchResults(data: CityBuildingData[]): SearchResult[] {
  const results: SearchResult[] = [];
  
  data.forEach(city => {
    // 전용주거지역
    Object.entries(city.전용주거지역).forEach(([type, ratio]) => {
      if (ratio.건폐율 > 0 || ratio.용적률 > 0) {
        results.push({
          city: city.도시명,
          region: city.시도,
          landUseType: '전용주거지역',
          detailedLandUseType: type as any,
          buildingRatio: ratio.건폐율,
          floorAreaRatio: ratio.용적률
        });
      }
    });
    
    // 일반주거지역
    Object.entries(city.일반주거지역).forEach(([type, ratio]) => {
      if (ratio.건폐율 > 0 || ratio.용적률 > 0) {
        results.push({
          city: city.도시명,
          region: city.시도,
          landUseType: '일반주거지역',
          detailedLandUseType: type as any,
          buildingRatio: ratio.건폐율,
          floorAreaRatio: ratio.용적률
        });
      }
    });
    
    // 준주거지역
    if (city.준주거지역.준주거.건폐율 > 0 || city.준주거지역.준주거.용적률 > 0) {
      results.push({
        city: city.도시명,
        region: city.시도,
        landUseType: '준주거지역',
        detailedLandUseType: '준주거',
        buildingRatio: city.준주거지역.준주거.건폐율,
        floorAreaRatio: city.준주거지역.준주거.용적률
      });
    }
    
    // 상업지역
    Object.entries(city.상업지역).forEach(([type, ratio]) => {
      if (ratio.건폐율 > 0 || ratio.용적률 > 0) {
        results.push({
          city: city.도시명,
          region: city.시도,
          landUseType: '상업지역',
          detailedLandUseType: type as any,
          buildingRatio: ratio.건폐율,
          floorAreaRatio: ratio.용적률
        });
      }
    });
    
    // 공업지역
    Object.entries(city.공업지역).forEach(([type, ratio]) => {
      if (ratio.건폐율 > 0 || ratio.용적률 > 0) {
        results.push({
          city: city.도시명,
          region: city.시도,
          landUseType: '공업지역',
          detailedLandUseType: type as any,
          buildingRatio: ratio.건폐율,
          floorAreaRatio: ratio.용적률
        });
      }
    });
    
    // 녹지지역
    Object.entries(city.녹지지역).forEach(([type, ratio]) => {
      if (ratio.건폐율 > 0 || ratio.용적률 > 0) {
        results.push({
          city: city.도시명,
          region: city.시도,
          landUseType: '녹지지역',
          detailedLandUseType: type as any,
          buildingRatio: ratio.건폐율,
          floorAreaRatio: ratio.용적률
        });
      }
    });
    
    // 관리지역
    Object.entries(city.관리지역).forEach(([type, ratio]) => {
      if (ratio.건폐율 > 0 || ratio.용적률 > 0) {
        results.push({
          city: city.도시명,
          region: city.시도,
          landUseType: '관리지역',
          detailedLandUseType: type as any,
          buildingRatio: ratio.건폐율,
          floorAreaRatio: ratio.용적률
        });
      }
    });
    
    // 농림지역
    if (city.농림지역.농림.건폐율 > 0 || city.농림지역.농림.용적률 > 0) {
      results.push({
        city: city.도시명,
        region: city.시도,
        landUseType: '농림지역',
        detailedLandUseType: '농림',
        buildingRatio: city.농림지역.농림.건폐율,
        floorAreaRatio: city.농림지역.농림.용적률
      });
    }
    
    // 자연환경보전지역
    if (city.자연환경보전지역.자연환경보전.건폐율 > 0 || city.자연환경보전지역.자연환경보전.용적률 > 0) {
      results.push({
        city: city.도시명,
        region: city.시도,
        landUseType: '자연환경보전지역',
        detailedLandUseType: '자연환경보전',
        buildingRatio: city.자연환경보전지역.자연환경보전.건폐율,
        floorAreaRatio: city.자연환경보전지역.자연환경보전.용적률
      });
    }
  });
  
  return results;
}

/**
 * 통계 데이터 계산
 */
export function calculateStatistics(data: SearchResult[]): StatisticsData {
  const validData = data.filter(d => d.buildingRatio > 0 || d.floorAreaRatio > 0);
  const cities = new Set(validData.map(d => d.city));
  
  const buildingRatios = validData.map(d => d.buildingRatio).filter(r => r > 0);
  const floorAreaRatios = validData.map(d => d.floorAreaRatio).filter(r => r > 0);
  
  return {
    totalCities: cities.size,
    averageBuildingRatio: buildingRatios.length > 0 ? 
      Math.round(buildingRatios.reduce((a, b) => a + b, 0) / buildingRatios.length * 100) / 100 : 0,
    averageFloorAreaRatio: floorAreaRatios.length > 0 ? 
      Math.round(floorAreaRatios.reduce((a, b) => a + b, 0) / floorAreaRatios.length * 100) / 100 : 0,
    maxBuildingRatio: buildingRatios.length > 0 ? Math.max(...buildingRatios) : 0,
    maxFloorAreaRatio: floorAreaRatios.length > 0 ? Math.max(...floorAreaRatios) : 0,
    minBuildingRatio: buildingRatios.length > 0 ? Math.min(...buildingRatios) : 0,
    minFloorAreaRatio: floorAreaRatios.length > 0 ? Math.min(...floorAreaRatios) : 0
  };
}
