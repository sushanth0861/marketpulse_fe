"use client";

import React, { useState, useEffect } from "react";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { Card, CardContent } from "@/app/components/card";

interface MarketMoodGaugeProps {
  value: number; // Value should be between -1 and 1
}

const getGaugeColor = (value: number) => {
  if (value <= -0.35) return "#FF0000"; // Red for Bearish
  if (value > -0.35 && value <= -0.15) return "#FFA500"; // Orange for Somewhat Bearish
  if (value > -0.15 && value < 0.15) return "#FFD700"; // Yellow for Neutral
  if (value >= 0.15 && value < 0.35) return "#ADFF2F"; // Light Green for Somewhat Bullish
  return "#008000"; // Green for Bullish
};

export default function MarketMoodGauge({ value }: MarketMoodGaugeProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const normalizedValue = (value + 1) / 2; // Convert -1 to 1 range to 0 to 1
  const gaugeColor = getGaugeColor(value);

  const gaugeData = [{ name: "Mood", value: normalizedValue, fill: gaugeColor }];
  if (!isClient) return null;
  return (
    <Card className="w-full max-w-4xl mx-auto flex flex-col items-center p-2">
      <h3 className="font-semibold text-xl mb-4">Know what’s the sentiment on Wall Street today</h3>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col justify-center items-center w-2/3">
          <CardContent className="flex justify-center items-center">
            <RadialBarChart
              width={isClient && window.innerWidth > 768 ? 500 : 300} // Adjust width based on screen size
              height={isClient && window.innerWidth > 768 ? 150 : 100} // Adjust height as well
              cx={isClient && window.innerWidth > 768 ? 250 : 150} 
              cy={isClient && window.innerWidth > 768 ? 120 : 80}
              innerRadius={isClient && window.innerWidth > 768 ? 100 : 70}
              outerRadius={isClient && window.innerWidth > 768 ? 140 : 100}
              barSize={20}
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 1]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={30} fill={gaugeColor} />
              <text
                x={250} // Adjust to center text
                y={120}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-4xl font-bold fill-primary"
              >
                {value.toFixed(2)}
              </text>
            </RadialBarChart>
          </CardContent>
        </div>

        {/* Sentiment Range Section - aligned to the right */}
        <div className="w-1/3 ml-4">
          <h3 className="font-semibold mb-2 text-center text-sm">Sentiment Ranges:</h3>
          <ul className="space-y-1 text-xs">
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
              Bearish: ≤ -0.35
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
              Somewhat Bearish: -0.35 to -0.15
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
              Neutral: -0.15 to 0.15
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-400 mr-1"></span>
              Somewhat Bullish: 0.15 to 0.35
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-600 mr-1"></span>
              Bullish: ≥ 0.35
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
