import { PencilRuler, Timer } from "lucide-react"

const Messages = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col">
        <h3 className="text-4xl font-serif text-white">Soon to be created</h3>
        <div className="flex gap-3 items-center justify-center mt-3">
            <Timer color="white"/>
            <PencilRuler color="white"/>
        </div>
      </div>
    </div>
  )
}

export default Messages
