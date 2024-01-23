'use client'

import "@styles/Navbar.scss"

import { Menu, Person, Search, ShoppingCart } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from "next/navigation"


const NavBar = () => {
  
    const {data: session} = useSession()
    const user = session?.user
   
const [dropDownMenu, setDropDownMenu] = useState(false);
  const handleLogout = async() => {
    signOut({callbackUrl: "/login"})
  }

  const [query, setQuery] = useState('')
 
  const router = useRouter()
  const searchWork = async () => {
    router.push(`/search/${query}`)
  }
  return (
    
    <nav className='navbar'>
<a href='/'>
    <img src="/assets/logo.png" alt="logo" />
</a>
<div className="navbar_search">
<input type='text' placeholder='Search...' value={query} onChange={(e) => setQuery(e.target.value)}/>
        <IconButton disabled={query === ""}  onClick={searchWork}>
          <Search sx={{ color: "red" }}/>
        </IconButton>
</div>
<div className="navbar_right">


{user && (
          <a href="/cart" className="cart">
            <ShoppingCart sx={{ color: "gray" }}/>
            <span>(2)</span>
          </a>
        )
        }
    <button className='navbar_right_account' onClick= {() => setDropDownMenu(!dropDownMenu)}>
     {user && ( <Menu sx={{ color: "gray" }}/>)} 
        {!user ? (<Person sx={{ color: "gray" }}/>) : (<img src={`data:image/*;base64,${Buffer.from(user.profileImage.data).toString('base64')}`} alt="profile" style={{objectFit: "fill" , borderRadius: "50%", height:"40px"}}/>)}
    </button>
{dropDownMenu && !user && (
    <div className='navbar_right_accountmenu'>
        <Link href="/login">Login</Link>
        <Link href="/register">SignUP</Link>
    </div>
)}
{dropDownMenu && user && (
          <div className='navbar_right_accountmenu'>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/order">Orders</Link>
            <Link href={`/shop?id=${user._id}`}>Your Shop</Link>
            <Link href="/create-work">Sell Your Work</Link>
            <a onClick={handleLogout}>Log Out</a>
          </div>
        )}

</div>
    </nav>
  )
}

export default NavBar