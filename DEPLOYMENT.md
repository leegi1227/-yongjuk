# 🚀 배포 가이드

이 문서는 건폐율/용적률 현황 조회 시스템을 배포하는 방법을 설명합니다.

## 📋 배포 전 준비사항

### 1. 프로젝트 빌드 테스트
```bash
cd yongjuk
npm install
npm run build
```

빌드가 성공하면 `out` 폴더가 생성됩니다.

### 2. 로컬에서 정적 파일 테스트
```bash
# 정적 파일 서버 실행 (Python 3)
cd out
python -m http.server 8000

# 또는 Node.js serve 사용
npx serve out
```

## 🌐 배포 방법

### 방법 1: Vercel (가장 추천) ⭐

**장점:**
- Next.js 최적화
- 무료 (개인 프로젝트)
- 자동 HTTPS
- 자동 배포

**단계:**
1. [vercel.com](https://vercel.com)에 가입
2. GitHub에 프로젝트 업로드
3. Vercel에서 "New Project" 클릭
4. GitHub 저장소 선택
5. 자동 설정 확인 후 "Deploy" 클릭

**설정:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `out`
- Install Command: `npm install`

### 방법 2: Netlify

**장점:**
- 무료
- 간단한 설정
- 폼 처리 기능

**단계:**
1. [netlify.com](https://netlify.com)에 가입
2. GitHub에 프로젝트 업로드
3. Netlify에서 "New site from Git" 클릭
4. GitHub 저장소 선택
5. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `out`

### 방법 3: GitHub Pages

**장점:**
- 완전 무료
- GitHub과 통합

**단계:**
1. GitHub에 프로젝트 업로드
2. `.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: yongjuk/package-lock.json
        
    - name: Install dependencies
      run: |
        cd yongjuk
        npm ci
        
    - name: Build
      run: |
        cd yongjuk
        npm run build
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: yongjuk/out
```

3. GitHub Pages 설정에서 `gh-pages` 브랜치 선택

### 방법 4: Firebase Hosting

**장점:**
- Google 인프라
- 빠른 속도
- 무료 할당량

**단계:**
1. Firebase CLI 설치: `npm install -g firebase-tools`
2. Firebase 프로젝트 생성
3. Firebase 초기화: `firebase init hosting`
4. 빌드 및 배포: `npm run build && firebase deploy`

## 🔧 배포 후 확인사항

### 1. 기능 테스트
- [ ] 메인 페이지 로딩
- [ ] 검색 기능 동작
- [ ] 통계 정보 표시
- [ ] 모바일 반응형 확인

### 2. 성능 확인
- [ ] 페이지 로딩 속도
- [ ] 이미지 최적화
- [ ] CSS/JS 번들 크기

### 3. SEO 최적화
- [ ] 메타 태그 설정
- [ ] 사이트맵 생성
- [ ] robots.txt 설정

## 🐛 문제 해결

### 빌드 오류
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 클리어
npm run build -- --no-cache
```

### 배포 후 404 오류
- `next.config.ts`에서 `trailingSlash: true` 확인
- 정적 파일 경로 확인

### 이미지 로딩 오류
- `next.config.ts`에서 `images.unoptimized: true` 확인
- 이미지 파일 경로 확인

## 📞 지원

배포 관련 문제가 있으면 이슈를 생성해주세요.

## 🔄 업데이트 배포

코드 변경 후:
1. GitHub에 푸시
2. 자동 배포 확인 (Vercel/Netlify)
3. 또는 수동 배포 실행

---

**추천 배포 순서:**
1. Vercel (가장 간단)
2. Netlify (대안)
3. GitHub Pages (무료)
4. Firebase Hosting (고급)
