import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <BarLoader className='mb-4 ' width={'100%'} color='#36d7b7' />
  }
  const navigate = useNavigate();
  const handleRoleSelection = async (role) => {
    await user.update({
      unsafeMetadata: { role },
    }).then(() => {
      navigate(role === "recruiter" ? "/post-job" : "/jobs")
    })
      .catch((err) => {
        console.log("Error in updating role:", err)
      })
  }

  useEffect((role) => {
    if (user?.unsafeMetadata?.role){
      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    }
  
  }, [user])
  

  return <div className='flex flex-col justify-between items-center mt-32'>
    <h1 className='gradient-title text-7xl font-extrabold tracking-tighter sm:text-8xl'>I am...</h1>
    <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
      <Button onClick={() => handleRoleSelection("candidate")} variant="blue" className="h-36 text-2xl">Candidate</Button>
      <Button onClick={() => handleRoleSelection("recruiter")} variant="destructive" className="h-36 text-2xl">Recruiter</Button>
    </div>
  </div>
}

export default Onboarding
