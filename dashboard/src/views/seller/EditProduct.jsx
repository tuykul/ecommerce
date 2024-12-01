import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { PropagateLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import { get_category } from '../../store/Reducers/categoryReducer'
import { get_product, messageClear, update_product, product_image_update } from '../../store/Reducers/productReducer'
import { BsImages } from 'react-icons/bs'
import { IoCloseSharp } from 'react-icons/io5'
import { overrideStyle } from '../../utils/utils'

const EditProduct = () => {
    const { productId } = useParams()
    const dispatch = useDispatch()
    const { categorys } = useSelector(state => state.category)
    const { product, loader, errorMessage, successMessage } = useSelector(state => state.product)
    
    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }))
    }, [])

    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        dispatch(get_product(productId))
    }, [productId])

    const [cateShow, setCateShow] = useState(false)
    const [category, setCategory] = useState('')
    const [allCategory, setAllCategory] = useState([])
    const [searchValue, setSearchValue] = useState('')
    
    const categorySearch = (e) => {
        const value = e.target.value
        setSearchValue(value)
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            setAllCategory(srcValue)
        } else {
            setAllCategory(categorys)
        }
    }

    const [imageShow, setImageShow] = useState([])

    const changeImage = (img, files) => {
        if (files.length > 0) {
            dispatch(product_image_update({
                oldImage: img,
                newImage: files[0],
                productId
            }))
        }
    }

    useEffect(() => {
        setState({
            name: product.name,
            description: product.description,
            discount: product.discount,
            price: product.price,
            brand: product.brand,
            stock: product.stock
        })
        setCategory(product.category)
        setImageShow(product.images)
    }, [product])

    useEffect(() => {
        if (categorys.length > 0) {
            setAllCategory(categorys)
        }
    }, [categorys])

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    const update = (e) => {
        e.preventDefault()
        const obj = {
            name: state.name,
            description: state.description,
            discount: state.discount,
            price: state.price,
            brand: state.brand,
            stock: state.stock,
            productId: productId
        }
        dispatch(update_product(obj))
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#F9F6EE] rounded-md border border-[#AFE1AF] shadow-sm'>
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#283046] text-xl font-semibold'>Edit Product</h1>
                    <Link 
                        className='bg-[#FFC300] hover:bg-yellow-500 text-[#283046] rounded-md px-7 py-2 my-2 transition-colors duration-300' 
                        to='/seller/dashboard/products'
                    >
                        Products
                    </Link>
                </div>
                <div>
                    <form onSubmit={update}>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#283046]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="name" className='text-[#283046]'>Product name</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.name} 
                                    type="text" 
                                    placeholder='product name' 
                                    name='name' 
                                    id='name' 
                                />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="brand" className='text-[#283046]'>Product brand</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.brand} 
                                    type="text" 
                                    placeholder='product brand' 
                                    name='brand' 
                                    id='brand' 
                                />
                            </div>
                        </div>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#283046]'>
                            <div className='flex flex-col w-full gap-1 relative'>
                                <label htmlFor="category" className='text-[#283046]'>Category</label>
                                <input 
                                    readOnly 
                                    onClick={() => setCateShow(!cateShow)} 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    value={category} 
                                    type="text" 
                                    placeholder='--select category--' 
                                    id='category' 
                                />
                                <div className={`absolute top-[101%] bg-[#F9F6EE] w-full z-10 border border-[#AFE1AF] rounded-md shadow-lg transition-all ${cateShow ? 'scale-100' : 'scale-0'}`}>
                                    <div className='w-full px-4 py-2 fixed'>
                                        <input 
                                            value={searchValue} 
                                            onChange={categorySearch} 
                                            className='px-3 py-1 w-full focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                            type="text" 
                                            placeholder='search' 
                                        />
                                    </div>
                                    <div className='pt-14'></div>
                                    <div className='flex justify-start items-start flex-col h-[200px] overflow-y-auto'>
                                        {
                                            allCategory.length > 0 && allCategory.map((c, i) => (
                                                <span 
                                                    key={i}
                                                    className={`px-4 py-2 w-full cursor-pointer hover:bg-[#FFC300] hover:text-[#283046] 
                                                    ${category === c.name ? 'bg-[#FFC300] text-[#283046]' : 'text-[#283046]'}`} 
                                                    onClick={() => {
                                                        setCateShow(false)
                                                        setCategory(c.name)
                                                        setSearchValue('')
                                                        setAllCategory(categorys)
                                                    }}
                                                >
                                                    {c.name}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="stock" className='text-[#283046]'>Stock</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.stock} 
                                    type="number" 
                                    min='0' 
                                    placeholder='product stock' 
                                    name='stock' 
                                    id='stock' 
                                />
                            </div>
                        </div>

                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#283046]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="price" className='text-[#283046]'>Price</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.price} 
                                    type="number" 
                                    placeholder='price' 
                                    name='price' 
                                    id='price' 
                                />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="discount" className='text-[#283046]'>Discount</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.discount} 
                                    type="number" 
                                    placeholder='%discount%' 
                                    name='discount' 
                                    id='discount' 
                                />
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-1 text-[#283046] mb-5'>
                            <label htmlFor="description" className='text-[#283046]'>Description</label>
                            <textarea 
                                rows={4} 
                                className='px-4 py-2 focus:border-[#FFC300] outline-none bg-white border border-[#AFE1AF] rounded-md text-[#283046]' 
                                onChange={inputHandle} 
                                value={state.description} 
                                placeholder='description' 
                                name='description' 
                                id='description'
                            ></textarea>
                        </div>
                        <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#283046] mb-4'>
                            {
                                (imageShow && imageShow.length > 0) && imageShow.map((img, i) => (
                                    <div key={i} className='border border-[#AFE1AF] rounded-md overflow-hidden'>
                                        <label className='h-[180px] block' htmlFor={`image-${i}`}>
                                            <img className='h-full w-full object-cover' src={img} alt={`Product image ${i + 1}`} />
                                        </label>
                                        <input 
                                            onChange={(e) => changeImage(img, e.target.files)} 
                                            type="file" 
                                            id={`image-${i}`} 
                                            className='hidden' 
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        <div className='flex'>
                            <button 
                                disabled={loader} 
                                className='bg-[#FFC300] hover:bg-yellow-500 w-[190px] text-[#283046] rounded-md px-7 py-2 mb-3 transition-colors duration-300 disabled:opacity-50'
                            >
                                {
                                    loader ? <PropagateLoader color='#283046' cssOverride={overrideStyle} /> : 'Update product'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProduct