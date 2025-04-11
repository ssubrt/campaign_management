
import { Campaign, LinkedInProfile, PersonalizedMessage } from "@/types";

// Replace with your actual API URL when deploying
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://campaign-management-pi.vercel.app/";

// Mock data for campaigns when API is unavailable
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    _id: "mock-campaign-1",
    name: "Mock Outreach Campaign",
    description: "This is a sample campaign for demonstration purposes",
    status: "ACTIVE",
    leads: ["https://linkedin.com/in/john-doe", "https://linkedin.com/in/jane-smith"],
    accountIDs: ["acc123", "acc456"]
  },
  {
    _id: "mock-campaign-2",
    name: "Content Marketing Campaign",
    description: "Campaign targeting marketing professionals",
    status: "INACTIVE",
    leads: ["https://linkedin.com/in/mark-johnson"],
    accountIDs: ["acc789"]
  }
];

// Campaign API
export const campaignApi = {
  getAllCampaigns: async (): Promise<Campaign[]> => {
    try {
      console.log("Fetching campaigns from", API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/campaigns`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Return mock data when API is unavailable
      console.log("Returning mock campaign data");
      return MOCK_CAMPAIGNS;
    }
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching campaign:', error);
      // Return mock data when API is unavailable
      const mockCampaign = MOCK_CAMPAIGNS.find(c => c._id === id) || MOCK_CAMPAIGNS[0];
      return mockCampaign;
    }
  },

  createCampaign: async (campaign: Omit<Campaign, '_id'>): Promise<Campaign> => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });
      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating campaign:', error);
      // Return a mock response
      return {
        ...campaign,
        _id: `mock-${Date.now()}`
      };
    }
  },

  updateCampaign: async (id: string, campaign: Partial<Campaign>): Promise<Campaign> => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });
      if (!response.ok) {
        throw new Error('Failed to update campaign');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating campaign:', error);
      // Return a mock response
      const existingCampaign = MOCK_CAMPAIGNS.find(c => c._id === id) || MOCK_CAMPAIGNS[0];
      return {
        ...existingCampaign,
        ...campaign
      };
    }
  },

  deleteCampaign: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      // No need to return anything for delete operation
    }
  },

  toggleCampaignStatus: async (id: string, isActive: boolean): Promise<Campaign> => {
    try {
      const status = isActive ? "ACTIVE" : "INACTIVE";
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update campaign status');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating campaign status:', error);
      // Return a mock response
      const existingCampaign = MOCK_CAMPAIGNS.find(c => c._id === id) || MOCK_CAMPAIGNS[0];
      return {
        ...existingCampaign,
        status: isActive ? "ACTIVE" : "INACTIVE"
      };
    }
  }
};

// Mock message response
const MOCK_MESSAGE = "Hi [NAME], I noticed you're a [JOB_TITLE] at [COMPANY] based in [LOCATION]. Your experience with [SUMMARY_EXCERPT] is impressive! I'd love to connect and learn more about your work. Our platform CampaignCraft might help with your outreach efforts. Would you be open to a quick chat this week? Looking forward to connecting!";

// LinkedIn Message API
export const linkedInApi = {
  generatePersonalizedMessage: async (profile: LinkedInProfile): Promise<PersonalizedMessage> => {
    try {
      const response = await fetch(`${API_BASE_URL}/personalized-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      if (!response.ok) {
        throw new Error('Failed to generate personalized message');
      }
      return response.json();
    } catch (error) {
      console.error('Error generating message:', error);
      // Return a mock personalized message
      const summaryExcerpt = profile.summary?.split(' ').slice(0, 3).join(' ') || "your professional background";
      const mockMessage = MOCK_MESSAGE
        .replace('[NAME]', profile.name)
        .replace('[JOB_TITLE]', profile.job_title)
        .replace('[COMPANY]', profile.company)
        .replace('[LOCATION]', profile.location || 'your area')
        .replace('[SUMMARY_EXCERPT]', summaryExcerpt);
      
      return { message: mockMessage };
    }
  }
};
