import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionProps {
  title: string;
  content: string;
}

const Section: React.FC<SectionProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 bg-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      )}
    </div>
  );
};

const MicromobilityReport: React.FC = () => {
  const sections = [
    {
      title: "About E-scooters in Karlskrona",
      content: "E-scooters arrived in Karlskrona recently, with multiple providers entering the market. We're working to ensure they integrate well with our city's transportation system."
    },
    {
      title: "Usage Insights",
      content: "E-scooters are most popular in central areas. Usage varies throughout the year, with peak times during summer months. On average, each scooter is used for about 15-20 minutes per day."
    },
    {
      title: "City Regulations",
      content: "Karlskrona has implemented speed limitation zones in pedestrian-heavy areas, designated parking spots, and no-parking zones in certain areas to ensure safety and order."
    },
    {
      title: "Data and Privacy",
      content: "We use anonymized data to improve e-scooter services while protecting user privacy. This helps us make informed decisions about regulations and infrastructure."
    },
    {
      title: "Safety Tips",
      content: "Always wear a helmet, follow traffic rules, and park responsibly. Be aware of pedestrians and don't ride under the influence of alcohol."
    },
    {
      title: "Future Plans",
      content: "We're working on expanding dedicated parking areas and improving integration with public transport to make e-scooters a more effective part of Karlskrona's mobility ecosystem."
    }
  ];

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Karlskrona E-Scooter Guide</h1>
      {sections.map((section, index) => (
        <Section key={index} title={section.title} content={section.content} />
      ))}
    </div>
  );
};

export default MicromobilityReport;

