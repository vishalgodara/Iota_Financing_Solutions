import { useState } from 'react';
import { motion } from 'motion/react';
import { Car, TrendingUp, Zap, DollarSign, Users, Gauge, Award, ChevronRight, Heart, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import type { UserProfile } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Props = {
  userProfile: UserProfile;
  onScheduleAppointment: () => void;
};

type Vehicle = {
  id: string;
  name: string;
  type: 'sedan' | 'suv';
  powerTrain: 'electric' | 'hybrid' | 'gas';
  image: string;
  msrp: number;
  leasePrice: number;
  financePrice: number;
  mpg: string;
  range?: string;
  seating: number;
  resaleValue: number;
  matchScore: number;
  features: string[];
  incentives: string[];
};

export default function VehicleRecommendations({ userProfile, onScheduleAppointment }: Props) {
  const [viewMode, setViewMode] = useState<'lease' | 'finance'>('lease');
  const [favorites, setFavorites] = useState<string[]>([]);

  const vehicles: Vehicle[] = [
    {
      id: 'camry-hybrid',
      name: 'Toyota Camry Hybrid',
      type: 'sedan',
      powerTrain: 'hybrid',
      image: 'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjA4MjQ4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      msrp: 29980,
      leasePrice: 349,
      financePrice: 485,
      mpg: '52 city / 50 hwy',
      seating: 5,
      resaleValue: 68,
      matchScore: 95,
      features: ['Apple CarPlay', 'Safety Sense 3.0', 'Adaptive Cruise Control', 'Lane Keeping Assist'],
      incentives: ['$1,500 Loyalty Bonus', '$500 College Grad Program'],
    },
    {
      id: 'rav4-hybrid',
      name: 'Toyota RAV4 Hybrid',
      type: 'suv',
      powerTrain: 'hybrid',
      image: 'https://images.unsplash.com/photo-1707726149138-879308167d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzdXYlMjBtb2Rlcm58ZW58MXx8fHwxNzYwODI0ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      msrp: 34580,
      leasePrice: 429,
      financePrice: 575,
      mpg: '41 city / 38 hwy',
      seating: 5,
      resaleValue: 72,
      matchScore: 92,
      features: ['AWD Standard', 'Premium Audio', 'Panoramic Sunroof', 'Power Liftgate'],
      incentives: ['$2,000 Hybrid Incentive', '$500 Loyalty Bonus'],
    },
    {
      id: 'bz4x',
      name: 'Toyota bZ4X',
      type: 'suv',
      powerTrain: 'electric',
      image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nfGVufDF8fHx8MTc2MDc4NjA5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      msrp: 43215,
      leasePrice: 499,
      financePrice: 695,
      mpg: 'N/A (Electric)',
      range: '252 miles',
      seating: 5,
      resaleValue: 65,
      matchScore: 88,
      features: ['Fast Charging', 'Heat Pump', 'Solar Roof Panel', 'One Motion Grip'],
      incentives: ['$7,500 Federal Tax Credit', '$2,000 State Rebate'],
    },
    {
      id: 'corolla-hybrid',
      name: 'Toyota Corolla Hybrid',
      type: 'sedan',
      powerTrain: 'hybrid',
      image: 'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjA4MjQ4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      msrp: 25150,
      leasePrice: 289,
      financePrice: 405,
      mpg: '53 city / 52 hwy',
      seating: 5,
      resaleValue: 70,
      matchScore: 90,
      features: ['LED Headlights', 'Smart Key', '8-inch Touchscreen', 'Toyota Safety Sense 2.5'],
      incentives: ['$1,000 College Grad Program', '$750 Military Rebate'],
    },
  ];

  // Filter vehicles based on user preferences
  const getRecommendedVehicles = () => {
    return vehicles
      .filter((v) => {
        if (userProfile.lifestyle.vehicleType && v.type !== userProfile.lifestyle.vehicleType) {
          return false;
        }
        if (userProfile.lifestyle.powerTrain && v.powerTrain !== userProfile.lifestyle.powerTrain) {
          return false;
        }
        const price = viewMode === 'lease' ? v.leasePrice : v.financePrice;
        if (price > userProfile.financial.targetPayment + 100) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const recommendedVehicles = getRecommendedVehicles();

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const calculateTotalCost = (vehicle: Vehicle, mode: 'lease' | 'finance') => {
    if (mode === 'lease') {
      return vehicle.leasePrice * 36; // 3 year lease
    } else {
      return vehicle.financePrice * 60; // 5 year finance
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Your Personalized Matches</h2>
            <p className="text-gray-600">
              Based on your preferences, we found {recommendedVehicles.length} vehicle{recommendedVehicles.length !== 1 ? 's' : ''} perfect for you
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {recommendedVehicles.length} Matches
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Daily Commute</div>
            <div className="text-gray-900">{userProfile.lifestyle.dailyCommute} mi/day</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Budget</div>
            <div className="text-gray-900">${userProfile.financial.targetPayment}/mo</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Passengers</div>
            <div className="text-gray-900">{userProfile.lifestyle.passengers} people</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Preference</div>
            <div className="text-gray-900 capitalize">{userProfile.lifestyle.powerTrain || 'Any'}</div>
          </div>
        </div>
      </motion.div>

      {/* Lease vs Finance Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'lease' | 'finance')} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="lease">Lease</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Vehicle Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {recommendedVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Match Score Badge */}
              {vehicle.matchScore >= 90 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-green-600 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    {vehicle.matchScore}% Match
                  </Badge>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(vehicle.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.includes(vehicle.id) ? 'fill-red-600 text-red-600' : 'text-gray-400'
                  }`}
                />
              </button>

              {/* Vehicle Image */}
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                <ImageWithFallback
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                {/* Vehicle Name & Type */}
                <div className="mb-4">
                  <h3 className="text-gray-900 mb-2">{vehicle.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="capitalize">
                      {vehicle.type}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {vehicle.powerTrain}
                    </Badge>
                    {vehicle.range && (
                      <Badge variant="outline">
                        <Zap className="w-3 h-3 mr-1" />
                        {vehicle.range}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl text-red-600">
                      ${viewMode === 'lease' ? vehicle.leasePrice : vehicle.financePrice}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {viewMode === 'lease' ? '36-month lease' : '60-month financing'} • MSRP ${vehicle.msrp.toLocaleString()}
                  </div>
                </div>

                {/* Key Specs */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">MPG</div>
                    <div className="text-sm text-gray-900">{vehicle.mpg.split('/')[0]}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Seats</div>
                    <div className="text-sm text-gray-900">{vehicle.seating}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Resale</div>
                    <div className="text-sm text-gray-900">{vehicle.resaleValue}%</div>
                  </div>
                </div>

                {/* Resale Value Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Predicted 3-Year Resale Value</span>
                    <span className="text-xs text-green-700">{vehicle.resaleValue}%</span>
                  </div>
                  <Progress value={vehicle.resaleValue} className="h-2" />
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">Key Features</div>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Incentives */}
                {vehicle.incentives.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="text-xs text-green-800 mb-1">Available Incentives</div>
                    {vehicle.incentives.map((incentive) => (
                      <div key={incentive} className="text-xs text-green-700">
                        • {incentive}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={onScheduleAppointment} className="flex-1 gap-2">
                    Schedule Test Drive
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Similar Customers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900">What Similar Customers Chose</h3>
            <p className="text-sm text-gray-600">Based on customers with similar profiles</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl text-gray-900 mb-1">67%</div>
            <div className="text-sm text-gray-600">Chose to lease</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl text-gray-900 mb-1">RAV4 Hybrid</div>
            <div className="text-sm text-gray-600">Most popular choice</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl text-gray-900 mb-1">4.8/5</div>
            <div className="text-sm text-gray-600">Average satisfaction</div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center"
      >
        <h3 className="text-white mb-2">Ready to Get Started?</h3>
        <p className="text-red-50 mb-6">
          Schedule an appointment to test drive your favorites and complete your paperwork online
        </p>
        <Button
          size="lg"
          onClick={onScheduleAppointment}
          className="bg-white text-red-600 hover:bg-red-50 gap-2"
        >
          Book Your Appointment
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
