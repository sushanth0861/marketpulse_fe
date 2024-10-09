"use client"

import { useEffect, useRef, useState } from "react"

interface AutoScrollingArticlesProps {
  articles: [string, number, string][] // Array of [url, score, sentiment]
}

export default function AutoScrollingArticles({ articles }: AutoScrollingArticlesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      let animationFrameId: number

      const scroll = () => {
        if (!isHovering && scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollContainer.scrollTop += 0.5
        } else if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollContainer.scrollTop = 0
        }
        animationFrameId = requestAnimationFrame(scroll)
      }

      animationFrameId = requestAnimationFrame(scroll)

      return () => cancelAnimationFrame(animationFrameId)
    }
  }, [articles, isHovering])

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Analyzed Articles</h3>
      <div 
        ref={scrollContainerRef}
        className="scrollable-content h-[60vh] lg:h-[80vh] overflow-y-auto pr-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="scrollable-content-inner space-y-2">
          {articles.map(([url, score, sentiment], index) => (
            <div
              key={index}
              className="bg-gray-800 p-2 rounded flex items-center space-x-2 hover:bg-gray-700 transition-colors text-xs"
            >
              <a
                href={url}
                className="text-blue-400 hover:text-blue-300 underline truncate flex-grow"
                target="_blank"
                rel="noopener noreferrer"
                title={url}
              >
                {url}
              </a>
              <span 
                className={`font-semibold whitespace-nowrap ${
                  score >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {score.toFixed(2)}
              </span>
              <span className="font-semibold whitespace-nowrap">{sentiment}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}