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
  node,
  path,
} from 'slate'
import { useSlate, ReactEditor } from 'slate-react'

import type { EditorType, ElementType, NodeType, TextType, NodeFormat } from "@ts/slate.types"
import { reverse } from 'lodash'

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
    this.listItemsMap = {
      'numbered-list': 'list-item', 
      'bulleted-list': 'list-item',
      'check-list': 'check-list-item',
    }
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
    match=() => true,
    reverse=false,
  }: {
    match?: NodeMatch<NodeType>,
    reverse?: boolean
  } = {}): Generator<NodeEntry<EditorType | ElementType>, void, undefined> => {
    // Finds the lowest paragraph blocks in selection
    if (!editor.selection) {
      return (function* () {})()
    }

    const floorTypes = [...context.listTypes, ...context.paragraphTypes]
    const leafs = editor.nodes<ElementType | EditorType>({
      mode: 'lowest',
      reverse: reverse,
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
    // Returns a generator with the ancestor branch of a given node
    // The generator will stop when finding one of the ceiling element types
    // or throwing an error
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
    match: (
      node: EditorType | ElementType, 
      path: Path
    ) => boolean,
    options: GetAncestorsStackOptions={
      ceiling: ['editor'],
      includeCeiling: true,
    },
  ): NodeEntry<EditorType | ElementType> => {
    // Iterates the ancestors branch of a given node to find an element
    // that makes the match function to return true
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

  const groupAdjacentLeaves = (
    leaves: Generator<NodeEntry<EditorType | ElementType>, void, undefined>
  ): { items: Path[], location: Path | Range }[] => {
    const paths = Array.from(leaves).map(entry => entry[1])
    // Key will be the lead element in the group, value will be the group
    //const groups: Map<Path, Path[]> = new Map()
    const groups: { lead: Path, items: Path[] }[] = []
    paths.forEach((path) => {
      const group = groups.find(
        item => Path.isSibling(item.lead, path) ||
        context.listTypes.includes(
          (Node.get(editor, Path.common(item.lead, path)) as ElementType | EditorType).type
        )
      )
      if (!!group) {
        group.lead = path
        group.items.push(path)
      } else {
        groups.push({ lead: path, items: [path] })
      }
    })

    return groups.map(({ items }) => ({
      items,
      location: items.length === 1 ?
        items[0] as Path :
        { 
          anchor: { path: items[0], offset: 0 },
          focus: { path: items[items.length -1], offset: 0 }
        } as Range
    }))
  }

  /****************************************************************************
  * General use block commands
  ****************************************************************************/

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
        const entry = findStackAncestor(leafPath, (node) => node.type === format)
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
    const type = (
      textTypes.length === 1 && 
      textTypes[0] === format
    ) ?
      'paragraph' :
      TEXT_BLOCK_TYPES.find(item => item === format) || 'paragraph'

    for (let [node, path] of leaves) {
      Transforms.setNodes<ElementType>(editor, { type }, { at: path })
    }
  }

  /****************************************************************************
  * List block commands
  ****************************************************************************/
  
  const isBlockListActive = (format: NodeFormat): boolean => {
    if (!editor.selection) return false

    const leaves = Array.from(getLeaves())
    const listAncestor = leaves
      .map(([node, path]) => {
        const ancestor = findStackAncestor(path, (node) => node.type === format)
        // return an ancestor or an empty node
        return ancestor !== undefined ? ancestor[0] : { type: undefined }
      })

    return listAncestor.length > 0 &&
      listAncestor[0].type === format &&
      // All array elements are the same
      listAncestor.every(node => node === listAncestor[0])
  }

  const unsetListItem = (
    path: Path
  ) => {
    const listItem: NodeEntry<EditorType | ElementType> = 
      findStackAncestor(path, (node) => context.listItems.includes(node.type))

    if (listItem !== undefined) {
      if (Path.hasPrevious(listItem[1])) {
        Transforms.liftNodes(editor, { at: listItem[1] })
        Transforms.unwrapNodes(editor, { at: Path.next(Path.parent(listItem[1])) })
      } else {
        Transforms.liftNodes(editor, { at: listItem[1] })
        Transforms.unwrapNodes(editor, { at: Path.parent(listItem[1]) })
      }
    }
  }

  const unsetListOnSelection = () => {
    if (!editor.selection) {
      return
    }

    for (let [node, path] of getLeaves({ reverse: true })) {
      unsetListItem(path)
    }
  }

  const setListOnSelection = (format: NodeFormat) => {
    if (!editor.selection) {
      return
    }
    
    const nodes = Array.from(editor.nodes({
      at: editor.unhangRange(editor.selection),
      mode: 'highest',
      match: (node, path) =>
        !Editor.isEditor(node) &&
        Element.isElement(node)
    }))

    for (let [node, path] of nodes) {
      Transforms.wrapNodes<ElementType>(
        editor, 
        { type: context.listItemsMap[format], children: [] } as ElementType,
        { at: path }
      )
    }
    Transforms.wrapNodes<ElementType>(
      editor, 
      { type: format, children: [] } as ElementType,
      { 
        at: nodes.length === 1 ?
          nodes[0][1] :
          editor.unhangRange(editor.selection)
      }
    )
  }

  const toggleListBlock = (format: NodeFormat): void => {
    if (!editor.selection) {
      return
    }

    if (isBlockActive(format)) {
      unsetListOnSelection()
    } else {
      unsetListOnSelection()
      setListOnSelection(format)
    }
  }

  const _toggleListBlock = (format: NodeFormat): void => {
    if (!editor.selection) {
      return
    }  

    console.log('[leaves]', JSON.stringify(Array.from(getLeaves()).map(([node, path]) => [node.type, path]), null, 2))
    console.log('[locations]', groupAdjacentLeaves(getLeaves()))

    // Active means that all the selected paragraphs are descendents of the
    // same type of list
    if (isBlockActive(format)) {
      // if there only one group and the group belongs to a list and the format is different 
      // from the list it contains change the list type
      const groups = groupAdjacentLeaves(getLeaves())

      /*
      // For a single node
      for (let [leaf, leafPath] of getLeaves({ reverse: true })) {
        Transforms.liftNodes(editor, { at: Path.parent(leafPath) })
        Transforms.unwrapNodes(editor, { at: Path.next(Path.parent(Path.parent(leafPath))) })
      }
      // Check if all nodes in the list are removed, remove also the list
      */
    } else {
      const groups = groupAdjacentLeaves(getLeaves())

      /*
      // If group belongs to a list and format of list is different from the one getting set
      // Change item list type to the one getting set
      if (groups.length === 1 && Path.isPath(groups[0].location)) {
        const { location, items } = groups[0]
        const ancestor = findStackAncestor(
          location, (node) => context.listTypes.includes(node.type))

      } else if (groups.length === 1 && Range.isRange(groups[0].location)) {
        const listNode = Node.get(editor, Path.common(groups[0].items[0], groups[0].items[1])) as ElementType

      } else {

      }
      */

      for (let i = 0; i < groups.length; i++) {
        const { location, items } = groups[i]
        
        // If group belongs to a list and format of list is different from the one getting set
        // Change item list type to the one getting set

        if (Path.isPath(location)) {
          const ancestor = findStackAncestor(
            location, (node) => context.listTypes.includes(node.type))

          if (ancestor !== undefined) {

          } else {
            Transforms.wrapNodes<ElementType>(
              editor, 
              { type: context.listItemsMap[format], children: [] } as ElementType,
              { at: location }
            )
            Transforms.wrapNodes<ElementType>(
              editor, 
              { type: format, children: [] } as ElementType,
              { at: location }
            )
          }
        } else {
          const listNode = Node.get(
            editor, 
            Path.common(groups[0].items[0], groups[groups.length - 1].items[1])) as ElementType

          if (context.listTypes.includes(listNode.type)) {

          } else {
            for (let path of items) {
              Transforms.wrapNodes<ElementType>(
                editor, 
                { type: context.listItemsMap[format], children: [] } as ElementType,
                { at: path }
              )
            }
            Transforms.wrapNodes<ElementType>(
              editor, 
              { type: format, children: [] } as ElementType,
              { at: location }
            ) 
          }
        }
      }
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
