"use client"

import AnswerCard from "./AnswerCard"

const AnswerGrid = ({ results }: any) => {
  if (results.length === 0) return null

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {results.map((res: any) => (
        <AnswerCard key={res.title} result={res} />
      ))}
    </section>
  )
}

export default AnswerGrid
