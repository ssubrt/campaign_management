
import { Request, Response } from 'express';
import Campaign from '../models/Campaign';

// Get all campaigns (excluding DELETED)
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: 'DELETED' } }).lean().exec();
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single campaign by ID
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id).lean().exec();
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    const campaign = new Campaign({
      name,
      description,
      status: status || 'ACTIVE',
      leads: leads || [],
      accountIDs: accountIDs || [],
    });
    
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update campaign details
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    // Validate status if provided
    if (status && !['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be ACTIVE or INACTIVE' });
    }
    
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(status && { status }),
        ...(leads && { leads }),
        ...(accountIDs && { accountIDs }),
      },
      { new: true }
    ).lean().exec();
    
    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft delete (set status to DELETED)
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const deletedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'DELETED' },
      { new: true }
    ).lean().exec();
    
    if (!deletedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
