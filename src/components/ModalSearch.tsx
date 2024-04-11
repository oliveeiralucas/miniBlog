import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode, useState } from 'react'
import { BiSearch, BiX } from 'react-icons/bi'

interface ModalProps {
  name: string
  children: ReactNode
  onClose?: () => void
}

const ModalSearch: React.FC<ModalProps> = ({ name, children, onClose }) => {
  const [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl items-center justify-center overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* Título do modal com ícone BiCalendar e botão de fechar */}
                  <Dialog.Title
                    as="h3"
                    className="pb-2 text-center text-lg font-medium leading-6 text-black"
                  >
                    {/* Ícone BiCalendar ao lado do título */}
                    <BiSearch className="float-left mr-2 inline-block align-middle text-3xl text-blue-700" />
                    {/* Nome do modal */}
                    {name}
                    {/* Botão de fechar com ícone BiX */}
                    <button className="float-right" onClick={closeModal}>
                      <BiX
                        className="text-2xl text-blue-700"
                        onClick={onClose}
                      />
                    </button>
                  </Dialog.Title>
                  {/* Linha horizontal para separar o título do corpo do modal */}
                  <hr className="my-4"></hr>
                  {/* Corpo do modal */}
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ModalSearch
