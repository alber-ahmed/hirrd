import Header from '@/components/ui/header';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const AppLayout = () => {
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    const updateTitle = () => {
      const path = location.pathname;
      if (path === '/') {
        document.title = 'Hirrd | Home';
      } else if (path === '/jobs') {
        document.title = 'Hirrd | Jobs';
      } else if (path === '/onboarding') {
        document.title = 'Hirrd | Onboarding';
      } else if (path.startsWith('/job/')) {
        document.title = 'Hirrd | Job Details';
      } else if (path === '/post-job') {
        document.title = 'Hirrd | Post Job';
      } else if (path === '/saved-jobs') {
        document.title = 'Hirrd | Saved Jobs';
      } else if (path === '/my-jobs') {
        document.title = 'Hirrd | My Jobs';
      }
    };

    // Update the title based on the current route
    updateTitle();
  }, [location]); // Runs when the route location changes

  return (
    <div>
      <div className="grid-background"></div>
      <main className='min-h-screen container mx-auto px-8 w-full'>
        <Header />
        <Outlet />
      </main>
      {/* <div className="p-10 mt-10 text-center bg-gray-800">Made with 💖 by Alber Ahmed</div> */}
      <footer className="bg-gray-900 text-gray-200 py-7 mt-8">
  <div className="container mx-auto flex flex-col md:flex-row justify-center items-center">
    <div className="text-xs sm:text-sm text-center md:text-left">
      &copy; {new Date().getFullYear()} Hirrd. All rights reserved. | Check our <a href="/" className="text-white underline">Home</a> for more info.
    </div>
  </div>
</footer>


    </div>
  );
};

export default AppLayout;
