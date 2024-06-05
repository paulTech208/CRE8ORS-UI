import React, { ReactNode } from 'react'
import { useTheme } from '../providers/ThemeProvider'
import Icon from './Icon'

interface IModal {
  id: string
  onClose: () => any
  showCloseButton?: boolean
  children: ReactNode
  isVisible: Boolean
  containerClassName?: string
  closeButtonClassName?: string
  modalClassName?: string
}

function Modal({
  id,
  onClose,
  showCloseButton,
  children,
  isVisible,
  modalClassName,
  containerClassName,
  closeButtonClassName
}: IModal) {
  const { themeMode } = useTheme()
  
  return (
    <div
      className={`fade_modal
        fixed top-0 left-0 w-screen h-screen items-center justify-center z-40
        xl:pt-0 pt-[80px]
        ${isVisible ? 'flex' : 'hidden'}
        ${modalClassName || ""}
      `}
      onClick={async e =>
        (e.target === e.currentTarget && onClose) ? await onClose() : () => {}
      }
    >
        
      <div className={`mt-[50px] bg-white rounded-lg relative ${containerClassName || ""}`}>
        {showCloseButton && (
          <div
              className={`bg-white dark:bg-[black] absolute 
              top-[5px] right-[5px] xl:top-[15px] xl:right-[15px] 
              w-6 h-6 rounded-full cursor-pointer
              dark:text-white text-black
              flex justify-center items-center z-[5] ${closeButtonClassName || ""}`}
              onClick={onClose}
          >
           <Icon name='close' raw size={15}/>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal