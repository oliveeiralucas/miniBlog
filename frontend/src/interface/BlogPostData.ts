export interface BlogPost {
  title: string
  image: string
  image_data?: string
  tags: string[]
  body: string
  uid: string | null | undefined
  createdAt?: Date
  createdBy: string | null | undefined
}
