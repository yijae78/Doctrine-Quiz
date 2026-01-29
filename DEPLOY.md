# Git 업로드 및 Vercel 배포 가이드

## 1단계: Git 저장소 초기화 및 업로드

### Git 초기화 (처음 한 번만)
```bash
git init
```

### 파일 추가 및 커밋
```bash
git add .
git commit -m "Initial commit: 드림아동부 조직신학 앱"
```

### GitHub 저장소 생성 및 연결
1. GitHub에서 새 저장소(repository)를 생성하세요
2. 아래 명령어로 원격 저장소를 연결하세요:
```bash
git remote add origin https://github.com/사용자명/저장소명.git
```

### 코드 업로드
```bash
git branch -M main
git push -u origin main
```

## 2단계: Vercel 배포

### 방법 1: Vercel 웹사이트를 통한 배포 (추천)

1. **Vercel 로그인**
   - https://vercel.com 에서 GitHub 계정으로 로그인

2. **프로젝트 가져오기**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 선택
   - "Import" 클릭

3. **빌드 설정 확인**
   - Framework Preset: Vite (자동 감지됨)
   - Build Command: `npm run build` (자동 설정됨)
   - Output Directory: `dist` (자동 설정됨)
   - Install Command: `npm install` (자동 설정됨)

4. **환경 변수 설정 (필요한 경우)**
   - Environment Variables 섹션에서
   - `GEMINI_API_KEY` 추가 (필요한 경우)

5. **배포**
   - "Deploy" 버튼 클릭
   - 배포가 완료되면 자동으로 URL이 생성됩니다!

### 방법 2: Vercel CLI를 통한 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 중요 사항

- ✅ `.env.local` 파일은 Git에 업로드되지 않습니다 (보안)
- ✅ Vercel에서는 환경 변수를 대시보드에서 설정하세요
- ✅ 코드를 푸시할 때마다 자동으로 재배포됩니다 (GitHub 연동 시)

## 문제 해결

### 빌드 오류가 발생하는 경우
- Vercel 대시보드의 "Deployments" 탭에서 로그 확인
- 로컬에서 `npm run build` 명령어로 빌드 테스트

### 환경 변수 오류
- Vercel 프로젝트 설정 → Environment Variables에서 확인
- 변수 이름과 값이 정확한지 확인
