
import { useState } from "react";
import { Campaign } from "@/types";
import { campaignApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CampaignModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: (newCampaign?: Campaign) => void;
}

export default function CampaignModal({ campaign, isOpen, onClose }: CampaignModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Campaign, '_id'>>({
    name: campaign?.name || "",
    description: campaign?.description || "",
    status: campaign?.status || "ACTIVE",
    leads: campaign?.leads || [],
    accountIDs: campaign?.accountIDs || [],
  });

  const [leadsInput, setLeadsInput] = useState(campaign?.leads.join("\n") || "");
  const [accountsInput, setAccountsInput] = useState(campaign?.accountIDs.join("\n") || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLeadsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLeadsInput(e.target.value);
  };

  const handleAccountsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAccountsInput(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: value as "ACTIVE" | "INACTIVE" | "DELETED" 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Process leads and accountIDs from text areas
      const leads = leadsInput.split("\n").filter(line => line.trim() !== "");
      const accountIDs = accountsInput.split("\n").filter(line => line.trim() !== "");
      
      const campaignData = {
        ...formData,
        leads,
        accountIDs
      };
      
      let result;
      
      if (campaign?._id) {
        // Update existing campaign
        result = await campaignApi.updateCampaign(campaign._id, campaignData);
        toast.success("Campaign updated successfully");
      } else {
        // Create new campaign
        result = await campaignApi.createCampaign(campaignData);
        toast.success("Campaign created successfully");
      }
      
      // Pass the new/updated campaign back to the parent component
      onClose(result);
    } catch (error) {
      toast.error(campaign?._id ? "Failed to update campaign" : "Failed to create campaign");
      console.error(error);
      // Close without passing campaign
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{campaign?._id ? "Edit Campaign" : "Create Campaign"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="leads" className="text-right pt-2">
                Leads
              </Label>
              <div className="col-span-3 space-y-1">
                <Textarea
                  id="leads"
                  value={leadsInput}
                  onChange={handleLeadsChange}
                  placeholder="Enter LinkedIn profile URLs (one per line)"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">Enter one LinkedIn URL per line</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="accounts" className="text-right pt-2">
                Account IDs
              </Label>
              <div className="col-span-3 space-y-1">
                <Textarea
                  id="accounts"
                  value={accountsInput}
                  onChange={handleAccountsChange}
                  placeholder="Enter account IDs (one per line)"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">Enter one account ID per line</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-campaign-primary hover:bg-campaign-primary/90"
            >
              {isSubmitting ? "Saving..." : (campaign?._id ? "Update Campaign" : "Create Campaign")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
