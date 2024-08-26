import React from 'react';

const navbar = () => {
  return (
    <nav className="flex items-center p-3 gap-2 border-b border-black">  {/* Added border styles */}
      <img src="https://i.pinimg.com/564x/21/dd/55/21dd5538257fd77e17b35b39d9d903ea.jpg" alt="yha image" className='h-5 w-5 rounded-full ml-5' />
      <h1 className='font-bold font-size-1 text-xs'>TODO</h1>
    </nav>
  );
};

export default navbar;