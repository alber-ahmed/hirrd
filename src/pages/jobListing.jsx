import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/ui/JobCard";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
import { State } from "country-state-city";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const JobListing = () => {
  const {user, isLoaded } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [page, setPage] = useState(1);

  const { fn: fnJobs, data: jobs = [], loading: loadingJobs } = useFetch(getJobs, { searchQuery, location, company_id, user_id: user?.id,});
  const { fn: fnCompanies, data: companies, loading: loadingCompanies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
      fnCompanies();
    }
  }, [isLoaded, searchQuery, location, company_id]);

  if (!isLoaded || loadingJobs || loadingCompanies) {
    return <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  const handlePaginationSelection = (pageNo) => {
    setPage(pageNo);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < Math.ceil(jobs.length / 6)) setPage(page + 1);
  };

  const totalPages = Math.ceil(jobs.length / 6);

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">Latest Jobs</h1>

      <form onSubmit={handleSearch} className="flex gap-2 items-center mb-3 h-14 w-full">
        <Input 
          type="text"
          placeholder="Search Jobs by title..."
          name="search-query"
          className='h-full flex-1 px-4 text-md'
        />
        <Button variant="blue" className="h-full sm:w-28" type="submit">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("US").map(({ name }) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(companies || []).map(({ name, id }) => (
                <SelectItem key={name} value={id}>{name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="destructive" className='sm:w-1/2' onClick={clearFilters}>Clear Filters</Button>
      </div>

      {loadingJobs && (<BarLoader className='mt-4' width={'100%'} color='#36d7b7' />)}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length ? (
            jobs.slice(page * 6 - 6, page * 6).map((job) => (
              <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
            ))
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
      
      {loadingJobs === false && jobs.length > 6 && (
        <Pagination className='mt-8'>
          <PaginationContent>
            <PaginationItem className='cursor-pointer'>
              <PaginationPrevious onClick={handlePrevious} />
            </PaginationItem>
            <PaginationItem className='cursor-pointer'>
              <PaginationLink onClick={() => handlePaginationSelection(1)} isActive={page === 1}>
                1
              </PaginationLink>
            </PaginationItem>
            {totalPages > 1 && (
              <PaginationItem className='cursor-pointer'>
                <PaginationLink onClick={() => handlePaginationSelection(2)} isActive={page === 2}>
                  2
                </PaginationLink>
              </PaginationItem>
            )}
            {totalPages > 2 && (
              <PaginationItem className='cursor-pointer'>
                <PaginationLink onClick={() => handlePaginationSelection(3)} isActive={page === 3}>
                  3
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem className='cursor-pointer'>
              <PaginationNext onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default JobListing;
