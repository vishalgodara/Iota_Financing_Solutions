import { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function EducationalHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const glossary = [
    {
      term: 'APR (Annual Percentage Rate)',
      definition: 'The yearly cost of borrowing money, expressed as a percentage. It includes interest and fees.',
      example: 'If you finance $30,000 at 4.5% APR for 60 months, you\'ll pay approximately $2,250 in interest over the life of the loan.',
      category: 'Financing',
    },
    {
      term: 'Capitalized Cost',
      definition: 'The agreed-upon value of the vehicle for lease purposes. Similar to the sale price when buying.',
      example: 'If the MSRP is $35,000 but you negotiate down to $33,000, your capitalized cost is $33,000.',
      category: 'Leasing',
    },
    {
      term: 'Money Factor',
      definition: 'The interest rate on a lease, expressed as a decimal. Multiply by 2,400 to convert to APR.',
      example: 'A money factor of 0.00125 equals 3.0% APR (0.00125 × 2,400 = 3.0).',
      category: 'Leasing',
    },
    {
      term: 'Residual Value',
      definition: 'The estimated value of the vehicle at the end of the lease term.',
      example: 'A $35,000 vehicle with a 60% residual after 3 years will be worth approximately $21,000.',
      category: 'Leasing',
    },
    {
      term: 'Equity',
      definition: 'The difference between what your vehicle is worth and what you owe on it.',
      example: 'If your car is worth $25,000 and you owe $20,000, you have $5,000 in equity.',
      category: 'Financing',
    },
    {
      term: 'Gap Insurance',
      definition: 'Insurance that covers the difference between what you owe and what the vehicle is worth if it\'s totaled.',
      example: 'If you owe $30,000 but your car is only worth $25,000 after an accident, gap insurance covers the $5,000 difference.',
      category: 'Insurance',
    },
    {
      term: 'Lease Disposition Fee',
      definition: 'A fee charged at the end of a lease when you return the vehicle (typically $300-$500).',
      example: 'You might pay a $395 disposition fee when returning your leased vehicle.',
      category: 'Leasing',
    },
    {
      term: 'Wear and Tear',
      definition: 'Damage beyond normal use that you may be charged for when returning a leased vehicle.',
      example: 'Small door dings, tire wear within limits, and minor interior wear are typically considered normal. Deep scratches or torn upholstery are excessive.',
      category: 'Leasing',
    },
    {
      term: 'Down Payment',
      definition: 'Money paid upfront to reduce the amount you need to finance or lease.',
      example: 'Putting $5,000 down on a $30,000 car means you\'ll finance $25,000.',
      category: 'Both',
    },
    {
      term: 'Trade-In Value',
      definition: 'The amount a dealer will pay for your current vehicle to put toward your new one.',
      example: 'If your current car has a trade-in value of $12,000, that can serve as your down payment.',
      category: 'Both',
    },
    {
      term: 'Credit Score',
      definition: 'A number (300-850) that represents your creditworthiness. Higher scores get better interest rates.',
      example: 'A score of 750+ might qualify for 3.9% APR, while 650 might get 7.5% APR.',
      category: 'Financing',
    },
    {
      term: 'Mileage Allowance',
      definition: 'The number of miles you can drive per year under a lease agreement without penalty.',
      example: 'A typical lease includes 12,000 miles/year. Exceeding this may cost $0.20-$0.30 per extra mile.',
      category: 'Leasing',
    },
  ];

  const faqs = [
    {
      question: 'Should I lease or finance?',
      answer: 'Lease if you want lower monthly payments, enjoy driving new cars every few years, and don\'t exceed mileage limits. Finance if you want to own the vehicle, drive unlimited miles, and build equity over time.',
      category: 'Decision Making',
    },
    {
      question: 'What credit score do I need?',
      answer: 'While you can get financing with various credit scores, you\'ll get the best rates with a score of 700+. Scores between 650-699 are good, 600-649 are fair, and below 600 may require a larger down payment or co-signer.',
      category: 'Credit',
    },
    {
      question: 'How much should I put down?',
      answer: 'For financing, aim for 10-20% down. For leasing, less is often better (just the first payment and fees) since you won\'t get that money back. Never put more than $2,000-3,000 down on a lease.',
      category: 'Down Payment',
    },
    {
      question: 'What happens at the end of my lease?',
      answer: 'You have three options: (1) Return the vehicle and walk away, (2) Buy it for the residual value, or (3) Trade it in for a new lease. We\'ll contact you 6-9 months before your lease ends to discuss options.',
      category: 'Lease End',
    },
    {
      question: 'Can I end my lease early?',
      answer: 'Yes, but it\'s usually expensive. You\'ll typically pay the remaining payments plus early termination fees. Better options include transferring your lease to someone else or trading it in for a new vehicle.',
      category: 'Lease End',
    },
    {
      question: 'What is considered excessive wear and tear?',
      answer: 'Normal wear includes minor scratches under 2 inches, small door dings, and tire wear within limits. Excessive wear includes deep scratches, dents over 2 inches, cracked glass, torn upholstery, or significant stains.',
      category: 'Lease End',
    },
    {
      question: 'How does trade-in work with financing?',
      answer: 'If you have positive equity (car worth more than you owe), that amount goes toward your new vehicle. If you have negative equity (owe more than it\'s worth), that amount is added to your new loan.',
      category: 'Trade-In',
    },
    {
      question: 'Are electric vehicles worth it?',
      answer: 'EVs have higher upfront costs but lower operating costs. You\'ll save on gas ($1,200-2,000/year), maintenance (no oil changes, fewer brake jobs), and may qualify for tax credits up to $7,500. Best for those with home charging and predictable daily driving.',
      category: 'Vehicle Choice',
    },
  ];

  const videos = [
    { title: 'Lease vs Finance: Which is Right for You?', duration: '8:30', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZ3xlbnwxfHx8fDE3NjA4MDEzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { title: 'Understanding Your Credit Score', duration: '5:45', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZ3xlbnwxfHx8fDE3NjA4MDEzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { title: 'Preparing for Lease Return: What You Need to Know', duration: '6:15', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZ3xlbnwxfHx8fDE3NjA4MDEzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  const filteredGlossary = glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFAQs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">Educational Hub</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn the basics of auto financing and leasing. We break down complex terms into simple explanations.
        </p>
      </motion.div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search terms, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="glossary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        {/* Glossary Tab */}
        <TabsContent value="glossary" className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">All Terms ({filteredGlossary.length})</Badge>
            <Badge variant="outline">Leasing ({glossary.filter(g => g.category === 'Leasing').length})</Badge>
            <Badge variant="outline">Financing ({glossary.filter(g => g.category === 'Financing').length})</Badge>
            <Badge variant="outline">Insurance ({glossary.filter(g => g.category === 'Insurance').length})</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, index) => (
              <motion.div
                key={item.term}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-gray-900">{item.term}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{item.definition}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-800 mb-1">Example:</div>
                    <p className="text-xs text-blue-900">{item.example}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No terms found matching "{searchQuery}"</p>
            </Card>
          )}
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs">
          <Card className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <HelpCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-gray-900">{faq.question}</div>
                        <Badge variant="secondary" className="text-xs mt-2">
                          {faq.category}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pt-2 pb-4 text-gray-700">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs.length === 0 && (
              <div className="py-12 text-center">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs found matching "{searchQuery}"</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos">
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-red-600 border-b-8 border-b-transparent ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-gray-900 group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h4>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Reference Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h3 className="text-gray-900 mb-6">Quick Comparison: Lease vs Finance</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-lg text-purple-600 mb-4">Leasing</div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-1">✓</div>
                  <div className="text-sm text-gray-700">Lower monthly payments</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-1">✓</div>
                  <div className="text-sm text-gray-700">Drive new cars every 2-3 years</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-1">✓</div>
                  <div className="text-sm text-gray-700">Warranty coverage throughout lease</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-red-600 mt-1">✗</div>
                  <div className="text-sm text-gray-700">Mileage restrictions</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-red-600 mt-1">✗</div>
                  <div className="text-sm text-gray-700">Don't own the vehicle</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-lg text-pink-600 mb-4">Financing</div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-1">✓</div>
                  <div className="text-sm text-gray-700">You own the vehicle</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-1">✓</div>
                  <div className="text-sm text-gray-700">No mileage limits</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-1">✓</div>
                  <div className="text-sm text-gray-700">Build equity</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-red-600 mt-1">✗</div>
                  <div className="text-sm text-gray-700">Higher monthly payments</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-red-600 mt-1">✗</div>
                  <div className="text-sm text-gray-700">Responsible for all maintenance costs</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Need More Help */}
      <Card className="p-8 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
        <h3 className="text-white mb-2">Still Have Questions?</h3>
        <p className="text-red-50 mb-6">
          Our financial advisors are here to help you understand all your options
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            Chat with an Advisor
          </button>
          <button className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors">
            Schedule a Call
          </button>
        </div>
      </Card>
    </div>
  );
}
