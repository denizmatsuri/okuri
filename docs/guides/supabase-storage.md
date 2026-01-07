# Supabase Storage 가이드

이 문서는 프로젝트의 Supabase Storage 버킷 구조와 사용 방법을 설명합니다.

## 📋 목차

1. [버킷 구조](#1-버킷-구조)
2. [경로 규칙](#2-경로-규칙)
3. [코드 사용법](#3-코드-사용법)
4. [버킷 설정](#4-버킷-설정)

---

## 1. 버킷 구조

프로젝트는 **단일 버킷**을 사용하며, 폴더 구조로 파일을 구분합니다.

### 버킷 이름

`okuri-storage`

### 폴더 구조

```
okuri-storage/
├── users/
│   └── {userId}/
│       ├── avatar/            # 프로필 이미지
│       ├── background/        # 배경 이미지 (미래)
│       └── attachments/       # 기타 첨부 (미래)
│
└── families/
    └── {familyId}/
        ├── cover/                   # 가족 대표 이미지
        │   └── cover.jpg
        ├── members/                 # 가족별 프로필
        │   └── {userId}/
        │       └── avatar.jpg
        ├── posts/                   # 게시글 이미지
        │   └── {postId}/
        │       └── 0.jpg
        └── gallery/                 # 갤러리 사진
            └── {albumId}/
                └── {imageId}.jpg
```

### 폴더별 용도

| 경로                                     | 용도                      | 접근 권한   |
| ---------------------------------------- | ------------------------- | ----------- |
| `users/{userId}/avatars/`                | 사용자 기본 프로필 이미지 | Public      |
| `families/{familyId}/cover/`             | 가족 그룹 대표 이미지     | 가족 멤버만 |
| `families/{familyId}/members/{userId}/`  | 가족별 프로필 아바타      | 가족 멤버만 |
| `families/{familyId}/posts/{postId}/`    | 게시글 첨부 이미지        | 가족 멤버만 |
| `families/{familyId}/gallery/{albumId}/` | 갤러리 앨범 사진          | 가족 멤버만 |

---

## 2. 경로 규칙

### 상수 정의 (`src/lib/constants.ts`)

```typescript
export const BUCKET_NAME = "okuri-storage";

export const STORAGE_PATHS = {
  userAvatar: (userId: string) => `users/${userId}/avatars`,
  familyCover: (familyId: string) => `families/${familyId}/cover`,
  familyMemberAvatar: (familyId: string, userId: string) =>
    `families/${familyId}/members/${userId}`,
  postImages: (familyId: string, postId: string) =>
    `families/${familyId}/posts/${postId}`,
  galleryAlbum: (familyId: string, albumId: string) =>
    `families/${familyId}/gallery/${albumId}`,
} as const;
```

### 파일명 규칙

| 유형          | 파일명 패턴                | 예시                                 |
| ------------- | -------------------------- | ------------------------------------ |
| 프로필 이미지 | `{timestamp}-{uuid}.{ext}` | `1704537600000-a1b2c3d4-e5f6-...jpg` |
| 가족 커버     | `{timestamp}-{uuid}.{ext}` | `1704537600000-b2c3d4e5-f6a7-...png` |
| 게시글 이미지 | `{timestamp}-{uuid}.{ext}` | `1704537600000-c3d4e5f6-a7b8-...jpg` |
| 갤러리 이미지 | `{timestamp}-{uuid}.{ext}` | `1704537600000-d4e5f6a7-b8c9-...jpg` |

> 💡 **장점**: 캐시 무효화, 충돌 방지, 시간순 정렬, 덮어쓰기 방지

---

### RLS 정책

#### Users 관련

```sql
-- SELECT (읽기)
CREATE POLICY "Anyone can view user avatars"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'users'
);

-- INSERT (업로드)
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'users'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- UPDATE (수정)
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'users'
  AND (storage.foldername(name))[2] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'users'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- DELETE (삭제)
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'users'
  AND (storage.foldername(name))[2] = auth.uid()::text
);
```

#### families 관련

---

## ✅ 설정 체크리스트

- [ ] Supabase 대시보드에서 `okuri-storage` 버킷 생성
- [ ] 파일 크기 제한 설정 (5MB 권장)
- [ ] 허용 MIME 타입 설정 (`image/*`)
- [ ] `src/lib/constants.ts`에 `BUCKET_NAME`, `STORAGE_PATHS` 추가
- [ ] RLS 정책 설정 (필요시)

---

## 🔄 개발 워크플로우

1. 버킷 생성 및 설정 (1회)
2. `STORAGE_PATHS` 헬퍼 함수로 경로 생성
3. `uploadImage()` / `deleteImagesInPath()` 함수 사용
4. RLS 정책으로 접근 권한 제어
