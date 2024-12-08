import { getMyJobs } from '@/api/apiJobs';
import { useUser } from '@clerk/clerk-react'
import React ,{useEffect} from 'react'
import useFetch from '@/hooks/use-fetch';
import { BarLoader } from 'react-spinners';
import JobCard from './JobCard';

const CreatedJobs = () => {
    const {user} = useUser()
    const {
        loading: loadingCreatedJobs,
        data: createdJobs = [], // Initialize with an empty array
        fn: fnCreatedJobs,
      } = useFetch(getMyJobs, {
        recruiter_id: user.id,
      });
    
      useEffect(() => {
        fnCreatedJobs();
      }, []);
    
      if (loadingCreatedJobs) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
      }
  return (
    <div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return <JobCard key={job.id} job={job}
                onJobSaved={fnCreatedJobs}
                isMyJob
              />

            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
    </div>
  )
}

export default CreatedJobs
