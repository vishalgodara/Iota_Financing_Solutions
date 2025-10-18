import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, AlertCircle, Calendar, FileText, Car, DollarSign, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function LeaseEndAssistance() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [leaseEndDate] = useState(new Date('2025-04-15'));

  const monthsUntilEnd = Math.ceil((leaseEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));

  const checklist = [
    {
      id: 1,
      title: 'Review your lease agreement',
      description: 'Understand your mileage allowance, wear and tear policy, and end-of-lease fees',
      timeframe: '6-9 months before',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Check your mileage',
      description: 'Calculate if you\'re over or under your mileage allowance and plan accordingly',
      timeframe: '6-9 months before',
      priority: 'high',
    },
    {
      id: 3,
      title: 'Schedule a pre-inspection',
      description: 'Get a professional assessment of wear and tear to know what repairs to make',
      timeframe: '3-6 months before',
      priority: 'high',
    },
    {
      id: 4,
      title: 'Make necessary repairs',
      description: 'Fix any excessive wear and tear identified in the pre-inspection',
      timeframe: '2-4 months before',
      priority: 'medium',
    },
    {
      id: 5,
      title: 'Detail the vehicle',
      description: 'Professional cleaning inside and out to present the vehicle in best condition',
      timeframe: '1-2 months before',
      priority: 'medium',
    },
    {
      id: 6,
      title: 'Gather all documents',
      description: 'Collect lease agreement, service records, owner\'s manual, and all keys/remotes',
      timeframe: '1 month before',
      priority: 'high',
    },
    {
      id: 7,
      title: 'Remove personal items',
      description: 'Check all compartments, remove toll tags, garage door openers, and personal belongings',
      timeframe: '1 month before',
      priority: 'medium',
    },
    {
      id: 8,
      title: 'Decide on next steps',
      description: 'Choose to return, buy out, or trade in for a new lease',
      timeframe: '1-2 months before',
      priority: 'high',
    },
    {
      id: 9,
      title: 'Schedule return appointment',
      description: 'Book your vehicle return or buyout appointment at a convenient time',
      timeframe: '2-4 weeks before',
      priority: 'high',
    },
    {
      id: 10,
      title: 'Final inspection',
      description: 'Toyota will inspect the vehicle for mileage and condition',
      timeframe: 'At return',
      priority: 'high',
    },
  ];

  const wearAndTearExamples = {
    normal: [
      'Minor scratches less than 2 inches',
      'Small door edge chips (nickel-sized)',
      'Tire wear within manufacturer limits',
      'Minor interior wear on seats',
      'Small stone chips on hood',
      'Light carpet wear in normal areas',
    ],
    excessive: [
      'Scratches or dents over 2 inches',
      'Cracked or broken glass',
      'Tire tread below 4/32 inch',
      'Burns, cuts, or tears in upholstery',
      'Missing parts or equipment',
      'Strong odors (smoke, pet, etc.)',
      'Damaged wheels or rims',
      'Non-functioning equipment',
    ],
  };

  const options = [
    {
      title: 'Return the Vehicle',
      description: 'Walk away and lease/buy a new vehicle or end your relationship with us',
      icon: Car,
      pros: ['No further obligations', 'Start fresh with a new vehicle', 'Lower monthly payment on new lease'],
      cons: ['No equity built', 'May have end-of-lease charges', 'Disposition fee ($395)'],
      bestFor: 'Those who want the latest model and don\'t want ownership responsibilities',
    },
    {
      title: 'Buy Your Leased Vehicle',
      description: 'Purchase your current vehicle for the predetermined residual value',
      icon: DollarSign,
      pros: ['You know the vehicle history', 'No excessive wear charges', 'Potentially below market value'],
      cons: ['May need new financing', 'Vehicle is 3 years old', 'You\'re responsible for all repairs'],
      bestFor: 'Those who love their current vehicle and want to keep it long-term',
    },
    {
      title: 'Trade In for New Lease',
      description: 'Use any equity in your current lease toward a new Toyota lease',
      icon: CheckCircle2,
      pros: ['No return inspection needed', 'May have positive equity', 'Drive a new vehicle immediately'],
      cons: ['Continuing monthly payments', 'New commitment period', 'Mileage restrictions continue'],
      bestFor: 'Those who enjoy driving new vehicles and want to continue leasing',
    },
  ];

  const toggleItem = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progress = (checkedItems.length / checklist.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">Lease End Assistance</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We'll guide you through every step of your lease end process, from 9 months out to final return.
        </p>
      </motion.div>

      {/* Timeline Alert */}
      {monthsUntilEnd <= 9 && monthsUntilEnd > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            Your lease ends in <strong>{monthsUntilEnd} months</strong> (
            {leaseEndDate.toLocaleDateString()}). It's time to start preparing!
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Card */}
      <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900">Your Progress</h3>
            <p className="text-sm text-gray-600">
              {checkedItems.length} of {checklist.length} items completed
            </p>
          </div>
          <div className="text-3xl text-green-600">{Math.round(progress)}%</div>
        </div>
        <Progress value={progress} className="h-3" />
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="checklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="wear-tear">Wear & Tear</TabsTrigger>
          <TabsTrigger value="options">Your Options</TabsTrigger>
        </TabsList>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4">
          {checklist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all ${
                  checkedItems.includes(item.id)
                    ? 'bg-green-50 border-green-200'
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {checkedItems.includes(item.id) ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`text-gray-900 ${checkedItems.includes(item.id) ? 'line-through' : ''}`}>
                        {item.title}
                      </h4>
                      <div className="flex gap-2">
                        <Badge
                          variant={item.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.timeframe}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800 mb-4">
                  Our lease end specialists are here to guide you through each step. Schedule a consultation to review your specific situation.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Wear & Tear Tab */}
        <TabsContent value="wear-tear" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Understanding what's considered normal vs excessive wear can save you hundreds in charges at lease end.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Normal Wear */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-gray-900">Normal Wear & Tear</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                These are typically accepted without additional charges:
              </p>
              <ul className="space-y-2">
                {wearAndTearExamples.normal.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Excessive Wear */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-gray-900">Excessive Wear & Tear</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                These will likely result in additional charges:
              </p>
              <ul className="space-y-2">
                {wearAndTearExamples.excessive.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Visual Examples */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Common Wear & Tear Scenarios</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-sm text-gray-900">Tire Tread Depth</h4>
                <p className="text-xs text-gray-600">Must be at least 4/32 inch. Use the penny test to check.</p>
                <Badge className="bg-green-600">Acceptable</Badge>
              </div>
              <div className="space-y-2">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-sm text-gray-900">Door Dings & Dents</h4>
                <p className="text-xs text-gray-600">Under 2 inches acceptable. Larger dents need repair.</p>
                <Badge variant="destructive">Charge if &gt;2&quot;</Badge>
              </div>
              <div className="space-y-2">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-sm text-gray-900">Interior Stains</h4>
                <p className="text-xs text-gray-600">Light wear OK. Deep stains or tears will incur charges.</p>
                <Badge variant="secondary">Varies</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-purple-50 border-purple-200">
            <h3 className="text-gray-900 mb-3">Pro Tip: Pre-Inspection</h3>
            <p className="text-sm text-gray-700 mb-4">
              Schedule a free pre-inspection 3-6 months before your lease ends. This gives you time to make cost-effective repairs before the official inspection.
            </p>
            <Button>Schedule Pre-Inspection</Button>
          </Card>
        </TabsContent>

        {/* Options Tab */}
        <TabsContent value="options" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {options.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                    <option.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{option.description}</p>

                  <div className="mb-4">
                    <div className="text-xs text-green-700 mb-2">Pros:</div>
                    <ul className="space-y-1">
                      {option.pros.map((pro) => (
                        <li key={pro} className="text-xs text-gray-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-red-700 mb-2">Cons:</div>
                    <ul className="space-y-1">
                      {option.cons.map((con) => (
                        <li key={con} className="text-xs text-gray-600 flex items-start gap-2">
                          <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">Best for:</div>
                    <p className="text-xs text-gray-700">{option.bestFor}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Calculator CTA */}
          <Card className="p-8 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
            <h3 className="text-white mb-2">Not Sure Which Option to Choose?</h3>
            <p className="text-red-50 mb-6">
              Use our calculator to compare the costs of each option based on your specific situation
            </p>
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
              Compare Your Options
            </Button>
          </Card>

          {/* Important Dates */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Important Dates & Deadlines</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900">Decision Deadline</div>
                  <div className="text-xs text-gray-600">Let us know your choice</div>
                </div>
                <Badge>30 days before</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900">Final Inspection</div>
                  <div className="text-xs text-gray-600">Schedule your return appointment</div>
                </div>
                <Badge>2 weeks before</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900">Lease End Date</div>
                  <div className="text-xs text-gray-600">Vehicle must be returned by</div>
                </div>
                <Badge variant="destructive">{leaseEndDate.toLocaleDateString()}</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact CTA */}
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-gray-900 mb-2">Questions About Your Lease End?</h3>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Our dedicated lease-end team is here to help. We'll review your lease agreement, discuss your options, and answer all your questions.
        </p>
        <div className="flex gap-4 justify-center">
          <Button>Call Us: (800) 555-0123</Button>
          <Button variant="outline">Email Support</Button>
        </div>
      </Card>
    </div>
  );
}
