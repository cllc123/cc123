"use client"

import { stopPropagation } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import clsx from "clsx"
import { useMotionValue } from "framer-motion"
import type { DetailedHTMLProps, PropsWithChildren, TextareaHTMLAttributes } from "react"
import { forwardRef, useCallback, useState } from "react"

import { useInputComposition } from "~/hooks/common"

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  default: "rounded",
}
export const TextArea = forwardRef<
  HTMLTextAreaElement,
  DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> &
    PropsWithChildren<{
      wrapperClassName?: string
      onCmdEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
      rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "default"
      bordered?: boolean
    }>
>((props, ref) => {
  const {
    className,
    wrapperClassName,
    children,
    rounded = "xl",
    bordered = true,
    onCmdEnter,
    ...rest
  } = props
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
    },
    [mouseX, mouseY],
  )

  const inputProps = useInputComposition<HTMLTextAreaElement>(props)
  const [isFocus, setIsFocus] = useState(false)
  return (
    <div
      className={cn(
        "group relative h-full border ring-0 ring-accent/20 duration-200",
        roundedMap[rounded],

        "border-transparent",
        isFocus && "border-accent/80 ring-2",

        "placeholder:text-theme-placeholder-text dark:text-zinc-200",
        wrapperClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      {bordered && (
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 z-0 border border-border",
            roundedMap[rounded],
          )}
          aria-hidden="true"
        />
      )}
      <textarea
        ref={ref}
        className={cn(
          "size-full resize-none bg-transparent",
          "overflow-auto px-3 py-4",
          "!outline-none",
          "text-neutral-900/80 dark:text-slate-100/80",
          "focus:!bg-accent/5",
          roundedMap[rounded],
          className,
        )}
        {...rest}
        onFocus={(e) => {
          setIsFocus(true)
          rest.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocus(false)
          rest.onBlur?.(e)
        }}
        onContextMenu={stopPropagation}
        {...inputProps}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            onCmdEnter?.(e)
          }
          rest.onKeyDown?.(e)
          inputProps.onKeyDown?.(e)
        }}
      />

      {children}
    </div>
  )
})
TextArea.displayName = "TextArea"
