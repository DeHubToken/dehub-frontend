"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Chat } from "./components/chat";

const tabs = [
  { label: "AI engagement", value: "ai" },
  { label: "Trend monitoring", value: "trend" },
  { label: "Finance management", value: "finance" }
];

export default function Page() {
  return (
    <>
      <div className="order-2 h-full flex-[50%] overflow-hidden rounded-3xl border border-neutral-800 p-4 xl:order-1">
        <Tabs defaultValue="trend" className="w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-400">Tools</h3>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="trend" className="mt-4">
            <div className="flex flex-col gap-8 rounded-3xl bg-neutral-800 p-6">
              <h2 className="text-base font-semibold text-neutral-400">Discover Trending Topics</h2>

              <div className="flex flex-col gap-2">
                {topics.map((topic) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between rounded-lg bg-neutral-700 p-4"
                  >
                    <span className="text-base text-neutral-200">{topic.name}</span>
                    <span className="text-base font-semibold text-green-400">{topic.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            <Accordion type="single" collapsible className="mt-3 rounded-3xl bg-neutral-800 p-6">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-base font-semibold text-gray-400">
                  Predict Post Performance
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-400">
                  See how your upcoming posts are predicted to perform based on historical data
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
      <Chat />
    </>
  );
}

const topics = [
  { name: "#FunnyCats", growth: "29%" },
  { name: "#Crypto", growth: "18%" },
  { name: "#Memes", growth: "12%" },
  { name: "#AI", growth: "9%" }
];
