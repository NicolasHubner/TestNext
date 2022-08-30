import { useEffect, useState } from 'react'
import styles from './styles.module.css';
import { divisableDays, show, hide, nowData, noSorted, sorted } from '../../../helpers/constants';
import { IJobs, IProps } from '../../../helpers/interfaces';

// I verified that the shortDesc key did not exist, but I left it in my interface already
// With the description I could make my stylization more elaborate according to the past reference.

export default function Jobs(props: IProps) {
  const { fetchData } = props;
  // console.log(fetchData.jobs)
  const [buttonSevenDays, setButtonSevenDays] = useState(false);
  const [sort, setSort] = useState(false);
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [filterJobs, setFilter] = useState(jobs)

  useEffect(() => {
    const settingJobs = async () => {
      const data = await fetchData;
      setJobs(data.jobs);
      setFilter(data.jobs.slice(0, 10))
    }
    settingJobs();
  }, [fetchData]);

  const handleButton7Days = () => {
    if (buttonSevenDays === false) {
      const filterJobs = jobs.filter((job) => {
        const date = new Date(job.postingDate);
        return ((nowData - date.getTime()) / divisableDays) <= 7
      })
      setFilter(filterJobs.slice(0, 10));
      setButtonSevenDays(true);
    }
    if (buttonSevenDays === true) {
      setFilter(jobs.slice(0, 10));
      setButtonSevenDays(false);
      setSort(false);
    }
  }

  // Functions used to sort the Jobs list
  const sortFunction = (params: IJobs[]) => {
    const sortJobs = params.sort(function (a, b) {
      if (a.companyName < b.companyName) { return -1; }
      if (a.companyName > b.companyName) { return 1; }
      return 0;
    })
    return sortJobs
  }
  const handleButtonSort = () => {
    if (sort === false) {
      setFilter(sortFunction(filterJobs).slice(0, 10));
      setSort(true);
    }
    if (sort === true) {
      setFilter(jobs.slice(0, 10));
      setSort(false);
      setButtonSevenDays(false);
    }
  }
  return (
    <section className={styles.SectionContainer}>
      <div className={styles.Header}>
        <div className={styles.ButtonContainer}>
          <h3>{buttonSevenDays ? hide : show}</h3>
          <button className={styles.Button} type='button' onClick={() => handleButton7Days()}><b>Click Here</b></button>
        </div>
        <div className={styles.ButtonContainer}>
          <h3>{sort ? sorted : noSorted} </h3>
          <button className={styles.Button} type='button' onClick={() => handleButtonSort()}><b>Click Here</b></button>
        </div>
      </div>
      <section className={styles.ContainerJobs}>
        {filterJobs.length > 0 ? filterJobs.map((job, index) => {
          return (
            <>
            {/* <img src={job.companyLogoUrl} alt={job.jobTitle}/> */}
              <div className={styles.Card} key={index}>
                <div className={styles.TitleContainer}>
                  <h3 style={{ marginBottom: 0 }}>{job.jobTitle}</h3>
                  <span style={{ fontSize: 12 }}>{`in ${job.location}`}</span>
                </div>
                <p>{job.companyName}</p>
                {job.shortDesc && <p>{job.shortDesc}</p>}
                <div className={styles.levels}>{job.jobLevels.map((level, index) => <h4 style={{ marginRight: 5 }} key={index}>{level}</h4>)}</div>
                <div className={styles.SalaryDate}>
                  <h5>{job.estimatedSalary}</h5>
                  <h5>{job.postedDate}</h5>
                </div>
              </div>
            </>
          )
        }) : <div className={styles.Loader}></div>}
      </section>
    </section>
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch('https://www.zippia.com/api/jobs/', {
    method: 'POST',
    body: JSON.stringify({
      companySkills: true,
      dismissedListingHashes: [],
      fetchJobDesc: true,
      jobTitle: "Business Analyst",
      locations: [],
      numJobs: 20,
      previousListingHashes: [],
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const fetchData = await res.json();

  // Pass data to the page via props
  return { props: { fetchData } }
}