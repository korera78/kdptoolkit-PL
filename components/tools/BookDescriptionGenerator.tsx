'use client';

import { useState, useCallback } from 'react';

// Genre definitions
const GENRES = {
  fiction: {
    label: 'Fiction',
    subgenres: [
      { id: 'romance', name: 'Romance' },
      { id: 'thriller', name: 'Thriller/Mystery' },
      { id: 'fantasy', name: 'Fantasy' },
      { id: 'scifi', name: 'Science Fiction' },
      { id: 'literary', name: 'Literary Fiction' },
      { id: 'horror', name: 'Horror' },
      { id: 'historical', name: 'Historical Fiction' },
    ],
  },
  nonfiction: {
    label: 'Non-Fiction',
    subgenres: [
      { id: 'selfhelp', name: 'Self-Help' },
      { id: 'business', name: 'Business' },
      { id: 'howto', name: 'How-To Guide' },
      { id: 'memoir', name: 'Memoir/Biography' },
      { id: 'health', name: 'Health & Wellness' },
      { id: 'cookbook', name: 'Cookbook' },
    ],
  },
  childrens: {
    label: "Children's Books",
    subgenres: [
      { id: 'picture', name: 'Picture Book' },
      { id: 'earlychapter', name: 'Early Chapter Book' },
      { id: 'middlegrade', name: 'Middle Grade' },
      { id: 'ya', name: 'Young Adult' },
    ],
  },
};

// Template generators for each genre
const TEMPLATES: Record<string, (data: FormData) => string> = {
  // Fiction Templates
  romance: (data) => `<b>${data.title}</b>

<b>She never expected to find love. He never expected to fall.</b>

${data.mainCharacters || '[Main character]'} thought they had life figured out. But when fate brings them together with ${data.secondaryInfo || '[love interest]'}, everything changes.

${data.targetAudience ? `<i>Perfect for readers who love ${data.targetAudience}</i>` : ''}

<b>What readers will love:</b>
${formatSellingPoints(data.sellingPoints)}

<b>This captivating romance features:</b>
• Sizzling chemistry that leaps off the page
• Characters you'll root for
• A swoon-worthy happily ever after

<i>A standalone romance with no cliffhangers and a guaranteed HEA!</i>

<b>Scroll up and grab your copy today!</b>`,

  thriller: (data) => `<b>${data.title}</b>

<b>One decision. One secret. One chance to survive.</b>

When ${data.mainCharacters || '[protagonist]'} discovers ${data.secondaryInfo || '[the shocking truth]'}, they're drawn into a deadly game where nothing is what it seems.

As the clock ticks down, they must uncover the truth before it's too late. But in this world of lies and deception, trust is a luxury they can't afford.

<b>Why readers can't put it down:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Perfect for fans of ${data.targetAudience}</b>` : ''}

<i>"A page-turner that will keep you guessing until the final twist."</i>

<b>Download now and discover why readers are losing sleep over this thriller!</b>`,

  fantasy: (data) => `<b>${data.title}</b>

<b>In a world where magic is forbidden, one hero will change everything.</b>

${data.mainCharacters || '[Hero name]'} never asked for this power. But when ${data.secondaryInfo || '[dark forces]'} threaten everything they love, they must embrace their destiny—or watch their world burn.

<b>Enter a realm of:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<i>Perfect for fans of ${data.targetAudience}</i>` : ''}

<b>This epic adventure features:</b>
• Rich worldbuilding you can get lost in
• Characters who will steal your heart
• Magic, danger, and impossible choices
• A story that will stay with you long after the final page

<b>The fate of the realm hangs in the balance. Begin your adventure today!</b>`,

  scifi: (data) => `<b>${data.title}</b>

<b>The future is closer than you think. And it's terrifying.</b>

In a world transformed by ${data.secondaryInfo || '[advanced technology]'}, ${data.mainCharacters || '[protagonist]'} discovers a truth that will change humanity forever.

<b>Explore a future where:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Readers who love ${data.targetAudience} will devour this</b>` : ''}

