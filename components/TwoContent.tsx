import { ReactNode } from "react";

interface TwoContentProps {
  title: string;
  children: ReactNode;
}

function TwoContent({ title, children }: TwoContentProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 py-10 px-2 ">
      <div className="lg:h-32 sm:h-10 flex items-start  justify-start pl-20">
        <h1 className=" text-2xl font-semibold capitalize">
          {title}
        </h1>
      </div>
      <div
        className="lg:col-span-2 border-l-2 lg:pl-10 lg:pr-56 sm:p-2
      "
      >
        {children}
      </div>
    </div>
  );
}

export default TwoContent;
