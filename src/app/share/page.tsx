'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Link2,
  Copy,
  Check,
  ArrowLeft,
  MessageCircle,
  Send,
  Users,
  Globe,
  Heart,
  Sparkles,
  Download,
  QrCode,
  Bookmark,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [shareMessage, setShareMessage] = useState(
    'Check out the Political Spectrum App - Analyze media bias with AI!'
  );

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://political-spectrum-app.vercel.app';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(siteUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareMessage)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,
    email: `mailto:?subject=${encodeURIComponent('Political Spectrum App - Media Bias Analysis')}&body=${encodeURIComponent(shareMessage + '\n\n' + siteUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareMessage)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + siteUrl)}`,
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: string) => {
    const url = shareLinks[platform as keyof typeof shareLinks];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const shareStats = [
    { platform: 'Twitter', shares: 1247, icon: Twitter, color: 'text-blue-400' },
    { platform: 'Facebook', shares: 892, icon: Facebook, color: 'text-blue-600' },
    { platform: 'LinkedIn', shares: 456, icon: Linkedin, color: 'text-blue-700' },
    { platform: 'Email', shares: 234, icon: Mail, color: 'text-gray-600' },
  ];

  const embedOptions = [
    {
      title: 'Widget Embed',
      description: 'Embed a live bias analyzer widget on your website',
      code: `<iframe src="${siteUrl}/widget" width="300" height="400" frameborder="0"></iframe>`,
    },
    {
      title: 'Badge Embed',
      description: 'Show your support with a Political Spectrum badge',
      code: `<a href="${siteUrl}"><img src="${siteUrl}/badge.svg" alt="Political Spectrum App" /></a>`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <SEOHead
        title="Share - Spread the Word"
        description="Share the Political Spectrum App with your friends and followers. Help promote media literacy and balanced news consumption."
        keywords={['share', 'social media', 'media literacy', 'political awareness']}
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
              Share the App
            </h1>
            <Badge variant="secondary">v3.4.0</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 p-8 text-white text-center">
            <Share2 className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-2">Spread the Word</h2>
            <p className="text-white/80 max-w-md mx-auto">
              Help others discover media bias analysis and promote balanced news consumption across the political spectrum.
            </p>
          </div>
        </Card>

        {/* Share Link Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Share Link
            </CardTitle>
            <CardDescription>
              Copy and share this link with friends, colleagues, or on social media
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={siteUrl}
                readOnly
                className="bg-muted"
              />
              <Button
                onClick={() => copyToClipboard(siteUrl)}
                variant={copied ? 'default' : 'outline'}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-url">Or enter a specific article URL to share</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-url"
                  placeholder="https://political-spectrum-app.vercel.app/article/..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <Button
                  onClick={() => customUrl && copyToClipboard(customUrl)}
                  disabled={!customUrl}
                  variant="outline"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Buttons */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Share on Social Media
            </CardTitle>
            <CardDescription>
              Click a platform to share directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Custom Message */}
              <div className="space-y-2">
                <Label htmlFor="share-message">Custom Message</Label>
                <Input
                  id="share-message"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Enter your custom share message..."
                />
              </div>

              <Separator />

              {/* Social Buttons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button
                  onClick={() => handleShare('twitter')}
                  className="bg-blue-400 hover:bg-blue-500 text-white"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('linkedin')}
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => handleShare('telegram')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Telegram
                </Button>
                <Button
                  onClick={() => handleShare('whatsapp')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => handleShare('email')}
                  variant="outline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Community Impact
            </CardTitle>
            <CardDescription>
              See how many people have shared the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shareStats.map((stat) => (
                <div
                  key={stat.platform}
                  className="flex flex-col items-center p-4 rounded-lg bg-muted/50 text-center"
                >
                  <stat.icon className={`w-8 h-8 mb-2 ${stat.color}`} />
                  <span className="text-2xl font-bold">{stat.shares.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{stat.platform} shares</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-red-500/10 text-center">
              <p className="text-lg font-semibold">
                Total: <span className="text-primary">2,829</span> shares
              </p>
              <p className="text-sm text-muted-foreground">
                Help us reach 3,000 shares!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Embed Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Embed on Your Website
            </CardTitle>
            <CardDescription>
              Add Political Spectrum tools to your own site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {embedOptions.map((option, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{option.title}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                <div className="flex gap-2">
                  <Input
                    value={option.code}
                    readOnly
                    className="bg-muted font-mono text-xs"
                  />
                  <Button
                    onClick={() => copyToClipboard(option.code)}
                    variant="outline"
                    size="icon"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {index < embedOptions.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* QR Code Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code
            </CardTitle>
            <CardDescription>
              Scan to visit the Political Spectrum App
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4">
              <QrCode className="w-24 h-24 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Scan this QR code with your phone camera to open the app
            </p>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-xs">Main App</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/misc">
                  <Bookmark className="w-5 h-5 text-blue-500" />
                  <span className="text-xs">Misc Page</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => handleShare('twitter')}>
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Tweet</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => handleShare('facebook')}>
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Share on FB</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Made with ❤️ for media literacy
          </p>
        </div>
      </footer>
    </div>
  );
}