<i>A mind-bending journey that questions what it means to be human.</i>

<b>The future is calling. Will you answer?</b>`,

  literary: (data) => `<b>${data.title}</b>

A powerful story of ${data.secondaryInfo || '[human connection and transformation]'}.

${data.mainCharacters || '[Character]'}'s world is about to change in ways they never imagined. What follows is a journey through love, loss, and the quiet moments that define us.

${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<i>For readers who appreciate ${data.targetAudience}</i>` : ''}

<b>A beautifully written novel that will stay with you long after you turn the final page.</b>`,

  horror: (data) => `<b>${data.title}</b>

<b>Some doors should never be opened.</b>

${data.mainCharacters || '[Protagonist]'} thought they knew fear. They were wrong.

When ${data.secondaryInfo || '[unspeakable evil]'} awakens, there's nowhere to run. Nowhere to hide. Only survival—if they can last until dawn.

<b>What lurks within:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Fans of ${data.targetAudience} will lose sleep over this one</b>` : ''}

<i>Warning: Not for the faint of heart.</i>

<b>Turn off the lights. Lock the doors. And prepare to be terrified.</b>`,

  historical: (data) => `<b>${data.title}</b>

<b>History comes alive in this unforgettable tale.</b>

${data.mainCharacters || '[Character]'} faces impossible choices in ${data.secondaryInfo || '[a pivotal moment in history]'}. Against a backdrop of war, love, and sacrifice, one person's courage will change everything.

<b>Step into the past and discover:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<i>Perfect for readers who love ${data.targetAudience}</i>` : ''}

<b>A richly researched, emotionally powerful story that brings history to life.</b>

<b>Transport yourself to another time. Start reading today!</b>`,

  // Non-Fiction Templates
  selfhelp: (data) => `<b>${data.title}</b>

<b>Transform Your Life Starting Today</b>

Are you ready to ${data.secondaryInfo || '[achieve your goals]'}?

${data.mainCharacters ? `Drawing from ${data.mainCharacters}, this book provides` : 'Inside, you\'ll discover'} the proven strategies that have helped thousands of people create lasting change.

<b>What You'll Learn:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Perfect for:</b> ${data.targetAudience}` : ''}

<i>No fluff. No theory. Just practical, actionable advice you can implement today.</i>

Whether you're just starting your journey or looking to break through to the next level, this book gives you the roadmap to success.

<b>Your transformation begins now. Scroll up and click "Buy Now"!</b>`,

  business: (data) => `<b>${data.title}</b>

<b>The Business Strategies Top Performers Don't Want You to Know</b>

Ready to take your ${data.secondaryInfo || '[business]'} to the next level?

${data.mainCharacters ? `Based on ${data.mainCharacters}, this comprehensive guide reveals` : 'Discover'} the insider strategies that separate industry leaders from the competition.

<b>Inside This Book:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Written for:</b> ${data.targetAudience}` : ''}

<i>Packed with case studies, actionable frameworks, and proven techniques.</i>

<b>Stop struggling. Start succeeding. Get your copy today!</b>`,

  howto: (data) => `<b>${data.title}</b>

<b>The Complete Step-by-Step Guide to ${data.secondaryInfo || '[Mastery]'}</b>

Want to ${data.secondaryInfo || '[master this skill]'} but don't know where to start?

This comprehensive guide takes you from absolute beginner to confident practitioner, with clear instructions anyone can follow.

<b>What's Inside:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Perfect For:</b> ${data.targetAudience}` : ''}

<b>You'll Learn:</b>
• Step-by-step instructions with detailed examples
• Common mistakes and how to avoid them
• Pro tips from years of experience
• Troubleshooting guides for when things go wrong

${data.mainCharacters ? `<i>Includes bonus: ${data.mainCharacters}</i>` : ''}

<b>No experience required. Start your journey today!</b>`,

  memoir: (data) => `<b>${data.title}</b>

<b>A Story of ${data.secondaryInfo || '[Triumph, Courage, and the Human Spirit]'}</b>

${data.mainCharacters || 'This remarkable journey'} will inspire, challenge, and transform how you see the world.

${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<i>For readers who love ${data.targetAudience}</i>` : ''}

<b>An unforgettable true story that proves the power of the human spirit.</b>

<i>Some stories need to be told. This is one of them.</i>`,

  health: (data) => `<b>${data.title}</b>

<b>Your Complete Guide to ${data.secondaryInfo || '[Better Health]'}</b>

Ready to take control of your health and transform your life?

${data.mainCharacters ? `Based on ${data.mainCharacters}, this evidence-based guide provides` : 'Discover'} practical solutions you can start using today.

<b>What You'll Discover:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Written for:</b> ${data.targetAudience}` : ''}

<i>Science-backed strategies made simple.</i>

<b>Your healthier life starts here. Get your copy now!</b>`,

  cookbook: (data) => `<b>${data.title}</b>

<b>${data.secondaryInfo || '[Delicious Recipes for Every Occasion]'}</b>

${data.mainCharacters ? `Featuring ${data.mainCharacters}` : 'From quick weeknight dinners to impressive entertaining dishes'}, this cookbook has something for everyone.

<b>Inside You'll Find:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Perfect for:</b> ${data.targetAudience}` : ''}

<i>Beautiful photos, clear instructions, and recipes that actually work.</i>

<b>Your next favorite recipe is waiting inside!</b>`,

  // Children's Book Templates
  picture: (data) => `<b>${data.title}</b>

<b>A delightful story for little readers!</b>

Join ${data.mainCharacters || '[main character]'} on an adventure full of ${data.secondaryInfo || '[wonder and fun]'}!

${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Perfect for:</b> ${data.targetAudience}` : '<b>Ages 3-7</b>'}

<i>Beautifully illustrated pages that spark imagination and wonder.</i>

A heartwarming story that teaches important lessons while entertaining young minds.

<b>Perfect for bedtime reading and story time!</b>`,

  earlychapter: (data) => `<b>${data.title}</b>

<b>An exciting adventure for growing readers!</b>

${data.mainCharacters || '[Main character]'} never expected ${data.secondaryInfo || '[this adventure]'}. But with courage, friendship, and a little bit of luck, anything is possible!

<b>Young readers will love:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Perfect for:</b> ${data.targetAudience}` : '<b>Ages 6-9</b>'}

• Short chapters perfect for building reading confidence
• Fun illustrations on every page
• Exciting adventure with positive messages

<b>Start the adventure today!</b>`,

  middlegrade: (data) => `<b>${data.title}</b>

<b>${data.secondaryInfo || '[An adventure that will capture your imagination]'}</b>

${data.mainCharacters || '[Hero]'} thought life was ordinary. But when everything changes, they discover that courage, friendship, and believing in yourself can change the world.

<b>Why readers love this book:</b>
${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>Perfect for:</b> ${data.targetAudience}` : '<b>Ages 8-12</b>'}

<i>A thrilling story with heart, humor, and unforgettable characters.</i>

<b>The adventure awaits!</b>`,

  ya: (data) => `<b>${data.title}</b>

<b>${data.secondaryInfo || '[Nothing will ever be the same]'}</b>

${data.mainCharacters || '[Protagonist]'} is about to discover that growing up means making impossible choices. But in a world where everything is changing, who can you really trust?

${formatSellingPoints(data.sellingPoints)}

${data.targetAudience ? `<b>For readers who love:</b> ${data.targetAudience}` : '<b>Ages 13+</b>'}

<i>A powerful story about identity, love, and finding your place in the world.</i>

<b>This is the book you won't be able to put down.</b>`,
};

