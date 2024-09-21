// app/reset-password/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password | Roomio',
  description: "Room with a view, wherever you go.",
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}