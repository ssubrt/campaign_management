
export type CampaignStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export interface Campaign {
  _id?: string;
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: string[];
}

export interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export interface PersonalizedMessage {
  message: string;
}
