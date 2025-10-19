import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Fuel, Car as CarIcon, MapPin, TrendingUp, Award, Star, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function IncentivesProgram() {
  const [points, setPoints] = useState(2450);
  const [tier, setTier] = useState<'silver' | 'gold' | 'platinum'>('gold');

  const tiers = [
    { name: 'Silver', min: 0, max: 1999, color: 'bg-gray-400', benefits: 3 },
    { name: 'Gold', min: 2000, max: 4999, color: 'bg-yellow-500', benefits: 5 },
    { name: 'Platinum', min: 5000, max: Infinity, color: 'bg-purple-600', benefits: 8 },
  ];

  const currentTier = tiers.find((t) => t.name.toLowerCase() === tier)!;
  const nextTier = tiers[tiers.findIndex((t) => t.name.toLowerCase() === tier) + 1];
  const tierProgress = nextTier
    ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const gasStations = [
    {
      name: 'Shell',
      discount: '15¢/gal',
      logo: '🛢️',
      distance: '0.3 mi',
      address: '123 Main St',
      premium: true,
    },
    {
      name: 'Chevron',
      discount: '12¢/gal',
      logo: '⛽',
      distance: '0.5 mi',
      address: '456 Oak Ave',
      premium: true,
    },
    {
      name: 'BP',
      discount: '10¢/gal',
      logo: '🛢️',
      distance: '0.8 mi',
      address: '789 Elm St',
      premium: false,
    },
    {
      name: '76',
      discount: '8¢/gal',
      logo: '⛽',
      distance: '1.2 mi',
      address: '321 Pine Rd',
      premium: false,
    },
  ];

  const rewards = [
    {
      title: 'Gas Discount',
      points: 500,
      value: '$25',
      description: '$25 gas card for partner stations',
      icon: Fuel,
      category: 'gas',
    },
    {
      title: 'Rental Car Day',
      points: 750,
      value: '$75',
      description: 'Free rental day (up to $75 value)',
      icon: CarIcon,
      category: 'rental',
    },
    {
      title: 'Service Discount',
      points: 1000,
      value: '$100',
      description: '$100 off your next service',
      icon: Award,
      category: 'service',
    },
    {
      title: 'Gas Discount XL',
      points: 1500,
      value: '$75',
      description: '$75 gas card for partner stations',
      icon: Fuel,
      category: 'gas',
    },
    {
      title: 'Weekend Rental',
      points: 2000,
      value: '$200',
      description: 'Free weekend rental (Fri-Mon)',
      icon: CarIcon,
      category: 'rental',
    },
    {
      title: 'Premium Service',
      points: 2500,
      value: '$250',
      description: 'Premium service package',
      icon: Award,
      category: 'service',
    },
  ];

  const activities = [
    { action: 'Monthly payment on time', points: 50, frequency: 'Monthly' },
    { action: 'Refer a friend', points: 500, frequency: 'Per referral' },
    { action: 'Service at Toyota dealer', points: 100, frequency: 'Per visit' },
    { action: 'Complete satisfaction survey', points: 25, frequency: 'Per survey' },
    { action: 'Lease renewal', points: 1000, frequency: 'One-time' },
    { action: 'Social media share', points: 10, frequency: 'Per share' },
  ];

  const recentActivity = [
    { date: 'Oct 5, 2025', action: 'Payment received', points: 50 },
    { date: 'Sep 28, 2025', action: 'Service visit', points: 100 },
    { date: 'Sep 15, 2025', action: 'Survey completed', points: 25 },
    { date: 'Sep 5, 2025', action: 'Payment received', points: 50 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">Iota Rewards Program</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn points on payments, services, and referrals. Redeem for gas discounts, rental cars, and more.
        </p>
      </motion.div>

      {/* Points Dashboard */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-8 bg-gradient-to-br from-red-600 to-red-700 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-red-100 mb-1">Your Points Balance</div>
              <div className="text-5xl">{points.toLocaleString()}</div>
              <div className="text-red-100 mt-2">points available</div>
            </div>
            <Badge className={`${currentTier.color} text-white text-lg px-4 py-2`}>
              {currentTier.name}
            </Badge>
          </div>

          {nextTier && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-100">Progress to {nextTier.name}</span>
                <span className="text-sm text-red-100">
                  {nextTier.min - points} points to go
                </span>
              </div>
              <Progress value={tierProgress} className="h-2 bg-red-800" />
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900">{currentTier.name} Benefits</h3>
              <p className="text-xs text-gray-600">{currentTier.benefits} exclusive perks</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              Gas discounts at {currentTier.name === 'silver' ? '100+' : currentTier.name === 'gold' ? '250+' : '500+'} stations
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              {currentTier.name === 'silver' ? '5%' : currentTier.name === 'gold' ? '10%' : '15%'} bonus points
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              Priority customer service
            </div>
            {currentTier.name !== 'silver' && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Exclusive rental car rates
              </div>
            )}
            {currentTier.name === 'platinum' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  Concierge service
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  VIP event access
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rewards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="gas">Gas Stations</TabsTrigger>
          <TabsTrigger value="earn">Earn Points</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Rewards Catalog */}
        <TabsContent value="rewards">
          <div className="grid md:grid-cols-3 gap-6">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                    <reward.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-gray-900 mb-1.5">{reward.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex-1">{reward.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">
                      {reward.points} pts
                    </Badge>
                    <span className="text-sm text-green-600">{reward.value} value</span>
                  </div>
                  <Button
                    className="w-full"
                    disabled={points < reward.points}
                    variant={points >= reward.points ? 'default' : 'secondary'}
                  >
                    {points >= reward.points ? 'Redeem' : `Need ${reward.points - points} more`}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Gas Stations */}
        <TabsContent value="gas">
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Fuel className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">How Gas Rewards Work</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Partner gas stations pay to be featured in our app, and we pass those savings directly to you!
                    Simply redeem points for gas cards or show your Iota Rewards card at checkout.
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-green-600">Save up to 25¢/gallon</Badge>
                    <Badge variant="secondary">500+ partner locations</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {gasStations.map((station, index) => (
                <motion.div
                  key={station.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-6 ${station.premium ? 'border-2 border-yellow-300 bg-yellow-50/30' : ''}`}>
                    {station.premium && (
                      <Badge className="mb-3 bg-yellow-500">Premium Partner</Badge>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{station.logo}</div>
                        <div>
                          <h4 className="text-gray-900">{station.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {station.distance}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-green-600">{station.discount}</div>
                        <div className="text-xs text-gray-600">discount</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">{station.address}</div>
                    <Button variant="outline" className="w-full gap-2 group">
                      Get Directions
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="p-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Find More Stations Near You</h3>
              <p className="text-gray-600 mb-4">
                Search for partner gas stations anywhere in the country
              </p>
              <Button>Search Locations</Button>
            </Card>
          </div>
        </TabsContent>

        {/* Earn Points */}
        <TabsContent value="earn">
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Ways to Earn Points</h3>
                  <p className="text-sm text-gray-700">
                    Earn points for everyday activities and maximize your rewards. The more you engage, the more you save!
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gray-900">{activity.action}</h4>
                      <Badge className="bg-green-600 text-lg px-3 py-1">
                        +{activity.points}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{activity.frequency}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bonus Opportunities */}
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">Limited Time Bonus</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Earn <strong>double points</strong> on all activities through the end of October!
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-orange-600">2x Points</Badge>
                    <Badge variant="secondary">Ends Oct 31</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Referral Program */}
            <Card className="p-8 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
              <h3 className="text-white mb-2">Refer a Friend, Earn 500 Points</h3>
              <p className="text-red-50 mb-6">
                When your friend finances or leases through Iota, you both get rewarded
              </p>
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                Get Your Referral Link
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* Activity History */}
        <TabsContent value="activity">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="text-gray-900">{item.action}</div>
                    <div className="text-sm text-gray-600">{item.date}</div>
                  </div>
                  <Badge className="bg-green-600 text-lg">+{item.points}</Badge>
                </motion.div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6">
              View All Activity
            </Button>
          </Card>

          {/* Monthly Summary */}
          <Card className="p-6 mt-6">
            <h3 className="text-gray-900 mb-6">October Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl text-gray-900 mb-1">225</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-600">Points Redeemed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gray-900 mb-1">6</div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
