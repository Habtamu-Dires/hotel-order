export interface Item{
    id:string,
    name:string,
    imageUrl?:string;
    description?:string,
    categoryId:string,
    price:number,
    stockQuantity?:number,
    isAvailable?:boolean,
}