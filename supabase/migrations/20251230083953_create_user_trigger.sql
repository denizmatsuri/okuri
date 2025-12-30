-- Migration: create_user_trigger
-- Description: 회원가입 시 auth.users → public.users 자동 생성 트리거
-- Created: 2024-12-30

-- =============================================
-- 새 사용자 생성 함수
-- =============================================
-- auth.users에 새 사용자가 생성되면 public.users 테이블에도 
-- 최소한의 정보(id, email)로 행을 생성합니다.
-- 나머지 프로필 정보는 온보딩 또는 설정 페이지에서 업데이트합니다.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- =============================================
-- 트리거 생성
-- =============================================
-- AFTER INSERT: 사용자 생성이 완료된 후 실행
-- FOR EACH ROW: 각 행마다 트리거 실행

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();