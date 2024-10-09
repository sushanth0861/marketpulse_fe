"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog"
import { ScrollArea } from "./scroll-area"
import { Button } from "./button"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const infoContent = [
    {
      title: "Market Sector Data",
      description: "Data is fetched from finnhub.io and represents major market sectors. It provides a quick overview of how different sectors are performing."
    },
    {
      title: "ML Techniques",
      description: "I've utilized Natural Language Processing (NLP) models like BART for summarization and sentiment analysis. These models help us extract meaningful insights from large volumes of financial news and reports fetched from Alpha Vantage."
    },
    {
      title: "Market Mood Gauge",
      description: "This gauge is generated using a sentiment score derived from our ML analysis. It ranges from Bearish to Bullish, giving you a quick visual representation of the overall market sentiment."
    },
    {
      title: "Analyzed Articles",
      description: "This continuously analyzes recent financial articles for sentiment and summarize them based on current market trends. This provides you with a snapshot of the latest market news and their potential impact."
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">About This Dashboard</DialogTitle>
          <DialogDescription className="text-gray-400">
            Understand the key components of this market mood index dashboard
          </DialogDescription>
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={onClose}
          > */}
            {/* <X className="h-4 w-4" /> */}
            {/* <span className="sr-only">Close</span> */}
          {/* </Button> */}
        </DialogHeader>
        <ScrollArea className="mt-6 max-h-[60vh] pr-4">
          <div className="space-y-6">
            {infoContent.map((item, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-6">
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}