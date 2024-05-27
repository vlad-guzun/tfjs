import React from 'react'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { StartLoginDialog } from './StartLoginDialog'

const StartLoginModal = ({setShowModal,text}: {setShowModal: (value:boolean) => void,text: string}) => {
  return (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-100 ease-in">
          <div className="relative bg-black border border-white p-4 rounded shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]">
            <Button
              onClick={() => setShowModal(false)}
              className="text-white absolute top-2 right-0"
            >
              <X size={12} className='hover:text-red-700'/>
            </Button>
            <StartLoginDialog text={text}/>
          </div>
        </div>
  )
}

export default StartLoginModal
