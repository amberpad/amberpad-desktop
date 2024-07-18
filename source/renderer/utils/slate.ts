import {
  Editor,
  Transforms,
  Element,
  Text,
  createEditor as _createEditor,
  BaseEditor,
  BaseOperation,
  Range,
  Node,
  NodeEntry,
  Ancestor,
  Path,
  NodeMatch,
} from 'slate'
import { useSlate, ReactEditor } from 'slate-react'

import type { EditorType, ElementType, NodeType, TextType, NodeFormat } from "@ts/slate.types"

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

  const context = new (function AmberpadEditorContext() {
    this.toString = () => JSON.stringify(this, undefined, 4)
    this.paragraphTypes = [
      'heading-one',
      'heading-two',
      'heading-three',
      'paragraph',
    ]
    this.paragraphWrapper = [
      'block-quote'
    ]
    this.listTypes = [
      'numbered-list', 
      'bulleted-list',
      'check-list',
    ]
    this.listItems = [
      'list-item',
      'check-list-item'
    ]
    this.allowedParents = {
      'block-quote': []
    }
    this.allowedChildren = {
      'block-quote': []
    }
  })()

  /****************************************************************************
  * onChange custom listener functions
  ****************************************************************************/
  const _onChange = editor.onChange
  const onChange: BaseEditor['onChange'] = (...args) => {
    const [options, ...extraArgs] = args
    if (options) {
      const { operation } = options
      if (listenersMap.has(operation.type)) {
        const listeners = listenersMap.get(operation.type) as OperationListener[]
        listeners.forEach((listener) => listener(operation))
      }
    }

    _onChange(...args)
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

  const _deleteBackward = editor.deleteBackward
  const deleteBackward: BaseEditor['deleteBackward'] = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      console.log('deleteBackward')
    }

    return _deleteBackward(...args)
  }

  const _insertBreak = editor.insertBreak
  const insertBreak: BaseEditor['insertBreak'] = (...args) => {
    _insertBreak(...args)

    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const stack = Array.from(getAncestorsStack(selection.anchor.path, { includeCeiling: true }))
      console.log('STACK', stack)
      if (
        stack.length >= 2 && 
        stack[0][0].type === 'paragraph' &&
        context.listItems.includes(stack[1][0].type)
      ) {
        if (Node.string(Node.get(editor, Path.previous(stack[0][1]))) === '') {
          // If the last empty list item has no text the next paragraph 
          // is created out of list
          let [ paragraph, item ] = stack

          const target = paragraph[1]
          Transforms.liftNodes(editor, { at: target })
          Transforms.removeNodes(editor, { at: item[1] })
          Transforms.liftNodes(editor, { at: Path.parent(target) })

        } else  {
          // Create new item for the list and place the new paragraph on it
          let [ paragraph, item ] = stack
          Transforms.insertNodes(
            editor,
            { type: item[0].type, children: [] } as any,
            { at: Path.next(item[1]) }
          )
          Transforms.moveNodes(
            editor,
            { at: paragraph[1], to: [...Path.next(item[1]), 0] }
          )
        }
      }
    }
  }

  /****************************************************************************
  * Block commands
  ****************************************************************************/

  const getLeaves = ({
    match=() => true
  }: {
    match?: NodeMatch<NodeType>
  } = {}): Generator<NodeEntry<EditorType | ElementType>, void, undefined> => {
    console.log('EDTIOR SELECTION', editor.selection)
    if (!editor.selection) {
      return undefined
    }

    const floorTypes = [...context.listTypes, ...context.paragraphTypes]
    const leafs = editor.nodes<ElementType | EditorType>({
      mode: 'lowest',
      at: Editor.unhangRange(editor, editor.selection),
      match: (node: ElementType, path) =>
        Element.isElement(node) &&
        floorTypes.includes(node.type) &&
        match(node, path)
    })

    return leafs
  }

  interface GetAncestorsStackOptions {
    ceiling?: string[],
    reverse?: boolean,
    includeCeiling?: boolean,    
  }

  function* getAncestorsStack (
    leafPath: Path, 
    {
      ceiling=['editor', ...context.listItems],
      reverse=true,
      includeCeiling=false,
    }: GetAncestorsStackOptions = {}
  ): Generator<NodeEntry<EditorType | ElementType>> {
    if (!editor.selection) return

    for(let [node, path] of Node.ancestors(editor, leafPath, { reverse })) {
      if (ceiling.includes((node as ElementType).type)) {
        if (includeCeiling) {
          yield [node, path] as NodeEntry<EditorType | ElementType>
        }
        break
      }

      yield [node, path] as NodeEntry<EditorType | ElementType>
    }
  }

  const findStackAncestor = (
    path: Path,
    match: (node, path) => boolean,
    options: GetAncestorsStackOptions={},
  ): NodeEntry<EditorType | ElementType> => {
    for (
      let [ancestor, ancestorPath] of 
      getAncestorsStack(path, options)
    ) {
      if (match(ancestor, ancestorPath)) {
        return [ancestor, ancestorPath]
      }
    }
   return undefined
  }

  const isBlockActive = (format: NodeFormat) => {
    if (!editor.selection) return false

    const leaves = Array.from(getLeaves())
    const asserted = leaves.map(([node, path]) => 
      !!findStackAncestor(path, (node) => node.type === format))
    return asserted.every(value => value)
  }

  const toggleBlock = (format: NodeFormat) => {
    if (!isBlockActive(format)) {
      const leaves = Array.from(getLeaves())
      for (let [leaf, leafPath] of leaves) {
        Transforms.wrapNodes<NodeType>(
          editor, 
          { type: format, children: [] } as ElementType,
          { at: leafPath }
        )
      }
    } else {
      const leaves = Array.from(getLeaves())
      for (let [leaf, leafPath] of leaves) {
        const entry = findStackAncestor(leafPath, 
          (node) => node.type === format)
        if (entry) {
          Transforms.unwrapNodes<NodeType>(editor, { at: entry[1] })
        }
      }
    }
  }

  /****************************************************************************
  * Text Block commands
  ****************************************************************************/

  const TEXT_BLOCK_TYPES = [
    'heading-one',
    'heading-two',
    'heading-three',
    'paragraph',
  ]

  const getTextTypes = (): NodeFormat[] => {
    const textBlocks =  Array.from(getLeaves())
      .map(([node, path]) => node) as ElementType[]
    // Remove duplicates
    return Array.from((new Set(textBlocks.map(node => node.type))).values())
  }

  const toggleTextBlock = (format: NodeFormat) => {
    if (!editor.selection) return

    const leaves = getLeaves()
    const textBlocks =  Array.from(getLeaves())
      .map(([node, path]) => node) as ElementType[]
    const textTypes = Array.from((new Set(textBlocks.map(node => node.type))).values())
    const type = textTypes.length === 1 && textTypes[0] === format ?
      TEXT_BLOCK_TYPES.find(item => item === format) || 'paragraph' :
      'paragraph'

    /*
    if (
      textTypes.length === 1 && 
      textTypes[0] === format
    ) {
      // Set to paragraph

    } else {
      // Set to format
    }
    */

    /*
    for (let [node, path] of leaves) {
      Transforms.setNodes<ElementType>(editor, { type }, { at: path })
    }
    */


    /*
    // Set new format for selected blocks of text
    const type = TEXT_BLOCK_TYPES.find(item => item === format) || 'paragraph'
    Transforms.setNodes<ElementType>(
      editor, 
      { type },
      {
        at: Editor.unhangRange(editor, editor.selection),
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          TEXT_BLOCK_TYPES.includes(node.type),
      }
    )
    */
  }

  /****************************************************************************
  * List block commands
  ****************************************************************************/

  var LIST_TYPES = [
    'numbered-list', 
    'bulleted-list',
    'check-list',
  ]
  var LIST_ITEMS = [
    'list-item',
    'check-list-item'
  ]

  const LIST_ITEM_INDEXES = {
    'numbered-list': LIST_ITEMS[0], 
    'bulleted-list': LIST_ITEMS[0],
    'check-list': LIST_ITEMS[1],
    
  }
  
  const isBlockListActive = (format: NodeFormat): boolean => {
    if (!editor.selection) return false

    const nodes: NodeEntry<ElementType>[] = Array.from(Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (node: NodeType, path) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        path.length === 1,
    }))

    return nodes.length === 1 && 
      LIST_TYPES.includes(nodes[0][0].type) &&
      nodes[0][0].type === format
  }

  const removeContainerListBlocks = () => {
    if (!editor.selection) return false

    // Remove list items
    const itemNodes: NodeEntry<ElementType>[] = Array.from(Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (node: NodeType, path) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        LIST_ITEMS.includes(node.type) &&
        path.length === 2,
    }))

    for ( let [node, path] of itemNodes.reverse()) {
      Transforms.unwrapNodes<NodeType>(editor, { at: path })
    }

    // Remove list containers
    const listNodes: NodeEntry<ElementType>[] = Array.from(Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (node: NodeType, path) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        LIST_TYPES.includes(node.type) &&
        path.length === 1,
    }))

    for ( let [node, path] of listNodes.reverse()) {
      Transforms.unwrapNodes<NodeType>(
        editor, { at: path, split: true })
    }
  }

  const toggleListBlock = (format: NodeFormat): void => {
    if (!isBlockListActive(format)) {
      removeContainerListBlocks()
      // Group into a list
      const nodes = Editor.nodes(editor, {
        at: Editor.unhangRange(editor, editor.selection),
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          Element.isElement(node)
      })
      for( let [node, path] of nodes) {
        Transforms.wrapNodes<NodeType>(
          editor, 
          { type: LIST_ITEM_INDEXES[format], children: [] } as any,
          {at: path}
        )
      }
      Transforms.wrapNodes<NodeType>(
        editor, 
        { type: format, children: [] } as ElementType,
      )
    } else {
      // Unflatten to original form
      Transforms.unwrapNodes<NodeType>(editor, {
        mode: 'all',
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          [...LIST_TYPES, LIST_ITEM_INDEXES[format]].includes(node.type),
        split: true,
      })
    }
  }

  const setCheckListItemValue = (element: ElementType, value) => {
    const path = ReactEditor.findPath(editor as any, element)
    Transforms.setNodes<ElementType>(editor, { checked: value }, { at: path })
  }

  /****************************************************************************
  * Mark commands
  ****************************************************************************/

  const toggleMark = (format: NodeFormat) => {
    const isActive = isMarkActive(format)
  
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }
  
  const isMarkActive = (format: NodeFormat) => {
    const marks = Editor.marks(editor)
    return !!(marks ? marks[format] : false)
  }

  /****************************************************************************
  * URL mark commands
  ****************************************************************************/

  const toggleLinkMark = (url: string) => {
    const isActive = isMarkActive('link')

    if (isActive) {
      Editor.removeMark(editor, 'link')
    } else {
      Editor.addMark(editor, 'link', url)
    }
  }

  const isLinkButtonEnabled = () => {
    return !!(
      editor.selection && 
      !Range.isCollapsed(editor.selection) &&
      !isMarkActive('link')
    )
  }

  const getLinkMarkOnSelection = () => {
    const marks = Editor.marks(editor)
    return (marks && marks['link']) || null
  }

  const updateHoveredLink = (link: string) => {
    const documentEdges = Editor.edges(editor, [])
    Transforms.setNodes<TextType>(
      editor,
      { link },
      {
        at: {
          anchor: documentEdges[0],
          focus: documentEdges[1]
        },
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          Text.isText(node) &&
          !!node.link &&
          !!node._hovered
      }
    )
  }

  const removeHoveredLink = () => {
    const documentEdges = Editor.edges(editor, [])
    Transforms.unsetNodes<TextType>(
      editor,
      ['_hovered', 'link'],
      {
        at: {
          anchor: documentEdges[0],
          focus: documentEdges[1]
        },
        match: (node: NodeType) =>
          !Editor.isEditor(node) &&
          Text.isText(node) &&
          !!node.link &&
          !!node._hovered
      }
    )
  }

  const hoveredLink = { value: false }
  setOnOperationListener('set_selection', () => {
    if (hoveredLink.value) {
      // Remove show attrs from all the links in the document
      const documentEdges = Editor.edges(editor, [])
      Transforms.unsetNodes<TextType>(
        editor,
        '_hovered',
        {
          at: {
            anchor: documentEdges[0],
            focus: documentEdges[1]
          },
          match: (node: NodeType) =>
            !Editor.isEditor(node) &&
            Text.isText(node) &&
            !!node.link 
        }
      )

      hoveredLink.value = false
    }

    if (isMarkActive('link') && Range.isCollapsed(editor.selection)) {
      Transforms.setNodes<TextType>(
        editor,
        { _hovered: true },
        { 
          at: Editor.unhangRange(editor, editor.selection),
          match: (node: NodeType) =>
            !Editor.isEditor(node) &&
            Text.isText(node)
        }
      )
      hoveredLink.value = true
    }
  })

  // Return editor reference with aggregated functions
  /*****************************************************************************/
  return Object.assign(editor, {
    type: 'editor',
    onChange,
    deleteBackward,
    insertBreak,
    // Custom methods
    setOnOperationListener,
    removeOnOperationListener,
    isBlockActive,
    toggleBlock,
    getTextTypes,
    toggleTextBlock,
    isBlockListActive,
    toggleListBlock,
    toggleMark,
    isMarkActive,
    toggleLinkMark,
    getLinkMarkOnSelection,
    isLinkButtonEnabled,
    updateHoveredLink,
    removeHoveredLink,
    setCheckListItemValue,
  })
}
