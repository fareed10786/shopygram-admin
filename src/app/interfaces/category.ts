export interface Category {
    id?:string,
    parentId: string,
    name: string,
    description: string,
    assets: {
      icon: string,
      image: string
    },
    affiliateCommision: number,
    platformCommision:number
    gender: number,
    tat: number,
    hasSubcategories?: number,
    status?: number,
    created?: number,
    updated?: number
}
