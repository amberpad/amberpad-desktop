import {
  Editor,
  Transforms,
  Element as SlateElement,
  createEditor as _createEditor,
  BaseEditor,
  BaseOperation
} from 'slate'

import type { ElementType, NodeType, EditorType } from "@ts/slate.types"

/******************************************************************************
* Custom editor pluggin
******************************************************************************/

type OperationListener = (operation?: BaseOperation) => void
type OperationType = BaseOperation['type']

export interface AmberpadEditor extends BaseEditor {
  setOnOperationListener: (type: OperationType, listener: OperationListener) => void
  removeOnOperationListener: (type: OperationType, listener: OperationListener) => void
}

export function widthAmberpadEditor<T extends BaseEditor> (
  editor: T
): T & AmberpadEditor {
  const _editor = editor as T & AmberpadEditor
  const listenersMap = new Map<OperationType, OperationListener[]>()

  _editor.onChange = (options) => {
    if (options) {
      const { operation } = options
      if (listenersMap.has(operation.type)) {
        const listeners = listenersMap.get(operation.type) as OperationListener[]
        listeners.forEach((listener) => listener(operation))
      }
    }
  }

  _editor.setOnOperationListener = (type, listener) => {
    if (listenersMap.has(type)) {
      const listeners = listenersMap.get(type) as OperationListener[]
      listenersMap.set(type, [...listeners, listener])
    } else {
      listenersMap.set(type, [listener])
    }
  }

  _editor.removeOnOperationListener = (type, listener) => {
    let listeners = listenersMap.get(type) as OperationListener[]
    listeners = listeners.filter((item) => item !== listener)
    listenersMap.set(type, listeners)
  }

  return _editor
}

/******************************************************************************
* Block Commands
******************************************************************************/

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

// Text Commands
/*****************************************************************************/

const TEXT_TYPES = [
  'heading-one',
  'heading-two',
  'heading-three',
  'paragraph',
]

const isTextType = (type: string) => {
  return TEXT_TYPES.includes(type)
}

export const toggleTextBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
  )
  Transforms.setNodes<ElementType>(
    editor, 
    { type: isActive ? 'paragraph' : format }
  )
}

export const getTextElementNodesInSelection = (editor) => {
  const nodes = Array.from(Editor.nodes(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: (node: NodeType) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      isTextType(node.type),
  }))

  return nodes
}

// List Commands
/*****************************************************************************/

const LIST_TYPES = [
  'numbered-list', 
  'bulleted-list',
  'list-item'
]

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
        { type: 'list-item', children: [] } as any,
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
        LIST_TYPES.includes(node.type),
      split: true,
    })
  }
}

/******************************************************************************
* Mark Commands
******************************************************************************/

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    console.log('EDITOR ADD MARK')
    Editor.addMark(editor, format, true)
    //console.log('EDITOR CONTENT', JSON.stringify(editor.children, undefined, 4))
  }
}

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
