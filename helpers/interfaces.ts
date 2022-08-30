export interface IJobs {
  jobTitle: string;
  companyName: string;
  shortDesc: string;
  postingDate: string;
  postedDate: string;
  jobLevels: string[];
  estimatedSalary: string;
  location: string;
  // companyLogoUrl: string;
  // companyZippiaOverallScore: number;

}
export interface IProps {
  fetchData: {
    jobs: IJobs[];
  }
}
