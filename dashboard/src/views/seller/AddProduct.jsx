import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsImages } from 'react-icons/bs'
import { IoCloseSharp } from 'react-icons/io5'
import { FaUtensils } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { PropagateLoader } from 'react-spinners'
import { overrideStyle } from '../../utils/utils'
import { get_category } from '../../store/Reducers/categoryReducer'
import { add_product, messageClear } from '../../store/Reducers/productReducer'

const AddProduct = () => {
    const dispatch = useDispatch()
    const { categorys } = useSelector(state => state.category)
    const { successMessage, errorMessage, loader } = useSelector(state => state.product)
    const { userInfo } = useSelector(state => state.auth)
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
    const [images, setImages] = useState([])
    const [imageShow, setImageShow] = useState([])
    const inmageHandle = (e) => {
        const files = e.target.files
        const length = files.length;

        if (length > 0) {
            setImages([...images, ...files])
            let imageUrl = []

            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) })
            }
            setImageShow([...imageShow, ...imageUrl])
        }
    }

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow
            let tempImages = images

            tempImages[index] = img
            tempUrl[index] = { url: URL.createObjectURL(img) }
            setImageShow([...tempUrl])
            setImages([...tempImages])
        }
    }

    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i)
        const filterImageUrl = imageShow.filter((img, index) => index !== i)
        setImages(filterImage)
        setImageShow(filterImageUrl)
    }

    useEffect(() => {
        setAllCategory(categorys)
    }, [categorys])

    const add = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', state.name)
        formData.append('description', state.description)
        formData.append('price', state.price)
        formData.append('stock', state.stock)
        formData.append('category', category)
        formData.append('discount', state.discount)
        formData.append('shopName', userInfo?.shopInfo?.shopName)
        formData.append('brand', state.brand)
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i])
        }
        dispatch(add_product(formData))
    }
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            setState({
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: ""
            })
            setImageShow([])
            setImages([])
            setCategory('')

        }
    }, [successMessage, errorMessage])
    
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#F9F6EE] rounded-md shadow-md'>
                <div className='flex justify-between items-center pb-4 border-b border-[#AFE1AF]'>
                    <div className='flex items-center gap-3'>
                        <FaUtensils className='text-2xl text-[#FFC300]' />
                        <h1 className='text-[#283046] text-xl font-semibold'>Tambah Menu Baru</h1>
                    </div>
                    <Link className='bg-[#FFC300] hover:bg-[#E57F84] text-[#283046] rounded-md px-7 py-2 transition duration-300' 
                          to='/seller/dashboard/products'>
                        Daftar Menu
                    </Link>
                </div>

                <form onSubmit={add} className='mt-5'>
                    {/* Informasi Dasar Menu */}
                    <div className='bg-white p-4 rounded-md mb-5 shadow-sm'>
                        <h2 className='text-[#283046] font-medium mb-3'>Informasi Dasar</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-[#283046] font-medium' htmlFor="name">Nama Menu</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.name} 
                                    type="text" 
                                    placeholder='Contoh: Nasi Goreng Spesial' 
                                    name='name' 
                                    id='name' 
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-[#283046] font-medium' htmlFor="brand">Nama Toko/Brand</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.brand} 
                                    type="text" 
                                    placeholder='Contoh: Warung Bu Siti' 
                                    name='brand' 
                                    id='brand' 
                                />
                            </div>
                        </div>

                        <div className='mt-4'>
                            <label className='text-[#283046] font-medium' htmlFor="description">Deskripsi Menu</label>
                            <textarea 
                                rows={3} 
                                className='w-full px-4 py-2 mt-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' 
                                onChange={inputHandle} 
                                value={state.description} 
                                placeholder='Deskripsikan menu Anda secara detail...' 
                                name='description' 
                                id='description'
                            ></textarea>
                        </div>
                    </div>

                    {/* Kategori dan Stok */}
                    <div className='bg-white p-4 rounded-md mb-5 shadow-sm'>
                        <h2 className='text-[#283046] font-medium mb-3'>Kategori & Ketersediaan</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1 relative'>
                                <label className='text-[#283046] font-medium' htmlFor="category">Kategori Menu</label>
                                <input 
                                    readOnly 
                                    onClick={() => setCateShow(!cateShow)} 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046] cursor-pointer' 
                                    value={category} 
                                    type="text" 
                                    placeholder='Pilih kategori menu' 
                                    id='category' 
                                />
                                {/* Dropdown kategori */}
                                <div className={`absolute top-[101%] bg-white w-full z-50 shadow-lg rounded-md transition-all ${cateShow ? 'scale-100' : 'scale-0'}`}>
                                    <div className='p-2 border-b border-[#AFE1AF]'>
                                        <input 
                                            value={searchValue} 
                                            onChange={categorySearch} 
                                            className='px-3 py-1 w-full focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' 
                                            type="text" 
                                            placeholder='Cari kategori...' 
                                        />
                                    </div>
                                    <div className='max-h-[200px] overflow-y-auto'>
                                        {allCategory.map((c, i) => (
                                            <div 
                                                key={i}
                                                className={`px-4 py-2 hover:bg-[#FFC300] hover:text-white cursor-pointer ${category === c.name ? 'bg-[#FFC300] text-white' : 'text-[#283046]'}`}
                                                onClick={() => {
                                                    setCateShow(false)
                                                    setCategory(c.name)
                                                    setSearchValue('')
                                                    setAllCategory(categorys)
                                                }}
                                            >
                                                {c.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-[#283046] font-medium' htmlFor="stock">Stok</label>
                                <input 
                                    className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' 
                                    onChange={inputHandle} 
                                    value={state.stock} 
                                    type="number" 
                                    min='0' 
                                    placeholder='Jumlah tersedia' 
                                    name='stock' 
                                    id='stock' 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Harga */}
                    <div className='bg-white p-4 rounded-md mb-5 shadow-sm'>
                        <h2 className='text-[#283046] font-medium mb-3'>Informasi Harga</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-[#283046] font-medium' htmlFor="price">Harga Menu</label>
                                <div className='relative'>
                                    <span className='absolute left-3 top-2 text-[#283046]'>Rp</span>
                                    <input 
                                        className='px-4 py-2 pl-10 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' 
                                        onChange={inputHandle} 
                                        value={state.price} 
                                        type="number" 
                                        placeholder='0' 
                                        name='price' 
                                        id='price' 
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-[#283046] font-medium' htmlFor="discount">Diskon</label>
                                <div className='relative'>
                                    <input 
                                        min='0'
                                        max='100'
                                        className='px-4 py-2 pr-10 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' 
                                        onChange={inputHandle} 
                                        value={state.discount} 
                                        type="number" 
                                        placeholder='0' 
                                        name='discount' 
                                        id='discount' 
                                    />
                                    <span className='absolute right-3 top-2 text-[#283046]'>%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gambar Menu */}
                    <div className='bg-white p-4 rounded-md mb-5 shadow-sm'>
                        <h2 className='text-[#283046] font-medium mb-3'>Foto Menu</h2>
                        <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4'>
                            {imageShow.map((img, i) => (
                                <div key={i} className='h-[180px] relative rounded-md overflow-hidden'>
                                    <label htmlFor={i}>
                                        <img className='w-full h-full object-cover' src={img.url} alt="" />
                                    </label>
                                    <input onChange={(e) => changeImage(e.target.files[0], i)} type="file" id={i} className='hidden' />
                                    <span 
                                        onClick={() => removeImage(i)} 
                                        className='p-2 z-10 cursor-pointer bg-[#E57F84] hover:bg-[#E57F84]/80 text-white absolute top-1 right-1 rounded-full transition duration-300'
                                    >
                                        <IoCloseSharp />
                                    </span>
                                </div>
                            ))}
                            <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border-2 border-dashed border-[#AFE1AF] hover:border-[#FFC300] rounded-md transition duration-300' htmlFor="image">
                                <span className='text-3xl text-[#AFE1AF]'><BsImages /></span>
                                <span className='text-[#283046] mt-2'>Pilih Foto Menu</span>
                            </label>
                            <input multiple onChange={inmageHandle} className='hidden' type="file" id='image' />
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <div className='flex justify-end'>
                        <button 
                            disabled={loader} 
                            className='bg-[#FFC300] hover:bg-[#E57F84] text-[#283046] rounded-md px-7 py-2 font-medium transition duration-300 min-w-[150px]'
                        >
                            {loader ? <PropagateLoader color='#283046' cssOverride={overrideStyle} /> : 'Tambah Menu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct