import {
  Editor,
  Transforms,
  Element as SlateElement,
  createEditor as _createEditor,
  BaseEditor,
  BaseOperation,
  Range
} from 'slate'
import { useSlate } from 'slate-react'

import type { ElementType, NodeType } from "@ts/slate.types"

export const useAmberpadEditor = () => {
  return useSlate() as AmberpadEditor
}

/******************************************************************************
* Slate's Amberpad plugin
******************************************************************************/
export type AmberpadEditor = ReturnType<typeof widthAmberpadEditor>
type OperationListener = (operation?: BaseOperation) => void
type OperationType = BaseOperation['type']

export function widthAmberpadEditor<T extends BaseEditor, P> (
  editor: T
) {
  const listenersMap = new Map<OperationType, OperationListener[]>()

  /****************************************************************************
  * Utils
  ****************************************************************************/

  const isSelectionCollpased = () => {
    return editor.selection && Range.isCollapsed(editor.selection)
  }

  /****************************************************************************
  * onChange custom listener functions
  ****************************************************************************/
  const onChange = (...args: Parameters<typeof editor.onChange>): ReturnType<typeof editor.onChange> => {
    const [options, ...extraArgs] = args
    if (options) {
      const { operation } = options
      if (listenersMap.has(operation.type)) {
        const listeners = listenersMap.get(operation.type) as OperationListener[]
        listeners.forEach((listener) => listener(operation))
      }
    }
  }

  const setOnOperationListener = (type, listener) => {
    if (listenersMap.has(type)) {
      const listeners = listenersMap.get(type) as OperationListener[]
      listenersMap.set(type, [...listeners, listener])
    } else {
      listenersMap.set(type, [listener])
    }
  }

  const removeOnOperationListener = (type, listener) => {
    let listeners = listenersMap.get(type) as OperationListener[]
    listeners = listeners.filter((item) => item !== listener)
    listenersMap.set(type, listeners)
  }

  /****************************************************************************
  * Block util commands
  ****************************************************************************/

  const isBlockActive = (format) => {
    const { selection } = editor
    if (!selection) return false
  
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          SlateElement.isElement(node) &&
          node.type === format,
      })
    )
  
    return !!match
  }

  const toggleBlock = (format) => {
    if (LIST_TYPES.includes(format)) {
      toggleListBlock(format)
    } else {
      const isActive = isBlockActive(format)
      Transforms.setNodes<ElementType>(
        editor, 
        { type: isActive ? 'paragraph' : format }
      )
    }
  }

  /****************************************************************************
  * Mark util commands
  ****************************************************************************/

  const toggleMark = (format) => {
    const isActive = isMarkActive(format)
  
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }
  
  const isMarkActive = (format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  }

  /****************************************************************************
  * Text mark commands
  ****************************************************************************/

  const TEXT_MARK_TYPES = [
    'heading-one',
    'heading-two',
    'heading-three',
    'paragraph',
  ]

  const isTextType = (type: string) => {
    return TEXT_MARK_TYPES.includes(type)
  }

  const getTextElementTypesInSelection = () => {
    const nodes = Array.from(Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (node: NodeType) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        isTextType(node.type),
    })) as unknown as ElementType[]

    // Extract elements types and remove repeated
    const result = new Set()
    nodes.forEach((item) => result.add(item[0].type))
    return Array.from(result.values())
  }

  /****************************************************************************
  * List block commands
  ****************************************************************************/

  const LIST_TYPES = [
    'numbered-list', 
    'bulleted-list',
  ]
  const LIST_ITEM_INDEX = 'list-item'
  
  const toggleListBlock = (format) => {
    const isActive = isBlockActive(format)
  
    if (!isActive) {
      // Group into a list
      const nodes = Editor.nodes(editor, {
        at: Editor.unhangRange(editor, editor.selection),
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          SlateElement.isElement(node)
      })
      for( let [node, path] of nodes) {
        Transforms.wrapNodes<NodeType>(
          editor, 
          { type: LIST_ITEM_INDEX, children: [] } as any,
          {at: path}
        )
      }
      Transforms.wrapNodes<NodeType>(
        editor, 
        { type: format, children: [] } as any
      )
    } else {
      // Unflatten to original form
      Transforms.unwrapNodes<NodeType>(editor, {
        mode: 'all',
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          SlateElement.isElement(node) &&
          [...LIST_TYPES, LIST_ITEM_INDEX].includes(node.type),
        split: true,
      })
    }
  }

  /****************************************************************************
  * URL mark commands
  ****************************************************************************/

  const toggleLinkMark = (url: string) => {
    const isActive = isLinkMarkActive()

    if (isActive) {
      Editor.removeMark(editor, 'link')
    } else {
      Editor.addMark(editor, 'link', { url })
    }
  }

  const isLinkMarkActive = () => {
    const marks = Editor.marks(editor)
    console.log('IS LINK MARK ACTIVE', marks)
    return false
    //return marks ? marks['link'] === true : false
  }

  // Return editor reference with aggregated functions
  /*****************************************************************************/
  return Object.assign(editor, {
    isSelectionCollpased,
    onChange,
    setOnOperationListener,
    removeOnOperationListener,
    isBlockActive,
    toggleBlock,
    toggleMark,
    isMarkActive,
    isTextType,
    getTextElementTypesInSelection,
    toggleListBlock,
    toggleLinkMark,
    isLinkMarkActive,
  })
}

