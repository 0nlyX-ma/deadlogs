import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Upload, FileCode, BarChart3, DollarSign, 
  Shield, Check, Github, Twitter, Mail,
  Terminal, Lock, Zap, TrendingDown, Code2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import LogUpload from '@/components/LogUpload';
import type { AppView } from '@/App';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo('.hero-title',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.hero-subtitle',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo('.hero-cta',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.6 }
      );

      // Feature cards animation
      gsap.fromTo('.feature-card',
        { y: 80, opacity: 0, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      );

      // How it works steps
      gsap.fromTo('.step-card',
        { y: 100, opacity: 0, rotateX: 12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          }
        }
      );

      // Pricing cards
      gsap.fromTo('.pricing-card',
        { y: 60, opacity: 0, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: pricingRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollToUpload = () => {
    const element = document.getElementById('upload-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Paste or Upload',
      description: 'Drag and drop log files or paste directly. Supports Nginx, CloudWatch, Express, and custom formats.',
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      title: 'Auto Parse',
      description: 'Automatically extracts endpoints, methods, status codes, and response times from your logs.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Health Score',
      description: 'Classify endpoints as Dead, Low Traffic, or Active based on call frequency and recency.',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Cost Estimate',
      description: 'Calculate monthly waste from unused endpoints and potential annual savings.',
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Export Code',
      description: 'Generate deprecation middleware in Node.js, Python, or Go with one click.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '100% Private',
      description: 'All processing happens in your browser. No logs ever leave your device.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Paste or Upload Logs',
      description: 'Drag a file or paste log lines. We automatically detect the format—Nginx, CloudWatch, Express, or JSON.',
    },
    {
      number: '02',
      title: 'Extract Endpoints',
      description: 'We parse methods, routes, and status codes locally in your browser. No data leaves your device.',
    },
    {
      number: '03',
      title: 'Review & Act',
      description: 'Filter by health score, estimate cost impact, and export deprecation code for your stack.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for side projects',
      features: [
        '3 projects',
        '1,000 analyses/month',
        'Manual log upload',
        'CSV export',
        '7-day history',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For professional developers',
      features: [
        'Unlimited projects',
        'Unlimited analyses',
        'GitHub Action integration',
        'CI/CD hooks',
        'Historical trends',
        'Priority support',
      ],
      cta: 'Go Pro',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$39',
      period: '/month',
      description: 'For engineering teams',
      features: [
        'Everything in Pro',
        'SSO authentication',
        'Shared reports',
        'Team collaboration',
        'Custom integrations',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const testimonials = [
    {
      quote: "Deadlog helped us remove 40+ unused endpoints in a week. The cost savings were immediate.",
      author: "Sarah Chen",
      role: "Engineering Lead, SaaS Platform",
    },
    {
      quote: "We cut our API infrastructure spend by 18% in one sprint. Incredible ROI.",
      author: "Marcus Johnson",
      role: "Platform Engineer",
    },
    {
      quote: "The deprecation export saved us days of work. Just copy, paste, and deploy.",
      author: "Emily Rodriguez",
      role: "Backend Lead",
    },
  ];

  const supportedFormats = [
    { name: 'Nginx / Apache', icon: <Terminal className="w-5 h-5" /> },
    { name: 'AWS ALB', icon: <CloudIcon className="w-5 h-5" /> },
    { name: 'CloudFront', icon: <CloudIcon className="w-5 h-5" /> },
    { name: 'Fastly', icon: <Zap className="w-5 h-5" /> },
    { name: 'JSON (custom)', icon: <FileCode className="w-5 h-5" /> },
    { name: 'CSV (custom)', icon: <FileCode className="w-5 h-5" /> },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-deadlog-900/50 via-dark to-dark" />
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-deadlog-700/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lime/10 rounded-full blur-3xl animate-float animation-delay-200" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deadlog-800/50 border border-deadlog-700/50 mb-8">
            <span className="w-2 h-2 bg-lime rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Now with GitHub Actions support</span>
          </div>
          
          <h1 className="hero-title heading-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6">
            Find Dead API
            <br />
            <span className="text-gradient">Endpoints</span>
          </h1>
          
          <p className="hero-subtitle text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Paste logs. See which routes are actually used. Export deprecation code. 
            All processing happens locally in your browser.
          </p>
          
          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={scrollToUpload}
              className="btn-primary text-lg px-8 py-4"
            >
              <Zap className="w-5 h-5 mr-2" />
              Analyze Logs
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const element = document.getElementById('pricing');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4"
            >
              View Pricing
            </Button>
          </div>
          
          <p className="hero-cta mt-4 text-sm text-muted-foreground">
            No login required to try
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-lime rounded-full" />
          </div>
        </div>
      </section>

      {/* Log Upload Section */}
      <section id="upload-section" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Paste Your Logs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Drag a file or paste a snippet. We parse it locally in your browser.
            </p>
          </div>
          
          <LogUpload onNavigate={onNavigate} />
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-20 bg-dark-light/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="label-mono text-lime mb-4 block">SUPPORTED FORMATS</span>
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              One Tool. Many Sources.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Drop in logs from the services you already use. No agents. No ingestion.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {supportedFormats.map((format) => (
              <div 
                key={format.name}
                className="feature-card card-dark p-6 text-center hover:border-lime/50 transition-colors"
              >
                <div className="text-lime mb-3 flex justify-center">{format.icon}</div>
                <span className="text-sm text-white">{format.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Complete toolkit for identifying and eliminating API waste.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-card card-dark p-8 hover:border-lime/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-deadlog-800 rounded-xl flex items-center justify-center text-lime mb-6 group-hover:bg-lime group-hover:text-dark transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        id="how-it-works" 
        ref={howItWorksRef}
        className="py-24 bg-dark-light/30"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="label-mono text-lime mb-4 block">HOW IT WORKS</span>
            <h2 className="heading-display text-3xl sm:text-4xl text-white">
              Three Steps to Clean APIs
            </h2>
          </div>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="step-card flex flex-col md:flex-row items-start gap-6 p-8 card-dark"
              >
                <div className="flex-shrink-0">
                  <span className="text-5xl font-display font-bold text-lime/30">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" ref={securityRef} className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="label-mono text-lime mb-4 block">SECURITY</span>
              <h2 className="heading-display text-3xl sm:text-4xl text-white mb-6">
                Your Logs Stay Private
              </h2>
              <p className="text-muted-foreground mb-8">
                Everything runs client-side. No upload. No cloud processing. Your sensitive log data never leaves your browser.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: <Lock className="w-5 h-5" />, text: 'Local parsing in your browser' },
                  { icon: <Shield className="w-5 h-5" />, text: 'No data leaves your device' },
                  { icon: <Terminal className="w-5 h-5" />, text: 'Optional: encrypt exports with a passphrase' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-lime">{item.icon}</div>
                    <span className="text-white">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-lime/20 to-deadlog-600/20 rounded-3xl blur-2xl" />
              <div className="relative card-dark p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-sm text-muted-foreground">secure-session.log</span>
                </div>
                <pre className="font-mono text-sm text-muted-foreground overflow-x-auto">
                  <code className="code-comment"># Processing locally...</code>
                  {'\n'}<code className="code-keyword">$</code> <code className="code-string">deadlog analyze</code>
                  {'\n'}<code className="code-comment"># Parsed 1,247 entries</code>
                  {'\n'}<code className="code-comment"># Found 23 dead endpoints</code>
                  {'\n'}<code className="code-keyword">$</code> <code className="code-string">deadlog export</code>
                  {'\n'}<code className="code-comment"># Saved to ./deprecated-routes.json</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-24 bg-dark-light/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Choose a Plan
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start free, upgrade when you need more power.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`pricing-card relative p-8 rounded-2xl ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b from-deadlog-800 to-deadlog-900 border-2 border-lime' 
                    : 'card-dark'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="label-mono bg-lime text-dark px-4 py-1 rounded-full text-xs">
                      BEST VALUE
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-lime flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.highlighted ? 'btn-primary' : 'bg-deadlog-800 text-white hover:bg-deadlog-700'}`}
                  onClick={() => {
                    if (plan.name === 'Free') {
                      scrollToUpload();
                    } else {
                      toast.info('Coming soon! Sign up for updates.');
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
          
          {/* Lifetime deal */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-deadlog-800/50 border border-deadlog-700/50">
              <TrendingDown className="w-6 h-6 text-lime" />
              <div className="text-left">
                <p className="text-white font-semibold">Lifetime Deal</p>
                <p className="text-sm text-muted-foreground">$99 one-time for first 50 users</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-lime text-lime hover:bg-lime hover:text-dark"
                onClick={() => toast.info('Join the waitlist for the lifetime deal!')}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Loved by Teams
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              See what engineers are saying about Deadlog.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="feature-card card-dark p-8">
                <div className="text-lime mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                </div>
                <p className="text-white mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-dark-light/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-3xl sm:text-4xl text-white mb-6">
            Start Cleaning Your API
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Paste logs now. No signup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={scrollToUpload}
              className="btn-primary text-lg px-8 py-4"
            >
              <Zap className="w-5 h-5 mr-2" />
              Analyze Logs
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast.info('Contact us at hello@deadlog.dev')}
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-dark" />
                </div>
                <span className="font-display font-bold text-xl text-white">Deadlog</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Find and eliminate dead API endpoints before they drain your budget.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Security', 'Changelog'].map(item => (
                  <li key={item}>
                    <button className="text-sm text-muted-foreground hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                  <li key={item}>
                    <button className="text-sm text-muted-foreground hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </button>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Deadlog. Built by a solo indie developer.
            </p>
            <div className="flex gap-6">
              <button className="text-sm text-muted-foreground hover:text-white transition-colors">
                Privacy
              </button>
              <button className="text-sm text-muted-foreground hover:text-white transition-colors">
                Terms
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper icon component
function CloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z"/>
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z"/>
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z"/>
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z"/>
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z"/>
      <path d="M17.5 19H9c-1.7 0-3-1.3-3-3s1.3-3 3-3h.8c.4-2.4 2.5-4.2 5-4.2s4.6 1.8 5 4.2c1.9.3 3.2 1.9 3.2 3.8 0 2.1-1.7 3.8-3.8 3.8h-.7z"/>
    </svg>
  );
}
