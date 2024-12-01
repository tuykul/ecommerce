import React from 'react'

const Search = ({ setParPage, setSearchValue, searchValue }) => {
    return (
        <div className='flex justify-between items-center'>
            <select 
                onChange={(e) => setParPage(parseInt(e.target.value))} 
                className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046] transition duration-300 ease-in-out hover:border-[#FFC300]'
            >
                <option value="5">5 per halaman</option>
                <option value="15">15 per halaman</option>
                <option value="25">25 per halaman</option>
            </select>
            <input 
                onChange={(e) => setSearchValue(e.target.value)} 
                value={searchValue} 
                className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046] transition duration-300 ease-in-out hover:border-[#FFC300]' 
                type="text" 
                placeholder='Cari...' 
            />
        </div>
    )
}

export default Search