'use client';

import { useState, useRef, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  genre: string;
  template: string;
}

const templates: Template[] = [
  {
    id: 'fiction-mystery',
    name: 'Mystery/Thriller',
    genre: 'Fiction',
    template: `<b>When [protagonist] discovers [inciting incident], their life is turned upside down...</b>

[Protagonist description] thought they had it all figured out. But when [mysterious event] threatens everything they hold dear, they must [central conflict].

<b>As the clock ticks down, [protagonist] must choose:</b>
• Trust the stranger who claims to have answers
• Uncover the truth before it's too late
• Risk everything to save [what's at stake]

<b>Perfect for fans of [comp author 1] and [comp author 2]</b>

<i>Readers are saying:</i>
"A page-turner that kept me up all night!" ★★★★★
"Twists I never saw coming!" ★★★★★

<b>Scroll up and grab your copy today!</b>`,
  },
  {
    id: 'fiction-romance',
    name: 'Romance',
    genre: 'Fiction',
    template: `<b>She swore she'd never fall for someone like him. He was determined to prove her wrong.</b>

[Heroine name] has built a life on [her profession/passion]. The last thing she needs is [hero name]—a [his description] who challenges everything she believes.

But when [inciting incident], they're forced to [work together/spend time/fake relationship]. And what starts as [tension/conflict] soon becomes something neither of them expected...

<b>Can two people from different worlds find their happily ever after?</b>

This [trope 1] meets [trope 2] romance will sweep you off your feet with:
• Sizzling chemistry that leaps off the page
• Witty banter and emotional depth
• A swoon-worthy hero who will melt your heart
• An empowered heroine who knows what she wants

<b>Perfect for fans of [comp author 1] and [comp author 2]</b>

<i>A standalone romance with no cliffhangers and a guaranteed HEA!</i>`,
  },
  {
    id: 'nonfiction-selfhelp',
    name: 'Self-Help',
    genre: 'Non-Fiction',
    template: `<b>Transform Your [Area of Life] in Just [Timeframe]</b>

Are you struggling with [problem 1], [problem 2], or [problem 3]?

You're not alone. Millions of people face these challenges every day. But what if there was a proven system that could help you [desired outcome]?

<b>Introducing [Book Title]—your complete guide to [transformation].</b>

Inside this book, you'll discover:
• The [#] simple strategies that top performers use to [achieve goal]
• How to overcome [obstacle] once and for all
• Step-by-step action plans you can implement today
• Real-world case studies and success stories
• [Bonus benefit]

<b>What You'll Learn:</b>
<b>Chapter 1:</b> [Key concept]
<b>Chapter 2:</b> [Key concept]
<b>Chapter 3:</b> [Key concept]

<b>Whether you're [audience 1], [audience 2], or [audience 3], this book will give you the tools to [transformation].</b>

<i>Backed by research and proven in real life.</i>

<b>Scroll up and click "Buy Now" to start your transformation today!</b>`,
  },
  {
    id: 'nonfiction-howto',
    name: 'How-To Guide',
    genre: 'Non-Fiction',
    template: `<b>Master [Skill/Topic] with This Complete Step-by-Step Guide</b>

Want to [desired skill] but don't know where to start?

This comprehensive guide takes you from absolute beginner to [skill level] in [timeframe or process].

<b>What's Inside:</b>
✓ [Benefit 1]—even if you've never [done this before]
✓ [Benefit 2] that the pros don't want you to know
✓ [Benefit 3] with detailed illustrations and examples
✓ [Benefit 4] to avoid costly mistakes
✓ [Benefit 5] you can use immediately

<b>Perfect For:</b>
• Complete beginners with zero experience
• [Intermediate practitioners] looking to level up
• [Advanced users] who want to master [advanced technique]

<b>You'll Learn:</b>
• How to [specific outcome 1]
• The secret to [specific outcome 2]
• [Number] proven techniques for [goal]
• Common mistakes and how to avoid them
• Pro tips from [years of experience/expert insight]

<b>Plus bonus materials:</b> [Checklist/Templates/Resources]

<i>No fluff. No theory. Just practical, actionable advice.</i>

<b>Start your journey to [mastery] today. Scroll up and click "Buy Now"!</b>`,
  },
  {
    id: 'scifi-fantasy',
    name: 'Sci-Fi & Fantasy',
    genre: 'Fiction',
    template: `<b>In a world where [unique world element], one [protagonist description] will change everything.</b>

[Protagonist name] never asked to be [chosen one/special ability]. All they wanted was [normal desire]. But when [inciting incident] threatens [the kingdom/world/universe], they must [embrace destiny/learn power/unite forces].

<b>With [ally] at their side and [antagonist] hunting them at every turn, [protagonist] will discover:</b>
• The truth about [mystery element]
• Powers they never knew they had
• A prophecy that could save—or destroy—them all

<b>But time is running out.</b>

As [antagonist's plan] draws closer to completion, [protagonist] faces an impossible choice: [sacrifice A] or [sacrifice B].

<i>Perfect for fans of [comp author 1], [comp author 2], and [comp series]</i>

<b>This [standalone/Book 1 of series] features:</b>
• [Magic system/Technology element]
• [Worldbuilding element]
• [Character relationship dynamic]
• [Stakes/Conflict]

<b>The fate of [world] hangs in the balance. Start the adventure today!</b>`,
  },
];

