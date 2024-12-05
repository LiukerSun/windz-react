"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAuth } from "@/lib/auth";

interface FormErrors {
  organization_code?: string;
  username?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // 验证组织代码
    const organizationCode = formData.get("organization_code") as string;
    if (!organizationCode) {
      newErrors.organization_code = "请填写组织代号";
      isValid = false;
    }

    // 验证用户名
    const username = formData.get("username") as string;
    if (!username) {
      newErrors.username = "请填写用户名";
      isValid = false;
    }

    // 验证密码
    const password = formData.get("password") as string;
    if (!password) {
      newErrors.password = "请填写密码";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);

    // 表单验证
    if (!validateForm(formData)) {
      setLoading(false);
      return;
    }

    const requestBody = {
      organization_code: formData.get("organization_code"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      console.log('Sending login request:', requestBody);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('登录响应:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "登录失败");
      }

      // 保存认证信息
      setAuth(data);

      // 重定向到之前的页面或首页
      const from = searchParams.get("from") || "/";
      router.push(from);
      router.refresh();
    } catch (err) {
      console.error('登录错误:', err);
      setErrors({ organization_code: err instanceof Error ? err.message : "登录失败" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">登录</CardTitle>
        <CardDescription className="text-center">
          输入您的账号密码和组织代号来登录
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="organization_code">
                组织代号
              </Label>
              <Input
                id="organization_code"
                name="organization_code"
                placeholder="输入您的组织代号"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={loading}
                aria-describedby="organization-error"
              />
              {errors.organization_code && (
                <p className="text-sm text-red-500" id="organization-error">
                  {errors.organization_code}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                placeholder="输入您的用户名"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                disabled={loading}
                aria-describedby="username-error"
              />
              {errors.username && (
                <p className="text-sm text-red-500" id="username-error">
                  {errors.username}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                disabled={loading}
                aria-describedby="password-error"
              />
              {errors.password && (
                <p className="text-sm text-red-500" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>
            <Button className="w-full" disabled={loading}>
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
