import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-textPrimary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="py-12">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-textPrimary mb-4">
              Upload Your DJ Set
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drop your file and let our AI detect the perfect moments. 
              Supports audio and video files up to 4 hours and 4GB.
            </p>
          </div>
          <UploadZone />
        </div>
      </main>
    </div>
  );
};

export default Upload;