import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Range } from 'react-range'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import Headers from '../components/Headers'
import Footer from '../components/Footer'
import Products from '../components/products/Products'
import { AiFillStar, AiOutlineFilter } from 'react-icons/ai'
import { CiStar } from 'react-icons/ci'
import { BsFillGridFill } from 'react-icons/bs'
import { FaThList } from 'react-icons/fa'
import ShopProducts from '../components/products/ShopProducts'
import Pagination from '../components/Pagination'
import { price_range_product, query_products } from '../store/reducers/homeReducer'
import { useDispatch, useSelector } from 'react-redux'

const CategoryShops = () => {
    let [searchParams, setSearchParams] = useSearchParams()
    const category = searchParams.get('category')
    const { products, totalProduct, latest_product, priceRange, parPage } = useSelector(state => state.home)

    const dispatch = useDispatch()
    const [pageNumber, setPageNumber] = useState(1)
    const [styles, setStyles] = useState('grid')
    const [filter, setFilter] = useState(false)
    const [state, setState] = useState({ values: [priceRange.low, priceRange.high] })
    const [rating, setRatingQ] = useState('')
    const [sortPrice, setSortPrice] = useState('')

    useEffect(() => {
        dispatch(price_range_product())
    }, [])

    useEffect(() => {
        setState({
            values: [priceRange.low, priceRange.high === priceRange.low ? priceRange.high + 1 : priceRange.hight]
        })
    }, [priceRange])

    useEffect(() => {
        dispatch(
            query_products({
                low: state.values[0] || '',
                high: state.values[1] || '',
                category,
                rating,
                sortPrice,
                pageNumber
            })
        )
    }, [state.values[0], state.values[1], category, rating, pageNumber, sortPrice])

    const resetRating = () => {
        setRatingQ('')
        dispatch(query_products({
            low: state.values[0],
            high: state.values[1],
            category,
            rating: '',
            sortPrice,
            pageNumber
        }))
    }

    return (
        <div className='bg-[#F9F6EE] min-h-screen'>
            <Headers />
            
            {/* Elegant Banner Section */}
            <section className='relative h-[300px] overflow-hidden'>
                <div 
                    className='absolute inset-0 bg-cover bg-center filter brightness-50' 
                    style={{backgroundImage: "url('http://localhost:3000/images/banner/shop.gif')"}}
                ></div>
                <div className='relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4'>
                    <h1 className='text-4xl font-bold mb-4 tracking-wide'>Nusantara Culinary Shop</h1>
                    <div className='flex items-center gap-2 text-lg'>
                        <Link to='/' className='hover:text-[#FFC300] transition-colors'>Home</Link>
                        <MdOutlineKeyboardArrowRight />
                        <span className='text-[#FFC300]'>Products</span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className='py-16 container mx-auto px-4'>
                <div className='flex flex-wrap -mx-4'>
                    {/* Sidebar Filter */}
                    <div className={`w-full md:w-1/4 px-4 ${filter ? 'block' : 'hidden md:block'}`}>
                        <div className='bg-white shadow-lg rounded-lg p-6 border border-[#AFE1AF]'>
                            {/* Price Range Filter */}
                            <div className='mb-8'>
                                <h2 className='text-2xl font-semibold text-[#283046] mb-4'>Price Range</h2>
                                <Range
                                    step={1}
                                    min={priceRange.low}
                                    max={priceRange.high === priceRange.low ? priceRange.high + 1 : priceRange.hight}
                                    values={state.values}
                                    onChange={(values) => setState({ values })}
                                    renderTrack={({ props, children }) => (
                                        <div {...props} className='w-full h-2 bg-[#AFE1AF] rounded-full cursor-default'>
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div 
                                            {...props} 
                                            className='w-5 h-5 bg-[#FFC300] rounded-full shadow-md transform -translate-y-1/2'
                                        />
                                    )}
                                />
                                <div className='mt-4 text-center'>
                                    <span className='text-[#283046] font-medium'>
                                        ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                                    </span>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className='mb-8'>
                                <h2 className='text-2xl font-semibold text-[#283046] mb-4'>Customer Ratings</h2>
                                <div className='space-y-3'>
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <div 
                                            key={stars} 
                                            onClick={() => setRatingQ(stars)}
                                            className='flex items-center gap-2 cursor-pointer hover:bg-[#AFE1AF]/20 p-2 rounded-md transition-colors'
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                i < stars ? 
                                                    <AiFillStar key={i} className='text-orange-500 text-xl' /> : 
                                                    <CiStar key={i} className='text-orange-500 text-xl' />
                                            ))}
                                            <span className='text-[#283046] ml-2'>& above</span>
                                        </div>
                                    ))}
                                    <div 
                                        onClick={resetRating}
                                        className='flex items-center gap-2 cursor-pointer hover:bg-[#AFE1AF]/20 p-2 rounded-md transition-colors'
                                    >
                                        {[...Array(5)].map((_, i) => (
                                            <CiStar key={i} className='text-orange-500 text-xl' />
                                        ))}
                                        <span className='text-[#283046] ml-2'>Clear Filter</span>
                                    </div>
                                </div>
                            </div>

                            {/* Latest Products */}
                            <div className='hidden md:block'>
                                <Products title="Latest Products" products={latest_product} />
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className='w-full md:w-3/4 px-4'>
                        {/* Mobile Filter Toggle */}
                        <div className='md:hidden flex justify-between items-center mb-6'>
                            <button 
                                onClick={() => setFilter(!filter)} 
                                className='flex items-center gap-2 bg-[#FFC300] text-[#283046] px-4 py-2 rounded-md'
                            >
                                <AiOutlineFilter /> {filter ? 'Hide' : 'Show'} Filters
                            </button>
                        </div>

                        {/* Products Header */}
                        <div className='bg-white shadow-md rounded-lg p-4 mb-6 border border-[#AFE1AF] flex justify-between items-center'>
                            <h3 className='text-lg font-medium text-[#283046]'>
                                {totalProduct} Products Found
                            </h3>
                            <div className='flex items-center gap-4'>
                                <select 
                                    onChange={(e) => setSortPrice(e.target.value)}
                                    className='border border-[#AFE1AF] px-3 py-2 rounded-md text-[#283046] focus:border-[#FFC300] outline-none'
                                >
                                    <option value="">Sort By</option>
                                    <option value="low-to-high">Price: Low to High</option>
                                    <option value="high-to-low">Price: High to Low</option>
                                </select>
                                <div className='hidden md:flex items-center gap-2'>
                                    <button 
                                        onClick={() => setStyles('grid')} 
                                        className={`p-2 rounded-md ${styles === 'grid' ? 'bg-[#FFC300] text-[#283046]' : 'text-[#283046] hover:bg-[#AFE1AF]/20'}`}
                                    >
                                        <BsFillGridFill />
                                    </button>
                                    <button 
                                        onClick={() => setStyles('list')} 
                                        className={`p-2 rounded-md ${styles === 'list' ? 'bg-[#FFC300] text-[#283046]' : 'text-[#283046] hover:bg-[#AFE1AF]/20'}`}
                                    >
                                        <FaThList />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className='mb-8'>
                            <ShopProducts products={products} styles={styles} />
                        </div>

                        {/* Pagination */}
                        {totalProduct > parPage && (
                            <div className='flex justify-center'>
                                <Pagination 
                                    pageNumber={pageNumber} 
                                    setPageNumber={setPageNumber} 
                                    totalItem={totalProduct} 
                                    parPage={parPage} 
                                    showItem={Math.floor(totalProduct / parPage)} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default CategoryShops