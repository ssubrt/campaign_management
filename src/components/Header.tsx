
import { Link } from "react-router-dom";
import { MessageSquare, Users } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-campaign-primary" />
            <span className="text-xl font-bold">CampaignCraft</span>
          </Link>
        </div>
        <div className="flex items-center justify-between flex-1">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Campaigns
            </Link>
            <Link
              to="/message-generator"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Message Generator
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">TeamID</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
