"use client";
import { useState } from "react";

interface TabProps {
  tabs: { id: string; label: string }[];
  tabContent: { id: string; content: React.ReactNode }[];
}

function Tab({ tabs, tabContent }: TabProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <>
      <div className="mb-4 border-b border-gray-200 ">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          {tabs.map((tab) => (
            <li key={tab.id} className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === tab.id ? "border-blue-500 text-blue-500" : "hover:text-gray-600 hover:border-gray-300 "
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                role="tab"
                aria-controls={tab.id}
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="tab-content">
        {tabContent.map((content) => (
          <div
            key={content.id}
            className={`p-4  ${
              activeTab === content.id ? "block" : "hidden"
            }`}
            id={content.id}
            role="tabpanel"
            aria-labelledby={`${content.id}-tab`}
          >
            {content.content}
          </div>
        ))}
      </div>
    </>
  );
}

export default Tab;
