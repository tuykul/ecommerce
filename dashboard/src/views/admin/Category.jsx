import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { PropagateLoader } from 'react-spinners'
import { overrideStyle } from '../../utils/utils'
import { GrClose } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import { BsImage } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import Search from '../components/Search'
import { categoryAdd, messageClear, get_category } from '../../store/Reducers/categoryReducer'

const Category = () => {
    const dispatch = useDispatch()
    const { loader, successMessage, errorMessage, categorys } = useSelector(state => state.category)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] = useState(false)
    const [imageShow, setImage] = useState('')
    const [state, setState] = useState({
        name: '',
        image: ''
    })

    const imageHandle = (e) => {
        let files = e.target.files
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]))
            setState({
                ...state,
                image: files[0]
            })
        }
    }
    const add_category = (e) => {
        e.preventDefault()
        dispatch(categoryAdd(state))
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
                name: '',
                image: ''
            })
            setImage('')
        }
    }, [successMessage, errorMessage])

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_category(obj))
    }, [searchValue, currentPage, parPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex lg:hidden justify-between items-center mb-5 p-4 bg-[#F9F6EE] rounded-md'>
                <h1 className='text-[#283046] font-semibold text-lg'>Kategori</h1>
                <button onClick={() => setShow(true)} className='bg-[#FFC300] shadow-lg hover:shadow-[#FFC300]/50 px-4 py-2 cursor-pointer text-[#283046] rounded-sm text-sm'>Tambah</button>
            </div>
            <div className='flex flex-wrap w-full'>
                <div className='w-full lg:w-7/12'>
                    <div className='w-full p-4  bg-[#F9F6EE] rounded-md'>
                        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                        <div className='relative overflow-x-auto'>
                            <table className='w-full text-sm text-left text-[#283046]'>
                                <thead className='text-sm text-[#283046] uppercase border-b border-[#AFE1AF]'>
                                    <tr>
                                        <th scope='col' className='py-3 px-4'>No</th>
                                        <th scope='col' className='py-3 px-4'>Gambar</th>
                                        <th scope='col' className='py-3 px-4'>Nama</th>
                                        <th scope='col' className='py-3 px-4'>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        categorys.map((d, i) => <tr key={i}>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <img className='w-[45px] h-[45px]' src={d.image} alt="" />
                                            </td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <span>{d.name}</span>
                                            </td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <div className='flex justify-start items-center gap-4'>
                                                    <Link className='p-[6px] bg-[#AFE1AF] rounded hover:shadow-lg hover:shadow-[#AFE1AF]/50'><FaEdit /></Link>
                                                    <Link className='p-[6px] bg-[#E57F84] rounded hover:shadow-lg hover:shadow-[#E57F84]/50'><FaTrash /></Link>
                                                </div>
                                            </td>
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={50}
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    </div>
                </div>
                <div className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? 'right-0' : '-right-[340px]'} z-[9999] top-0 transition-all duration-500`}>
                    <div className='w-full pl-5'>
                        <div className='bg-[#F9F6EE] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#283046]'>
                            <div className='flex justify-between items-center mb-4'>
                                <h1 className='text-[#283046] font-semibold text-xl'>Tambah Kategori</h1>
                                <div onClick={() => setShow(false)} className='block lg:hidden cursor-pointer'><GrClose className='text-[#283046]' /></div>
                            </div>
                            <form onSubmit={add_category}>
                                <div className='flex flex-col w-full gap-1 mb-3'>
                                    <label htmlFor="name">Nama Kategori</label>
                                    <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]' type="text" id='name' name='category_name' placeholder='Nama kategori' required />
                                </div>
                                <div>
                                    <label className='flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-[#FFC300] w-full border-[#AFE1AF]' htmlFor="image">
                                        {
                                            imageShow ? <img className='w-full h-full' src={imageShow} /> : <>
                                                <span><BsImage /></span>
                                                <span>Pilih Gambar</span>
                                            </>
                                        }
                                    </label>
                                </div>
                                <input onChange={imageHandle} className='hidden' type="file" name='image' id='image' required />
                                <div className='mt-4'>
                                    <button disabled={loader ? true : false} className='bg-[#FFC300] w-full hover:shadow-[#FFC300]/20 hover:shadow-lg text-[#283046] rounded-md px-7 py-2 mb-3'>
                                        {
                                            loader ? <PropagateLoader color='#283046' cssOverride={overrideStyle} /> : 'Tambah Kategori'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category