export default function BookDescriptionGenerator() {
  const [genre, setGenre] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [description, setDescription] = useState<string>('');
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxChars = 4000;

  useEffect(() => {
    if (selectedTemplate) {
      setDescription(selectedTemplate.template);
      generateHTML(selectedTemplate.template);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    setCharCount(description.length);
    generateHTML(description);
  }, [description]);

  const generateHTML = (text: string) => {
    setHtmlOutput(text);
  };

  const applyFormatting = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);

    if (selectedText) {
      let formattedText = '';
      const openTag = `<${tag}>`;
      const closeTag = `</${tag}>`;

      // Check if already formatted
      const before = description.substring(Math.max(0, start - tag.length - 2), start);
      const after = description.substring(end, Math.min(description.length, end + tag.length + 3));

      if (before.includes(openTag) && after.includes(closeTag)) {
        // Remove formatting
        formattedText = description.substring(0, start - tag.length - 2) +
                        selectedText +
                        description.substring(end + tag.length + 3);
      } else {
        // Add formatting
        formattedText = description.substring(0, start) +
                        openTag + selectedText + closeTag +
                        description.substring(end);
      }

      setDescription(formattedText);

      // Restore selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + openTag.length, end + openTag.length);
      }, 0);
    }
  };

  const insertList = (type: 'ul' | 'ol') => {
    const listHTML = type === 'ul'
      ? `\n\n<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n  <li>List item 3</li>\n</ul>\n\n`
      : `\n\n<ol>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ol>\n\n`;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newDescription = description.substring(0, start) + listHTML + description.substring(start);
    setDescription(newDescription);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + listHTML.length, start + listHTML.length);
    }, 0);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearDescription = () => {
    setDescription('');
    setHtmlOutput('');
  };

  const filteredTemplates = genre ? templates.filter(t => t.genre === genre) : templates;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ✍️ Book Description Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create compelling, Amazon-compliant HTML book descriptions with ease
          </p>
        </div>

        {/* Template Selection */}
        <div className="mb-6 space-y-4">
          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose a Genre Template
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              <button
                onClick={() => setGenre('')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  genre === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                All Genres
              </button>
              <button
                onClick={() => setGenre('Fiction')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  genre === 'Fiction'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Fiction
              </button>
              <button
                onClick={() => setGenre('Non-Fiction')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  genre === 'Non-Fiction'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Non-Fiction
              </button>
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors border ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Edit Your Description
              </label>
              <button
                onClick={clearDescription}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear All
              </button>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex gap-2 flex-wrap p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => applyFormatting('b')}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 font-bold text-sm"
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => applyFormatting('i')}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 italic text-sm"
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => applyFormatting('u')}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 underline text-sm"
                title="Underline"
              >
                U
              </button>
              <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button
                onClick={() => insertList('ul')}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                title="Bullet List"
              >
                • List
              </button>
              <button
                onClick={() => insertList('ol')}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                title="Numbered List"
              >
                1. List
              </button>
            </div>

            {/* Text Editor */}
            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Start typing or select a template above..."
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 font-mono text-sm"
              maxLength={maxChars}
            />

            {/* Character Count */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {charCount} / {maxChars} characters
              </span>
              <span className={`font-medium ${charCount > maxChars - 200 ? 'text-amber-600' : 'text-green-600'}`}>
                {charCount > maxChars - 200 ? '⚠️ Close to limit' : '✓ Good length'}
              </span>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amazon Preview
              </label>
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy HTML'}
              </button>
            </div>

            {/* Preview Box */}
            <div className="h-96 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>

            {/* HTML Code */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Raw HTML (copy this to Amazon):
              </label>
              <textarea
                value={htmlOutput}
                readOnly
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Amazon HTML Guidelines
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Allowed Tags:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li><code>&lt;b&gt;</code> and <code>&lt;i&gt;</code> for bold and italic</li>
                <li><code>&lt;u&gt;</code> for underline</li>
                <li><code>&lt;ul&gt;</code> and <code>&lt;ol&gt;</code> for lists</li>
                <li><code>&lt;br&gt;</code> for line breaks</li>
              </ul>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Best Practices:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Keep under 4,000 characters</li>
                <li>Lead with a strong hook</li>
                <li>Use bullet points for readability</li>
                <li>Include keywords naturally</li>
                <li>End with a clear call-to-action</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Writing Great Book Descriptions
        </h4>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>Hook readers immediately:</strong> Your first sentence should grab attention and make them want more.</li>
          <li><strong>Show conflict, not plot:</strong> Hint at the central conflict without spoiling the story.</li>
          <li><strong>Use formatting strategically:</strong> Bold key phrases to catch skimmers' eyes.</li>
          <li><strong>Include social proof:</strong> Reviews, ratings, or comparisons to bestsellers build credibility.</li>
          <li><strong>End with urgency:</strong> A clear call-to-action increases conversion rates.</li>
        </ul>
      </div>
    </div>
  );
}
