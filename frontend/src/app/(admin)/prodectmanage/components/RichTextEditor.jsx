"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

export default function RichTextEditor({ value = "", onChange }) {
  const [showSource, setShowSource] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const editorRef = useRef(null)

  // Keep cursor at end when content changes externally
  useEffect(() => {
    if (editorRef.current && !showSource) {
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()
        range.selectNodeContents(editorRef.current)
        range.collapse(false) // false means collapse to end
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }, [value, showSource])

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value || undefined)
    if (editorRef.current) {
      editorRef.current.focus()
    }
    handleContentChange()
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          execCommand("bold")
          break
        case "i":
          e.preventDefault()
          execCommand("italic")
          break
        case "u":
          e.preventDefault()
          execCommand("underline")
          break
      }
    }
  }

  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      execCommand("insertImage", url)
    }
  }

  const formatBlock = (tag) => {
    execCommand("formatBlock", tag)
  }

  // Function to move cursor to end
  const moveCursorToEnd = () => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()
        range.selectNodeContents(editorRef.current)
        range.collapse(false) // false means collapse to end
        selection.removeAllRanges()
        selection.addRange(range)
        editorRef.current.focus()
      }
    }
  }

  // Handle focus to ensure cursor is at end
  const handleFocus = () => {
    setTimeout(moveCursorToEnd, 0)
  }

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold (Ctrl+B)" },
    { icon: Italic, command: "italic", title: "Italic (Ctrl+I)" },
    { icon: Underline, command: "underline", title: "Underline (Ctrl+U)" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Rich Text Editor
          <Button type="button" variant="outline" size="sm" onClick={() => setShowSource(!showSource)}>
            <Code className="w-4 h-4 mr-2" />
            {showSource ? "Visual" : "Source"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showSource ? (
          <>
            {/* Toolbar */}
            <div className="border-b pb-3 mb-3">
              <div className="flex flex-wrap gap-1">
                {/* Format Dropdown */}
                <select
                  onChange={(e) => formatBlock(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                  defaultValue=""
                >
                  <option value="">Format</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="p">Paragraph</option>
                </select>

                <div className="w-px bg-gray-300 mx-2"></div>

                {/* Formatting Buttons */}
                {toolbarButtons.map(({ icon: Icon, command, title }) => (
                  <Button
                    key={command}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand(command)}
                    title={title}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}

                <div className="w-px bg-gray-300 mx-2"></div>

                {/* Special Buttons */}
                <Button type="button" variant="ghost" size="sm" onClick={insertLink} title="Insert Link">
                  <Link className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={insertImage} title="Insert Image">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              className="min-h-48 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dangerouslySetInnerHTML={{ __html: value }}
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleContentChange}
              style={{ minHeight: "200px" }}
            />
          </>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-64 p-4 border rounded-md font-mono text-sm"
            placeholder="HTML source code..."
          />
        )}

        <div className="mt-3 text-sm text-gray-500">Character count: {value.replace(/<[^>]*>/g, "").length}</div>
      </CardContent>
    </Card>
  )
}
