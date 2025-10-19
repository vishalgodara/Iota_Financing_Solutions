import { useState } from 'react';
import { motion } from 'motion/react';
import { Car, Zap, ChevronDown, Heart, Share2, Users, RefreshCw, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { localVehicles } from '../data/vehicleData';
// Local SelectedVehicle type (matches App.SelectedVehicle shape)
type SelectedVehicle = {
  model: string;
  trim: string;
  year: number;
  msrp: number;
  mpg_city: number;
  mpg_highway: number;
};

type UserProfile = {
  lifestyle: {
    dailyCommute: number;
    vehicleType: 'sedan' | 'suv' | 'truck' | 'van' | '';
    powerTrain: 'electric' | 'hybrid' | 'gas' | '';
  };
  financial: {
    targetPayment: number;
    downPayment: number;
    creditScore: string;
  };
  completed: boolean;
};

type Props = {
  userProfile: UserProfile;
  onScheduleAppointment: () => void;
  onCalculatePayments: (vehicle: SelectedVehicle) => void;
};

type VehicleRecommendation = {
  id: string;
  model: string;
  year: number;
  trim: string;
  category: string;
  powertrain: string;
  image: string;
  msrp: number;
  mpg_city: number;
  mpg_highway: number;
  leasePrice: number;
  financePrice: number;
  resaleValue: number;
  matchScore: number;
  features: string[];
  incentives: string[];
};

export default function VehicleRecommendations({ userProfile, onCalculatePayments }: Props) {
  const [viewMode, setViewMode] = useState<'lease' | 'finance'>('lease');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [adjustedBudget, setAdjustedBudget] = useState(userProfile.financial.targetPayment);
  const originalBudget = userProfile.financial.targetPayment;

  // Credit score to APR
  const parseCreditScoreRate = (score: string) => {
    const s = (score || '').toLowerCase();
    if (s.includes('excellent')) return 0.04;
    if (s.includes('good')) return 0.06;
    if (s.includes('fair')) return 0.09;
    if (s.includes('poor')) return 0.12;
    return 0.07;
  };

  // Finance calculation
  const calcFinanceMonthly = (msrp: number, downPayment: number, annualRate: number, months = 60) => {
    const principal = Math.max(0, msrp - (downPayment || 0));
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return Math.round(principal / months);
    const monthly = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return Math.round(monthly);
  };

  // Lease calculation
  const calcLeaseMonthly = (msrp: number, downPayment: number, annualRate: number, months = 36, residualPercent = 0.55) => {
    const capCost = Math.max(0, msrp - (downPayment || 0));
    const residual = msrp * residualPercent;
    const moneyFactor = annualRate / 2400;
    const depreciation = (capCost - residual) / months;
    const financeCharge = (capCost + residual) * moneyFactor;
    return Math.round(depreciation + financeCharge);
  };

  // Resale value calculation
  const computeResaleValue = (msrp: number, mpg: number, powerTrain: string) => {
    let base = 45;
    const msrpPenalty = (msrp / 1000) * 0.5;
    const mpgBonus = mpg * 0.2;

    // Hybrids and electrics tend to have better resale
    if (powerTrain === 'hybrid') base += 5;
    if (powerTrain === 'electric') base += 8;

    const value = base - msrpPenalty + mpgBonus;
    return Math.round(Math.max(15, Math.min(75, value)));
  };

  // Generate vehicle recommendations from database
  const generateRecommendations = (): VehicleRecommendation[] => {
    const recommendations: VehicleRecommendation[] = [];
    const annualRate = parseCreditScoreRate(userProfile.financial.creditScore);

    localVehicles.forEach((vehicle) => {
      vehicle.trims.forEach((trim) => {
        // Calculate monthly payments
        const financePrice = calcFinanceMonthly(
          trim.msrp,
          userProfile.financial.downPayment || 0,
          annualRate,
          60
        );
        const leasePrice = calcLeaseMonthly(
          trim.msrp,
          userProfile.financial.downPayment || 0,
          annualRate,
          36,
          0.55
        );

        // Calculate average MPG
        const avgMpg = (trim.mpg_city + trim.mpg_highway) / 2;

        // Determine powertrain (default to 'gas' if not specified)
        const powertrain = trim.powertrain || 'gas';

        // Calculate resale value
        const resaleValue = computeResaleValue(trim.msrp, avgMpg, powertrain);

        // Generate features based on vehicle characteristics
        const features: string[] = [];
        if (powertrain === 'hybrid') features.push('Hybrid Engine');
        if (powertrain === 'electric') features.push('Zero Emissions');
        if (avgMpg > 40) features.push('Excellent MPG');
        if (vehicle.category === 'suv') features.push('All-Wheel Drive');
        if (vehicle.category === 'truck') features.push('Towing Capable');

        // Generate incentives
        const incentives: string[] = [];
        if (powertrain === 'electric') incentives.push('$7,500 Federal Tax Credit');
        if (powertrain === 'hybrid') incentives.push('State Rebate Eligible');

        recommendations.push({
          id: `${vehicle.id}-${trim.name}`,
          model: vehicle.model,
          year: vehicle.year,
          trim: trim.name,
          category: vehicle.category,
          powertrain,
          image: vehicle.image_url,
          msrp: trim.msrp,
          mpg_city: trim.mpg_city,
          mpg_highway: trim.mpg_highway,
          leasePrice,
          financePrice,
          resaleValue,
          matchScore: 0,
          features,
          incentives,
        });
      });
    });

    return recommendations;
  };

  // Generate all recommendations
  const allRecommendations = generateRecommendations();

  // Score vehicle based on user preferences
  const scoreVehicle = (veh: VehicleRecommendation) => {
    let score = 0;

    // 1. Vehicle Category Match (40 points) - HIGHEST PRIORITY
    if (userProfile.lifestyle.vehicleType && userProfile.lifestyle.vehicleType === veh.category) {
      score += 40;
    }

    // 2. Powertrain Match (30 points) - SECOND PRIORITY
    if (userProfile.lifestyle.powerTrain && userProfile.lifestyle.powerTrain === veh.powertrain) {
      score += 30;
    }

    // 3. Monthly Payment Affordability (20 points) - CRITICAL FOR BUDGET
    const monthly = viewMode === 'lease' ? veh.leasePrice : veh.financePrice;
    const targetPayment = adjustedBudget;

    if (monthly <= targetPayment) {
      // Perfect - within budget
      score += 20;
    } else if (monthly <= targetPayment * 1.1) {
      // Slightly over budget (within 10%)
      score += 15;
    } else if (monthly <= targetPayment * 1.2) {
      // Moderately over budget (within 20%)
      score += 10;
    } else if (monthly <= targetPayment * 1.3) {
      // Over budget but possibly manageable
      score += 5;
    }
    // No points if more than 30% over budget

    // 4. Fuel Efficiency for Commute (7 points)
    const commuteMonthly = userProfile.lifestyle.dailyCommute * 22; // ~22 working days
    const avgMpg = (veh.mpg_city + veh.mpg_highway) / 2;
    const fuelValue = (avgMpg / 100) * Math.min(commuteMonthly / 100, 10);
    score += Math.min(7, fuelValue);

    // 5. Resale Value (3 points)
    score += (veh.resaleValue / 100) * 3;

    return Math.round(Math.max(0, Math.min(100, score)));
  };

  // Get recommended vehicles with filtering
  const getRecommendedVehicles = () => {
    const processed = allRecommendations.map((veh) => ({ ...veh, matchScore: scoreVehicle(veh) }));

    return processed
      .filter((v) => {
        // Get the monthly payment based on current view mode
        const monthly = viewMode === 'lease' ? v.leasePrice : v.financePrice;

        // STRICT FILTER: Only show vehicles within or equal to budget
        if (monthly > adjustedBudget) {
          return false;
        }

        // Filter by vehicle category if specified
        if (userProfile.lifestyle.vehicleType && v.category !== userProfile.lifestyle.vehicleType) {
          return false;
        }

        // Filter by powertrain if specified
        if (userProfile.lifestyle.powerTrain && v.powertrain !== userProfile.lifestyle.powerTrain) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by match score (highest first)
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }

        // If same score, sort by monthly payment (lowest first)
        const monthlyA = viewMode === 'lease' ? a.leasePrice : a.financePrice;
        const monthlyB = viewMode === 'lease' ? b.leasePrice : b.financePrice;
        return monthlyA - monthlyB;
      });
  };

  const recommendedVehicles = getRecommendedVehicles();

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Calculate affordability stats
  const affordableCount = recommendedVehicles.length;
  const totalVehiclesInCategory = allRecommendations.filter(v => {
    if (userProfile.lifestyle.vehicleType && v.category !== userProfile.lifestyle.vehicleType) return false;
    if (userProfile.lifestyle.powerTrain && v.powertrain !== userProfile.lifestyle.powerTrain) return false;
    return true;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-gray-900 mb-2">Your Personalized Matches</h2>
        <p className="text-gray-600">
          Based on your preferences, we found {affordableCount} vehicle{affordableCount !== 1 ? 's' : ''} within your budget
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Options</p>
              <p className="text-2xl text-gray-900">{affordableCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Status</p>
              <p className="text-2xl text-gray-900">${adjustedBudget}/mo</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Saved Favorites</p>
              <p className="text-2xl text-gray-900">{favorites.length}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Budget Adjustment Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900 mb-1">Adjust Your Budget</h3>
            <p className="text-sm text-gray-600">
              See how changing your budget affects available options
            </p>
          </div>
          {adjustedBudget !== originalBudget && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdjustedBudget(originalBudget)}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <Slider
            value={[adjustedBudget]}
            onValueChange={([value]) => setAdjustedBudget(value)}
            max={2000}
            min={200}
            step={50}
            className="w-full"
          />

          <div className="text-center">
            <div className="text-3xl text-red-600">${adjustedBudget}</div>
            <div className="text-sm text-gray-600">per month</div>
          </div>
        </div>
      </motion.div>

      {/* Lease vs Finance Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'lease' | 'finance')} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lease">Lease</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Vehicles Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {recommendedVehicles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 text-center py-12 bg-white rounded-2xl border border-gray-200"
          >
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No vehicles match your criteria</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your budget or preferences to see more options
            </p>
            <Button onClick={() => setAdjustedBudget(adjustedBudget + 100)}>
              Increase Budget
            </Button>
          </motion.div>
        ) : (
          recommendedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
                {/* Vehicle Image */}
                <div className="relative h-48 bg-gray-100">
                  <ImageWithFallback
                    src={vehicle.image}
                    alt={`${vehicle.model} ${vehicle.trim}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-white text-gray-900 hover:bg-gray-50">
                      {vehicle.matchScore}% Match
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`bg-white hover:bg-gray-50 ${favorites.includes(vehicle.id) ? 'text-red-600' : 'text-gray-600'}`}
                      onClick={() => toggleFavorite(vehicle.id)}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(vehicle.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900">{vehicle.year} {vehicle.model}</h3>
                        <p className="text-sm text-gray-600">{vehicle.trim}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-red-600">
                          ${viewMode === 'lease' ? vehicle.leasePrice : vehicle.financePrice}/mo
                        </div>
                        <div className="text-xs text-gray-500">
                          {viewMode === 'lease' ? '36-month lease' : '60-month loan'}
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">
                        {vehicle.powertrain}
                      </Badge>
                      <Badge variant="outline">
                        {vehicle.mpg_city}/{vehicle.mpg_highway} MPG
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {vehicle.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Features */}
                  {vehicle.features.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Key Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incentives */}
                  {vehicle.incentives.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        💰 {vehicle.incentives.join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Resale Value */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Resale Value</span>
                      <span className="text-gray-900">{vehicle.resaleValue}%</span>
                    </div>
                    <Progress value={vehicle.resaleValue} className="h-2" />
                  </div>

                  {/* Actions */}
                  <div className="card-content">
                    <Button
                      onClick={() => onCalculatePayments({
                        model: vehicle.model,
                        trim: vehicle.trim,
                        year: vehicle.year,
                        msrp: vehicle.msrp,
                        mpg_city: vehicle.mpg_city,
                        mpg_highway: vehicle.mpg_highway,
                      })}
                      className="flex-1 gap-2 bg-red-600 text-white hover:bg-red-700 hover:text-white"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculate Payments
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}