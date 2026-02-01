import { Button } from "@/components/ui/button";
import { ArrowRight, Feather } from "lucide-react";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <section className="py-24 paper-texture relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Feather className="w-10 h-10 text-accent mx-auto" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-6">
            Ready to start writing?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Join thousands of writers who have found their creative flow with Echowrite. 
            Your words are waiting to be written.
          </p>

          <Link to="/write">
            <Button variant="hero" size="xl" className="group">
              Open the Editor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            No account required • Free forever
          </p>
        </div>
      </div>
    </section>
  );
};
