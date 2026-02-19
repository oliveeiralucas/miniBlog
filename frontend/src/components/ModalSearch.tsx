import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import React, { ReactNode, useState } from 'react'
import { BiX } from 'react-icons/bi'

interface ModalProps {
  children: ReactNode
  onClose?: () => void
}

const ModalSearch: React.FC<ModalProps> = ({ children, onClose }) => {
  const [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center pt-24 px-4">
            <TransitionChild
              enter="ease-out duration-200"
              enterFrom="opacity-0 -translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-4"
            >
              <DialogPanel className="w-full max-w-xl bg-ed-surface border border-ed-border rounded-sm shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-ed-border">
                  <span className="section-label">Pesquisar</span>
                  <button
                    onClick={closeModal}
                    className="p-1.5 text-ed-tm hover:text-ed-tp border border-transparent hover:border-ed-border rounded-sm transition-all duration-200"
                    aria-label="Fechar"
                  >
                    <BiX className="text-lg" />
                  </button>
                </div>
                <div className="px-5 py-5">{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalSearch
