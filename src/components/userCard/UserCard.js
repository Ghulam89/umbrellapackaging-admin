import React from 'react'
import Button from '../Button'
const UserCard = ({
  onClick,
  user,
  unique,
  image
}) => {
  return (
    <div className=' bg-darkGray  w-full  p-4 rounded-md text-center'>
      <div className=' relative my-2  mx-auto'>
        <img src={image} className='mx-auto w-28  h-28  rounded-full' alt='' />
      </div>
      <h2>{user}</h2>
      <div className=' bg-lightGray rounded-md p-2 my-2 '>
        <p className='param'>ID: {unique}</p>
      </div>
      <div className=' flex  my-3 items-center gap-3 justify-center'>
        <Button label={`Edit User`} className={` bg-gulabi py-1`} />
        <Button onClick={onClick} label={`Delete`} className={` bg-red py-1`} />
      </div>





    </div>




  )


}

export default UserCard