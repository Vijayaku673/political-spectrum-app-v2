'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  FileText,
  Shield,
  Scale,
  Mail,
  Github,
  MessageSquare,
  Info,
  Zap,
  Database,
  Users,
  Globe,
  Clock,
  Star,
  ExternalLink,
  Heart,
  Coffee,
  Code,
  Sparkles,
  Layout,
  Settings,
  BarChart3,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

export default function MiscPage() {
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const quickLinks = [
    {
      title: 'Features',
      description: 'Explore all the features of the Political Spectrum App',
      icon: Zap,
      href: '/#features',
      color: 'text-yellow-500',
    },
    {
      title: 'Methodology',
      description: 'Learn about our bias detection algorithm',
      icon: Database,
      href: '/#methodology',
      color: 'text-blue-500',
    },
    {
      title: 'Sources',
      description: 'View our curated list of 35+ news outlets',
      icon: Globe,
      href: '/#sources',
      color: 'text-green-500',
    },
    {
      title: 'Analytics',
      description: 'View detailed bias statistics and trends',
      icon: BarChart3,
      href: '/',
      color: 'text-purple-500',
    },
  ];

  const resources = [
    {
      title: 'API Documentation',
      description: 'Integrate our bias analysis into your own applications',
      icon: Code,
      href: '#api',
      badge: 'Coming Soon',
    },
    {
      title: 'Browser Extension',
      description: 'Get real-time bias analysis while browsing news',
      icon: Layout,
      href: '#extension',
      badge: 'Beta',
    },
    {
      title: 'Mobile App',
      description: 'Take bias analysis on the go with our mobile app',
      icon: Globe,
      href: '#mobile',
      badge: 'Planned',
    },
    {
      title: 'Data Export',
      description: 'Export your analysis history and statistics',
      icon: Database,
      href: '#export',
      badge: 'Available',
    },
  ];

  const faqs = [
    {
      question: 'How does the bias detection algorithm work?',
      answer: 'Our algorithm uses a 3-layer scoring system that analyzes outlet bias, article-specific language patterns, and contextual signals. We combine known outlet bias scores with natural language processing to detect partisan framing, emotional language, and source diversity. The result is a bias score from -10 (far left) to +10 (far right).',
    },
    {
      question: 'Is this app politically biased?',
      answer: 'We strive for neutrality. Our algorithm is designed to detect bias across the political spectrum equally. We use transparent methodology and provide evidence for each analysis so users can understand how conclusions were reached. We do not label any outlet as "good" or "bad" - we simply report observed patterns.',
    },
    {
      question: 'How accurate is the bias analysis?',
      answer: 'Our algorithm achieves approximately 85% accuracy when compared to expert assessments. Each analysis includes a confidence score so you can gauge reliability. We continuously improve our models based on feedback and new research.',
    },
    {
      question: 'Which news sources are included?',
      answer: 'We track 35+ major news outlets including CNN, Fox News, New York Times, Wall Street Journal, Washington Post, NPR, BBC, Reuters, and many more. Each outlet has a known bias score based on multiple media bias rating organizations.',
    },
    {
      question: 'Can I suggest a news source to add?',
      answer: 'Yes! We welcome suggestions for new outlets. Contact us through the feedback form or GitHub repository. We evaluate each suggestion based on reach, credibility, and our ability to access their content reliably.',
    },
    {
      question: 'Is my data private?',
      answer: 'Absolutely. We do not sell or share your personal data. Your reading history and preferences are stored locally on your device. API keys you provide are encrypted and only used to authenticate with AI providers for enhanced analysis.',
    },
  ];

  const stats = [
    { label: 'News Outlets', value: '35+', icon: Globe },
    { label: 'Articles Analyzed', value: '50K+', icon: FileText },
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Accuracy Rate', value: '85%', icon: CheckCircle },
  ];

  const teamMembers = [
    { name: 'Shootre21', role: 'Creator & Developer', github: 'Shootre21' },
  ];

  const supportOptions = [
    {
      title: 'Star on GitHub',
      description: 'Show your support by starring the repository',
      icon: Star,
      href: 'https://github.com/Shootre21/political-spectrum-app-v2',
      color: 'text-yellow-500',
    },
    {
      title: 'Report an Issue',
      description: 'Found a bug? Let us know!',
      icon: AlertCircle,
      href: 'https://github.com/Shootre21/political-spectrum-app-v2/issues',
      color: 'text-red-500',
    },
    {
      title: 'Request a Feature',
      description: 'Have an idea? We would love to hear it',
      icon: Sparkles,
      href: 'https://github.com/Shootre21/political-spectrum-app-v2/issues',
      color: 'text-purple-500',
    },
    {
      title: 'Contribute',
      description: 'Help improve the codebase',
      icon: Code,
      href: 'https://github.com/Shootre21/political-spectrum-app-v2',
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <SEOHead
        title="Miscellaneous - More Resources"
        description="Explore additional resources, FAQ, documentation, and support options for the Political Spectrum App."
        keywords={['faq', 'help', 'documentation', 'resources', 'support']}
      />

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-muted-foreground">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
              Miscellaneous
            </h1>
            <Badge variant="secondary">More Resources</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Links
            </CardTitle>
            <CardDescription>
              Navigate to key sections of the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <link.icon className={`w-6 h-6 ${link.color} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <h4 className="font-medium flex items-center gap-2">
                      {link.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Resources & Tools
            </CardTitle>
            <CardDescription>
              Additional tools and integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <resource.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  <Badge variant={resource.badge === 'Available' ? 'default' : 'secondary'}>
                    {resource.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Common questions about the Political Spectrum App
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border overflow-hidden"
                >
                  <button
                    onClick={() => setShowFaq(showFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium pr-4">{faq.question}</span>
                    <ChevronRight
                      className={`w-5 h-5 shrink-0 transition-transform ${
                        showFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {showFaq === index && (
                    <div className="p-4 pt-0 text-sm text-muted-foreground border-t">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Support & Feedback
            </CardTitle>
            <CardDescription>
              Help us improve the Political Spectrum App
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <option.icon className={`w-6 h-6 ${option.color} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <h4 className="font-medium flex items-center gap-2">
                      {option.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team & Credits
            </CardTitle>
            <CardDescription>
              The people behind the Political Spectrum App
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <a
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    @{member.github}
                  </a>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h4 className="font-medium">Special Thanks</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium">Media Bias/Fact Check</p>
                  <p className="text-xs text-muted-foreground">Outlet Ratings</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium">AllSides</p>
                  <p className="text-xs text-muted-foreground">Bias Reference</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium">Ad Fontes Media</p>
                  <p className="text-xs text-muted-foreground">Methodology</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium">OpenAI / Anthropic</p>
                  <p className="text-xs text-muted-foreground">AI Analysis</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Legal & Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/privacy" className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Privacy Policy</h4>
                  <p className="text-sm text-muted-foreground">How we handle your data</p>
                </div>
              </Link>
              <Link href="/ethics" className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Scale className="w-5 h-5 text-purple-500" />
                <div>
                  <h4 className="font-medium">Ethics Policy</h4>
                  <p className="text-sm text-muted-foreground">Our commitment to neutrality</p>
                </div>
              </Link>
              <Link href="/terms" className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <FileText className="w-5 h-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Terms of Service</h4>
                  <p className="text-sm text-muted-foreground">Usage terms and conditions</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Get in Touch
            </CardTitle>
            <CardDescription>
              Have questions or feedback? We would love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://github.com/Shootre21/political-spectrum-app-v2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-6 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Github className="w-8 h-8" />
                <span className="font-medium">GitHub</span>
                <span className="text-sm text-muted-foreground">Code & Issues</span>
              </a>
              <a
                href="https://twitter.com/shootre21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-6 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <MessageSquare className="w-8 h-8 text-blue-400" />
                <span className="font-medium">Twitter</span>
                <span className="text-sm text-muted-foreground">@shootre21</span>
              </a>
              <div className="flex flex-col items-center gap-2 p-6 rounded-lg bg-muted/50">
                <Mail className="w-8 h-8 text-red-500" />
                <span className="font-medium">Email</span>
                <span className="text-sm text-muted-foreground">contact@example.com</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Political Spectrum App v3.4.0 - UI Enhancement</p>
          <p className="mt-1">Last updated: March 2025</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Product Column */}
            <div>
              <h3 className="font-semibold mb-4 text-white">PRODUCT</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#methodology" className="hover:text-white transition-colors">Methodology</Link></li>
                <li><Link href="/#sources" className="hover:text-white transition-colors">Sources</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            {/* Company Column */}
            <div>
              <h3 className="font-semibold mb-4 text-white">COMPANY</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/misc" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/ethics" className="hover:text-white transition-colors">Ethics Policy</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/misc#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            {/* Connect Column */}
            <div>
              <h3 className="font-semibold mb-4 text-white">CONNECT</h3>
              <div className="flex gap-3">
                <Link
                  href="/share"
                  className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </Link>
                <Link
                  href="/misc"
                  className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-slate-500 text-sm">
            Made with ❤️ for media literacy
          </div>
        </div>
      </footer>
    </div>
  );
}
