import type {
  BaseElement,
  BaseText,
  BaseEditor,
} from 'slate'

export type NodeFormat = string

export type DescendantType = ElementType | TextType

export interface ElementType extends BaseElement {
  type: NodeFormat
  checked?: boolean
  children: DescendantType[]
}

export interface TextType extends BaseText {
  text: NodeFormat
  link?: string
  _hovered?: boolean
}

export interface EditorType extends BaseEditor {
  type: 'editor'
}

export type BaseNodeType = EditorType | ElementType | TextType
export type NodeType = EditorType | ElementType | TextType
