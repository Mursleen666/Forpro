import React from 'react'

const NewsLatterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault()
    // TODO: connect to email subscription API
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now and get 20% off</p>
      <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui eos commodi at sed deserunt
        ratione ut, odit amet fugit ex deleniti, fugiat reprehenderit dolorum quod earum doloremque
        tempora numquam? Odit!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 p-3'
      >
        <input
          className='w-full sm:flex-1 outline-none border-b border-gray-400 py-1'
          type='email'
          placeholder='Enter your Email'
          required
        />
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default NewsLatterBox
