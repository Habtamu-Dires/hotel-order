export interface Category{
    id:string,
    name: string,
    imageUrl?:string,
    subCategories?: Array<Category>
}