import { Edit3, Eye, Sparkles, Clock, Layout, Zap } from "lucide-react";

const features = [
  {
    icon: Edit3,
    title: "Distraction-Free",
    description: "A clean canvas that lets your thoughts flow without interruption.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your formatted text in real-time as you write with Markdown.",
  },
  {
    icon: Sparkles,
    title: "Beautiful Typography",
    description: "Carefully crafted fonts that make reading and writing a pleasure.",
  },
  {
    icon: Clock,
    title: "Reading Time",
    description: "Know exactly how long your piece takes to read at a glance.",
  },
  {
    icon: Layout,
    title: "Organized",
    description: "Keep all your documents neatly arranged and easily accessible.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant save and seamless performance, always ready when you are.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
            Everything you need to write
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Simple tools that stay out of your way, so you can focus on what matters most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
