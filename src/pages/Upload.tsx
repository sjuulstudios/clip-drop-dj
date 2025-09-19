import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";

const Upload = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
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