# Supabase 설정 가이드

이 문서는 프로젝트에 Supabase를 연동하고 타입을 자동 생성하는 방법을 설명합니다.

## 📋 목차

1. [환경변수 설정](#1-환경변수-설정)
2. [Supabase CLI 설치](#2-supabase-cli-설치)
3. [타입 자동 생성 스크립트 설정](#3-타입-자동-생성-스크립트-설정)
4. [Supabase Client 초기화](#4-supabase-client-초기화)
5. [Entity 타입 정의](#5-entity-타입-정의)

---

## 1. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Supabase 프로젝트 정보를 추가합니다.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
PROJECT_REF=your-project-ref
```

> 💡 **Supabase 대시보드**에서 확인 가능:
>
> - Project Settings > API > Project URL
> - Project Settings > API > Project API keys (anon/public)
> - Project Settings > General > Reference ID

---

## 2. Supabase CLI 설치

Supabase CLI를 개발 의존성으로 설치하고 초기화합니다.

```bash
npm i supabase@">1.8.1" --save-dev
npx supabase init
```

실행하면 프로젝트 루트에 `supabase/` 폴더가 생성됩니다.

---

## 3. 타입 자동 생성 스크립트 설정

`package.json`의 `scripts` 섹션에 타입 생성 명령어를 추가합니다.

```json
{
  "scripts": {
    "type-gen": "npx supabase gen types typescript --project-id \"$PROJECT_REF\" --schema public > src/database.types.ts"
  }
}
```

### 사용법

데이터베이스 스키마가 변경될 때마다 다음 명령어를 실행하여 타입을 재생성합니다:

```bash
npm run type-gen
```

> ⚠️ **주의**: `src/database.types.ts`는 자동 생성 파일이므로 **직접 수정하지 마세요**.

### 참고 문서

- [Supabase - Generating TypeScript Types](https://supabase.com/docs/guides/api/rest/generating-types)

---

## 4. Supabase Client 초기화

`src/utils/supabase.ts` 파일을 생성하고 타입이 주입된 Supabase Client를 초기화합니다.

```typescript
import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
```

### 타입 주입의 이점

- 자동완성 지원
- 테이블명, 컬럼명 오타 방지
- 쿼리 결과 타입 추론

---

## 5. Entity 타입 정의

`src/types.ts`에서 `database.types.ts`의 타입을 가공하여 사용하기 편한 형태로 정제합니다.

```typescript
import { type Database } from "@/database.types";

// Entity 타입 추출 (DB 테이블 직접 매핑)
export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];
export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

// 확장 타입 정의 (Entity + 추가 필드, 조인 결과 등)
export type Post = PostEntity & {
  author: ProfileEntity;
  isLiked: boolean;
  likeCount: number;
};
```

### 네이밍 규칙

- **Entity 타입**: `[Feature]Entity` - DB 테이블과 1:1 매핑
- **확장 타입**: `[Feature]` - 비즈니스 로직에서 사용하는 타입

---

## ✅ 설정 완료 체크리스트

- [ ] `.env` 파일에 Supabase 환경변수 추가
- [ ] Supabase CLI 설치 및 초기화
- [ ] `package.json`에 `type-gen` 스크립트 추가
- [ ] `npm run type-gen` 실행하여 `database.types.ts` 생성
- [ ] `src/utils/supabase.ts`에 타입이 주입된 Client 생성
- [ ] `src/types.ts`에 Entity 타입 정의

---

## 🔄 개발 워크플로우

1. Supabase 대시보드에서 테이블 스키마 수정
2. 터미널에서 `npm run type-gen` 실행
3. `src/types.ts`에 필요한 Entity 타입 추가
4. API 함수 및 컴포넌트에서 타입 활용
