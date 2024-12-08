import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './button'
import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react'
import { Briefcase, Heart, PenBox } from 'lucide-react'

const Header = () => {
  const [ShowSignIn, setShowSignIn] = useState(false)

  const [search, setSearch] = useSearchParams()

  const { user } = useUser()

  useEffect(() => {
    if (search.get('sign-in')) {
      setShowSignIn(true)
    }

  }, [search])


  const handleOverlayClick = (e) => {
    if (e.target == e.currentTarget) {
      setShowSignIn(false)
      setSearch({})
    }
  }
  return (
    <>
      <nav className='py-4 flex w-full justify-between  items-center'>
        <Link>
          <img src="/logo.png" alt="hirrd" className='h-20' />
        </Link>
        <div className='flex md:gap-8 gap-3 '>
          <SignedOut >
            <Button onClick={() => setShowSignIn(true)} variant="outline">Login</Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="./post-job">
                <Button
                  variant="destructive"
                  className="rounded-full "
                >
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>


              </Link>)}
            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label='My Jobs'
                  labelIcon={<Briefcase size={15} />}
                  href='/my-jobs'
                />
                <UserButton.Link
                  label='Saved Jobs'
                  labelIcon={<Heart size={15} />}
                  href='/saved-jobs'
                />
                <UserButton.Action label='manageAccount'/>
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
      {ShowSignIn && <div className='fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50' onClick={handleOverlayClick}>
        <SignIn forceRedirectUrl='/onboarding'  fallbackRedirectUrl='/onboarding'  />
        
      </div>}
    </>
  )
}

export default Header
