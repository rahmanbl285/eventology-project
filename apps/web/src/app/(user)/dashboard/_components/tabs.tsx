interface Tab {
    key: string;
    label: string;
  }
  
  interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: Tab[];
  }
  
  export default function Tabs({ activeTab, setActiveTab, tabs }: TabsProps) {
    return (
      <div role="tablist" className="tabs tabs-lifted mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'tab-active' : ''} text-white [--tab-bg:#E50914] [--tab-border-color:#E50914]`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
  