// Helper function to format selling points
function formatSellingPoints(points: string[]): string {
  if (!points || points.length === 0) {
    return '• [Key selling point 1]\n• [Key selling point 2]\n• [Key selling point 3]';
  }
  return points.filter(p => p.trim()).map(p => `• ${p}`).join('\n');
}

// Form data interface
interface FormData {
  title: string;
  genre: string;
  subgenre: string;
  targetAudience: string;
  mainCharacters: string;
  secondaryInfo: string;
  sellingPoints: string[];
  wordCountTarget: 150 | 300 | 500;
}

const INITIAL_FORM: FormData = {
  title: '',
  genre: '',
  subgenre: '',
  targetAudience: '',
  mainCharacters: '',
  secondaryInfo: '',
  sellingPoints: ['', '', '', '', ''],
  wordCountTarget: 300,
};

// KDP character limit
const KDP_CHAR_LIMIT = 4000;

export default function BookDescriptionGenerator() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<'html' | 'plain'>('html');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Update form field
  const updateField = useCallback((field: keyof FormData, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update selling point
  const updateSellingPoint = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newPoints = [...prev.sellingPoints];
      newPoints[index] = value;
      return { ...prev, sellingPoints: newPoints };
    });
  }, []);

  // Generate description
  const generateDescription = useCallback(() => {
    if (!formData.subgenre || !TEMPLATES[formData.subgenre]) {
      return;
    }

    const template = TEMPLATES[formData.subgenre](formData);
    setGeneratedDescription(template);
    setShowPreview(true);
  }, [formData]);

  // Convert HTML to plain text
  const toPlainText = useCallback((html: string): string => {
    return html
      .replace(/<b>/g, '')
      .replace(/<\/b>/g, '')
      .replace(/<i>/g, '')
      .replace(/<\/i>/g, '')
      .replace(/<u>/g, '')
      .replace(/<\/u>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '');
  }, []);

  // Get current output
  const getCurrentOutput = useCallback((): string => {
    if (outputFormat === 'plain') {
      return toPlainText(generatedDescription);
    }
    return generatedDescription;
  }, [outputFormat, generatedDescription, toPlainText]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getCurrentOutput());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [getCurrentOutput]);

  // Clear form
  const clearForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setGeneratedDescription('');
    setShowPreview(false);
  }, []);

  // Character count
  const charCount = generatedDescription.length;
  const wordCount = generatedDescription.split(/\s+/).filter(w => w.length > 0).length;

  // Get subgenres for selected genre
  const availableSubgenres = formData.genre
    ? GENRES[formData.genre as keyof typeof GENRES]?.subgenres || []
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Book Description Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create compelling, conversion-focused book descriptions for Amazon KDP
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Input Form */}
          <div className="space-y-5">
            {/* Book Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter your book title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Genre Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => {
                    updateField('genre', e.target.value);
                    updateField('subgenre', '');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                >
                  <option value="">Select genre...</option>
                  {Object.entries(GENRES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subgenre <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subgenre}
                  onChange={(e) => updateField('subgenre', e.target.value)}
                  disabled={!formData.genre}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select subgenre...</option>
                  {availableSubgenres.map(({ id, name }) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience / Comp Titles
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => updateField('targetAudience', e.target.value)}
                placeholder="e.g., 'fans of Colleen Hoover' or 'busy professionals'"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Main Characters/Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.genre === 'nonfiction' ? 'Author Credentials / Expertise' : 'Main Characters'}
              </label>
              <input
                type="text"
                value={formData.mainCharacters}
                onChange={(e) => updateField('mainCharacters', e.target.value)}
                placeholder={formData.genre === 'nonfiction'
                  ? "e.g., '20 years of experience' or 'research from Harvard'"
                  : "e.g., 'Sarah, a fearless detective' or 'Two star-crossed lovers'"
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Secondary Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.genre === 'nonfiction' ? 'Main Topic/Promise' : 'Central Conflict/Hook'}
              </label>
              <input
                type="text"
                value={formData.secondaryInfo}
                onChange={(e) => updateField('secondaryInfo', e.target.value)}
                placeholder={formData.genre === 'nonfiction'
                  ? "e.g., 'build passive income' or 'lose weight without dieting'"
                  : "e.g., 'a dark family secret' or 'an ancient prophecy'"
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Selling Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Selling Points (3-5 bullet points)
              </label>
              <div className="space-y-2">
                {formData.sellingPoints.map((point, index) => (
                  <input
                    key={index}
                    type="text"
                    value={point}
                    onChange={(e) => updateSellingPoint(index, e.target.value)}
                    placeholder={`Selling point ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                ))}
              </div>
            </div>

            {/* Word Count Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description Length
              </label>
              <div className="flex gap-2">
                {([150, 300, 500] as const).map((target) => (
                  <button
                    key={target}
                    onClick={() => updateField('wordCountTarget', target)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.wordCountTarget === target
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    ~{target} words
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Short (150) for ads, Medium (300) standard, Long (500) for complex books
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={generateDescription}
                disabled={!formData.title || !formData.subgenre}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Description
              </button>
              <button
                onClick={clearForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="space-y-4">
            {/* Output Format Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output Format
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOutputFormat('html')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    outputFormat === 'html'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setOutputFormat('plain')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    outputFormat === 'plain'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Plain Text
                </button>
              </div>
            </div>

            {/* Generated Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generated Description
                </label>
                <button
                  onClick={copyToClipboard}
                  disabled={!generatedDescription}
                  className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
              <textarea
                value={getCurrentOutput()}
                onChange={(e) => setGeneratedDescription(e.target.value)}
                placeholder="Your generated description will appear here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 font-mono text-sm"
              />
            </div>

            {/* Character/Word Counter */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  {charCount} / {KDP_CHAR_LIMIT} characters
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ~{wordCount} words
                </span>
              </div>
              <span className={`font-medium ${
                charCount > KDP_CHAR_LIMIT
                  ? 'text-red-600'
                  : charCount > KDP_CHAR_LIMIT - 200
                    ? 'text-amber-600'
                    : 'text-green-600'
              }`}>
                {charCount > KDP_CHAR_LIMIT
                  ? `Over limit by ${charCount - KDP_CHAR_LIMIT}`
                  : charCount > KDP_CHAR_LIMIT - 200
                    ? 'Close to limit'
                    : 'Good length'}
              </span>
            </div>

            {/* Amazon Preview */}
            {showPreview && generatedDescription && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amazon Preview
                  </label>
                </div>
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                  {/* Amazon-style header */}
                  <div className="bg-[#232f3e] text-white px-4 py-2 text-sm">
                    amazon.com/dp/XXXXXXXXX
                  </div>
                  {/* Content preview */}
                  <div className="bg-white dark:bg-gray-800 p-4 max-h-80 overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                      {formData.title || 'Book Title'}
                    </h3>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: generatedDescription }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Writing Great Book Descriptions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Hook Readers Fast</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>First line must grab attention</li>
                <li>Lead with emotion or intrigue</li>
                <li>Ask a compelling question</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Show, Don't Tell</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>Hint at conflict, don't spoil</li>
                <li>Create emotional connection</li>
                <li>Use vivid, specific language</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Format for Scanning</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>Use bold for key phrases</li>
                <li>Include bullet points</li>
                <li>Break into short paragraphs</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Build Credibility</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>Mention comp titles/authors</li>
                <li>Include social proof if available</li>
                <li>Highlight unique selling points</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Call to Action</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>End with clear next step</li>
                <li>Create urgency if appropriate</li>
                <li>"Scroll up and buy now"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Amazon HTML Tags</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>&lt;b&gt; bold, &lt;i&gt; italic</li>
                <li>&lt;u&gt; underline</li>
                <li>&lt;br&gt; line breaks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
