
import { useState } from "react";
import { LinkedInProfile } from "@/types";
import { linkedInApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy, Sparkles } from "lucide-react";

const SAMPLE_PROFILES = [
  {
    name: "Sarah Johnson",
    job_title: "Senior Product Manager",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    summary: "Experienced product leader with 8+ years driving product strategy and execution. Passionate about creating user-centric solutions that drive business growth."
  },
  {
    name: "David Chen",
    job_title: "Software Engineering Manager",
    company: "CloudSphere",
    location: "Seattle, WA",
    summary: "Engineering leader with expertise in cloud infrastructure and distributed systems. Leading teams to build scalable solutions for enterprise clients."
  },
  {
    name: "Maria Rodriguez",
    job_title: "Digital Marketing Director",
    company: "GrowthBot Marketing",
    location: "New York, NY",
    summary: "Marketing executive specializing in growth strategies and performance marketing. Proven track record of driving customer acquisition and retention."
  }
];

export default function MessageGenerator() {
  const [profile, setProfile] = useState<LinkedInProfile>({
    name: "",
    job_title: "",
    company: "",
    location: "",
    summary: ""
  });
  
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLoadSample = (sampleProfile: LinkedInProfile) => {
    setProfile(sampleProfile);
  };

  const handleGenerateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name || !profile.job_title || !profile.company) {
      toast.error("Please fill in at least name, job title, and company");
      return;
    }
    
    try {
      setIsGenerating(true);
      setGeneratedMessage("");
      
      const result = await linkedInApi.generatePersonalizedMessage(profile);
      setGeneratedMessage(result.message);
      
      if (isOfflineMode) {
        toast.success("Generated message in offline mode");
      } else {
        toast.success("Message generated successfully");
      }
    } catch (error) {
      console.error(error);
      setIsOfflineMode(true);
      // Try again with fallback mechanism
      try {
        const result = await linkedInApi.generatePersonalizedMessage(profile);
        setGeneratedMessage(result.message);
        toast.success("Generated message using fallback mode");
      } catch (fallbackError) {
        toast.error("Failed to generate message");
        console.error(fallbackError);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      toast.success("Message copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">LinkedIn Message Generator</h1>
        <p className="text-muted-foreground">Create personalized outreach messages based on LinkedIn profiles</p>
      </div>
      
      <Separator />
      
      {isOfflineMode && (
        <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            Could not connect to the server. Using local message generation instead.
          </p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Enter LinkedIn profile details or use a sample</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateMessage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    value={profile.job_title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                    placeholder="e.g. Tech Corp"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary">Profile Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={profile.summary}
                    onChange={handleChange}
                    placeholder="Brief summary or about section from their profile"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-between pt-2">
                  <div className="space-x-2">
                    {SAMPLE_PROFILES.map((sampleProfile, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadSample(sampleProfile)}
                      >
                        Sample {index + 1}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                    className="bg-campaign-accent hover:bg-campaign-accent/90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Generated Message</CardTitle>
              <CardDescription>Personalized outreach message for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="border rounded-md p-4 h-full bg-muted/30 relative flex-1 min-h-[300px]">
                {generatedMessage ? (
                  <>
                    <p className="whitespace-pre-line">{generatedMessage}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleCopyMessage}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {isGenerating ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campaign-accent mb-3"></div>
                        <p>Generating your personalized message...</p>
                      </div>
                    ) : (
                      <p>Your generated message will appear here</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
