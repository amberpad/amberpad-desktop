import type {
  BaseElement,
  BaseText,
  BaseEditor,
} from 'slate'

export type DescendantType = ElementType | TextType

export interface ElementType extends BaseElement {
  type: string
  children: DescendantType[]
}

export interface TextType extends BaseText {
  text: string
  url?: string
}

export interface EditorType extends BaseEditor {

}

export type BaseNodeType = EditorType | ElementType | TextType
export type NodeType = EditorType | ElementType | TextType