/******************************************************************************
* Block Commands
******************************************************************************/
/*
export const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node: NodeType) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        node.type === format,
    })
  )

  return !!match
}

export const toggleBlock = (editor, format) => {
  if (
    COMMON_TYPES.includes(format) ||
    TEXT_TYPES.includes(format)
  ) {
    toggleCommonBlock(editor, format)
  } else if (
    LIST_TYPES.includes(format)
  ) {
    toggleListBlock(editor, format)
  }
}
*/

// Common Elements Commands
/*****************************************************************************/
/*
const COMMON_TYPES = [
  'block-quote'
]
*/

/*
export const toggleCommonBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
  )
  Transforms.setNodes<ElementType>(
    editor, 
    { type: isActive ? 'paragraph' : format }
  )
}
*/
/*
export const isSelectionCollpased = (editor) => {
  return editor.selection && Range.isCollapsed(editor.selection)
}
  */

// Text Commands
/*****************************************************************************/
/*
const TEXT_MARK_TYPES = [
  'heading-one',
  'heading-two',
  'heading-three',
  'paragraph',
]

const isTextType = (type: string) => {
  return TEXT_MARK_TYPES.includes(type)
}

export const getTextElementTypesInSelection = (editor) => {
  const nodes = Array.from(Editor.nodes(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: (node: NodeType) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      isTextType(node.type),
  })) as unknown as ElementType[]

  // Extract elements types and remove repeated
  const result = new Set()
  nodes.forEach((item) => result.add(item[0].type))
  return Array.from(result.values())
}
*/

// List Commands
/*****************************************************************************/

/*
const LIST_TYPES = [
  'numbered-list', 
  'bulleted-list',
]
const LIST_ITEM_INDEX = 'list-item'

export const toggleListBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
  )

  if (!isActive) {
    // Group into a list
    const nodes = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (node: NodeType) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node)
    })
    for( let [node, path] of nodes) {
      Transforms.wrapNodes<NodeType>(
        editor, 
        { type: LIST_ITEM_INDEX, children: [] } as any,
        {at: path}
      )
    }
    Transforms.wrapNodes<NodeType>(
      editor, 
      { type: format, children: [] } as any
    )
  } else {
    // Unflatten to original form
    Transforms.unwrapNodes<NodeType>(editor, {
      mode: 'all',
      match: (node: NodeType) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        [...LIST_TYPES, LIST_ITEM_INDEX].includes(node.type),
      split: true,
    })
  }
}
*/

/******************************************************************************
* Mark Commands
******************************************************************************/

/*
export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
*/

// URL Commands
/*****************************************************************************/
/*
export const toggleLinkMark = (editor, url: string) => {
  const isActive = isLinkMarkActive(editor)

  if (isActive) {
    Editor.removeMark(editor, 'link')
  } else {
    Editor.addMark(editor, 'link', { url })
  }
}

export const isLinkMarkActive = (editor) => {
  const marks = Editor.marks(editor)
  console.log('IS LINK MARK ACTIVE', marks)
  return false
  //return marks ? marks['link'] === true : false
}
*/