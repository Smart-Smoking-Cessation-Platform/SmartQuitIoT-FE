"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, Typography, Form, Input, Button, Alert } from "antd"
import { loginSchema, type LoginForm } from "@/types/forms"

interface LoginFormProps {
  onSubmit: (data: LoginForm) => Promise<void>
  isLoading?: boolean
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const handleFormSubmit = async (data: LoginForm) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <div className="p-6">
        <Typography.Title level={3} className="!mb-1 !text-gray-800">
          Welcome back
        </Typography.Title>
        <Typography.Paragraph className="!mb-5 !text-gray-600">
          Enter your credentials to access your account
        </Typography.Paragraph>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Form layout="vertical">
            <Form.Item
              label="Email"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={errors.password ? "error" : ""}
              help={errors.password?.message}
            >
              <Input.Password
                id="password"
                placeholder="Enter your password"
                {...register("password")}
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </Form>
        </form>
      </div>
    </Card>
  )
}
