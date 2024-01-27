import React from 'react'
import "@styles/Home_Banner.scss"
const Banner = () => {
  return (
    <div className='banner'>
        <div className='banner_text'>
        <h1>Discover Unique Artworks</h1>
        <p>"Discover and buy stunning art. Upload your creations and explore unique pieces by talented artists. <br/>Your one-stop destination for art lovers and creators alike"</p>
        </div>
       
        <img src='/assets/register.jpg' alt='Banner' className='banner_img'/>
    </div>
  )
}

export default Banner