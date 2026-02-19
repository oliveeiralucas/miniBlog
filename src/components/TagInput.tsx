import React, { KeyboardEvent, useState } from 'react'
import { BiX } from 'react-icons/bi'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = 'Adicionar tag... (pressione Enter)',
}) => {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim().toLowerCase()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap gap-2 border border-ed-border rounded-sm p-2.5 bg-ed-elevated focus-within:border-ed-accent transition-colors duration-200 min-h-[46px]">
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-ed-ad text-ed-accent font-ui text-xs px-2 py-1 rounded-sm border border-ed-border"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-ed-tp transition-colors ml-0.5"
            aria-label={`Remover tag ${tag}`}
          >
            <BiX className="text-xs" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 bg-transparent text-ed-tp font-ui text-sm placeholder:text-ed-tm outline-none min-w-[140px]"
      />
    </div>
  )
}

export default TagInput
