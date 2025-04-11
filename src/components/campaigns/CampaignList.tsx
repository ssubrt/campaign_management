
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/types";
import { campaignApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Edit2, 
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import CampaignModal from "./CampaignModal";

export default function CampaignList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);

  const { data: campaigns = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignApi.getAllCampaigns,
    retry: 1,
    onSettled: (data, error) => {
      if (error) {
        toast.error("Failed to load campaigns. Showing local data instead.");
      }
    }
  });

  // Combine server data with local data
  useEffect(() => {
    // If we have server data, use it as the source of truth
    if (campaigns.length > 0 && !isError) {
      setLocalCampaigns(campaigns);
      // Save to localStorage as backup
      localStorage.setItem('localCampaigns', JSON.stringify(campaigns));
    } else if (isError) {
      // If server error, try to load from localStorage
      const savedCampaigns = localStorage.getItem('localCampaigns');
      if (savedCampaigns) {
        setLocalCampaigns(JSON.parse(savedCampaigns));
      } else {
        // If no saved campaigns, use mock data
        setLocalCampaigns(campaigns);
      }
    }
  }, [campaigns, isError]);

  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setIsModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await campaignApi.deleteCampaign(id);
      toast.success("Campaign deleted successfully");
      
      // Update local state immediately for better UX
      setLocalCampaigns(prev => prev.filter(camp => camp._id !== id));
      
      // Try to refresh from server
      refetch();
    } catch (error) {
      toast.error("Failed to delete campaign");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: string, isCurrentlyActive: boolean) => {
    try {
      const updatedCampaign = await campaignApi.toggleCampaignStatus(id, !isCurrentlyActive);
      toast.success(`Campaign ${!isCurrentlyActive ? 'activated' : 'deactivated'} successfully`);
      
      // Update local state immediately
      setLocalCampaigns(prev => 
        prev.map(camp => camp._id === id ? updatedCampaign : camp)
      );
      
      // Try to refresh from server
      refetch();
    } catch (error) {
      toast.error("Failed to update campaign status");
      console.error(error);
    }
  };

  const handleCloseModal = (newCampaign?: Campaign) => {
    setIsModalOpen(false);
    
    // If we have a new campaign, add it to local state first for immediate feedback
    if (newCampaign) {
      setLocalCampaigns(prev => [newCampaign, ...prev]);
    }
    
    // Then try to refresh from server
    refetch();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading campaigns...</div>;
  }

  // Use localCampaigns (which includes local and server data) for rendering
  const displayCampaigns = localCampaigns.length > 0 ? localCampaigns : campaigns;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage your outreach campaigns</p>
        </div>
        <Button onClick={handleCreateCampaign} className="bg-campaign-primary hover:bg-campaign-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      <Separator />
      
      {isError && (
        <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            Could not connect to the server. Your changes will be saved locally and synced when the server is available.
          </p>
        </div>
      )}
      
      {displayCampaigns.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-md">
          <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">Create your first campaign to get started</p>
          <Button onClick={handleCreateCampaign} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayCampaigns.map((campaign) => (
            <Card key={campaign._id} className="overflow-hidden fade-in">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{campaign.name}</CardTitle>
                  <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Leads</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.leads.length} LinkedIn profiles
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Accounts</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.accountIDs.length} accounts for outreach
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between border-t">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditCampaign(campaign)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteCampaign(campaign._id as string)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus(campaign._id as string, campaign.status === "ACTIVE")}
                  className={
                    campaign.status === "ACTIVE"
                      ? "text-campaign-inactive hover:text-campaign-inactive/90 hover:bg-campaign-inactive/10"
                      : "text-campaign-active hover:text-campaign-active/90 hover:bg-campaign-active/10"
                  }
                >
                  {campaign.status === "ACTIVE" ? (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CampaignModal 
          campaign={selectedCampaign} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}
