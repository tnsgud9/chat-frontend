import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { decryptAES } from "@/commons/utils/crypto-helper";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useUserStore();

  const navigate = useNavigate();
  // useCallback은 함수를 메모이제이션하여, 의존성 배열에 나열된 값이 변경될 때만 함수를 재생성한다.
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault(); // 폼 제출 시 기본 동작인 페이지 새로고침을 방지

      // 로그인 API 호출, username과 password를 전달
      login(
        { username, password },
        ({ id, nickname, encryptedPrivateKey, publicKey }) => {
          setUserInfo({
            id,
            nickname,
            publicKey,
            privateKey: decryptAES(password, encryptedPrivateKey),
          });
          navigate("/chat");
        },
        ({ message }) => {
          alert(message);
        },
      );
    },
    // useCallback 훅의 의존성 배열, username과 password 값이 변경될 때마다 함수 재생성
    [username, password],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="email"
            placeholder="hello@world.com"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link to="/auth/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
