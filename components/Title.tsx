import { ReactNode } from "react";
interface TitleProps {
  className?: string;
  children: ReactNode;
}

function Title({ children, className }: TitleProps) {
  return (
    <h3
      className={`text-center lg:text-4xl sm:text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl${className}`}
    >
      {children}
    </h3>
  );
}

export default Title;
