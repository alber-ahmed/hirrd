import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery, user_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
      .from("jobs")
      .select("*, company:companies(name,logo_url), saved: saved_jobs(id)")
      .eq("saved_jobs.user_id", user_id); // Filter by user_id

  if (location) {
      query = query.eq("location", location);
  }
  if (company_id) {
      query = query.eq("company_id", company_id);
  }
  if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) {
      console.error("Error fetching Jobs:", error);
      return null;
  }
  return data;
}


export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);
  if (alreadySaved) {
      const { data, error: deleteError } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("job_id", saveData.job_id)
          .eq("user_id", saveData.user_id); // Ensure scoped to user_id
      if (deleteError) {
          console.error("Error Deleting Saved Job:", deleteError);
          return null;
      }
      return data;
  } else {
      const { data, error: insertError } = await supabase
          .from("saved_jobs")
          .insert({
              user_id: saveData.user_id, // Ensure user_id is passed correctly
              job_id: saveData.job_id,
          })
          .select();
      if (insertError) {
          console.error("Error Inserting Jobs:", insertError);
          return null;
      }
      return data;
  }
}


export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url),applications: applications(*)")
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error Fetching Job", error);
    return null;
  }

  return data;
}
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Job", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token, {user_id}) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, company:companies(name, logo_url))")
    .eq("user_id", user_id)

  if (error) {
    console.error("Error Fetching Saved Jobs", error);
    return null;
  }

  return data;
}
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*,  company:companies(name, logo_url))")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error Fetching My Jobs", error);
    return null;
  }

  return data;
}
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Deleting Job", error);
    return null;
  }

  return data;
}

