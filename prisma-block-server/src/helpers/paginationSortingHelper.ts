
type IOptions={
    page?:number | string,
    limit?:number | string,
    sortOder?:string,
    sortBy?:string
}
type IOptionsResult={
        page:number ,
    limit:number,
    sortOder:string,
    sortBy:string,
    skip:number
}

const paginationSortingHelper = (options:IOptions) :IOptionsResult=> {
    const page:number=Number(options.page) || 1;
    const limit:number=Number(options.limit) || 10;
    const skip:number=(page-1) * limit;
    const sortBy:string=options.sortBy || "createdAt"
    const sortOder:string=options.sortOder || "desc"

return {
    page,limit,skip,sortBy,sortOder
}
   
};

export default paginationSortingHelper;