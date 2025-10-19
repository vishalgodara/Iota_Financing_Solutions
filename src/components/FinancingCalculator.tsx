import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, Calendar, Percent, Car, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import type { UserProfile, SelectedVehicle } from '../App';

type Accessory = {
  id: string;
  name: string;
  price: number;
  options?: { id: string; name: string; price: number }[];
};

type Props = {
  userProfile: UserProfile;
  selectedVehicle: SelectedVehicle | null;
};

export default function FinancingCalculator({ userProfile, selectedVehicle }: Props) {
  const [vehiclePrice, setVehiclePrice] = useState(selectedVehicle?.msrp || 35000);
  const [downPayment, setDownPayment] = useState(userProfile.financial.downPayment || 5000);
  const [creditScore, setCreditScore] = useState(700);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [financeTerm, setFinanceTerm] = useState(60);
  const [annualMileage, setAnnualMileage] = useState(12000);
  
  // Accessories state
  const [selectedColor, setSelectedColor] = useState<string>('pearl-white');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  
  // Insurance state
  const [includeInsurance, setIncludeInsurance] = useState(false);
  
  // Define accessories
  const colors = [
    { id: 'pearl-white', name: 'Pearl White', price: 0 },
    { id: 'midnight-black', name: 'Midnight Black', price: 395 },
    { id: 'silver-metallic', name: 'Silver Metallic', price: 395 },
    { id: 'ruby-red', name: 'Ruby Red', price: 595 },
  ];
  
  const accessories: Accessory[] = [
    { id: 'floor-mats', name: 'All-Weather Floor Mats', price: 229 },
    { id: 'seat-covers', name: 'Premium Seat Covers', price: 349 },
    { id: 'wheel-locks', name: 'Alloy Wheel Locks', price: 85 },
    { id: 'bike-rack', name: 'Bike Rack', price: 450 },
  ];
  
  // Calculate total accessories cost
  const accessoriesCost = 
    (colors.find(c => c.id === selectedColor)?.price || 0) +
    accessories
      .filter(acc => selectedAccessories.includes(acc.id))
      .reduce((sum, acc) => sum + acc.price, 0);
  
  const totalVehiclePrice = vehiclePrice + accessoriesCost;
  
  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };
  
  // Calculate insurance cost based on vehicle model
  const getMonthlyInsurance = (): number => {
    if (!includeInsurance || !selectedVehicle) return 0;
    
    const model = selectedVehicle.model.toLowerCase();
    
    // Insurance rates by model
    if (model.includes('camry')) return 135;
    if (model.includes('corolla') && !model.includes('cross')) return 120;
    if (model.includes('corolla cross')) return 145;
    if (model.includes('prius')) return 130;
    if (model.includes('rav4')) return 165;
    if (model.includes('highlander')) return 185;
    if (model.includes('grand highlander')) return 195;
    if (model.includes('4runner')) return 180;
    if (model.includes('tacoma')) return 160;
    if (model.includes('tundra')) return 175;
    if (model.includes('bz4x')) return 140;
    if (model.includes('sienna')) return 150;
    
    // Default insurance for unknown models
    return 150;
  };
  
  const monthlyInsurance = getMonthlyInsurance();

  // Calculate interest rate based on credit score
  const getInterestRate = (score: number): number => {
    if (score >= 750) return 3.5;
    if (score >= 700) return 4.5;
    if (score >= 650) return 6.5;
    if (score >= 600) return 9.0;
    return 12.0;
  };

  const interestRate = getInterestRate(creditScore);

  // Update vehicle price when selectedVehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      setVehiclePrice(selectedVehicle.msrp);
    }
  }, [selectedVehicle]);

  // Calculate lease payment
  const calculateLease = () => {
    const residualPercent = 0.55; // 55% residual after 3 years
    const moneyFactor = 0.00125; // ~3% APR
    const residualValue = totalVehiclePrice * residualPercent;
    const depreciation = (totalVehiclePrice - downPayment - residualValue) / leaseTerm;
    const financing = (totalVehiclePrice - downPayment + residualValue) * moneyFactor;
    const basePayment = depreciation + financing;
    
    // Adjust for mileage - standard is 12,000 miles/year
    const standardMileage = 12000;
    const mileageAdjustment = ((annualMileage - standardMileage) / 1000) * 15; // $15 per 1000 miles over/under
    
    return Math.round(basePayment + mileageAdjustment + monthlyInsurance);
  };

  // Calculate finance payment
  const calculateFinance = () => {
    const principal = totalVehiclePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, financeTerm)) /
      (Math.pow(1 + monthlyRate, financeTerm) - 1);
    return Math.round(payment + monthlyInsurance);
  };

  // Calculate total costs
  const leaseTotalCost = calculateLease() * leaseTerm + downPayment;
  const financeTotalCost = calculateFinance() * financeTerm + downPayment;

  // Predict resale value
  const predictResaleValue = () => {
    const yearsOwned = financeTerm / 12;
    const mileage = annualMileage * yearsOwned;
    let depreciationRate = 0.15; // Base 15% per year

    // Adjust for mileage
    if (mileage > 75000) depreciationRate += 0.05;
    if (mileage < 30000) depreciationRate -= 0.03;

    const resalePercent = Math.max(0.35, 1 - depreciationRate * yearsOwned);
    return Math.round(totalVehiclePrice * resalePercent);
  };

  const resaleValue = predictResaleValue();
  const netFinanceCost = financeTotalCost - resaleValue;

  return (
    <div className="space-y-8">
      {/* Selected Vehicle Badge */}
      {selectedVehicle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Calculating for:</div>
                <div className="text-gray-900">
                  {selectedVehicle.year} {selectedVehicle.model} {selectedVehicle.trim}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">MSRP</div>
                <div className="text-red-600">${selectedVehicle.msrp.toLocaleString()}</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Accessories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900">Customize Your Vehicle</h3>
              <p className="text-sm text-gray-600 mt-1">Add accessories and options to personalize your vehicle</p>
            </div>
            {accessoriesCost > 0 && (
              <Badge className="bg-purple-600 text-lg px-4 py-2">
                +${accessoriesCost.toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <Label className="text-gray-700 mb-3 block">Exterior Color</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    selectedColor === color.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-gray-300 ${
                        color.id === 'pearl-white' ? 'bg-white' :
                        color.id === 'midnight-black' ? 'bg-black' :
                        color.id === 'silver-metallic' ? 'bg-gray-400' :
                        'bg-red-600'
                      }`}
                    />
                    {selectedColor === color.id && (
                      <Check className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-900">{color.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {color.price === 0 ? 'Standard' : `+${color.price}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessories Selection */}
          <div>
            <Label className="text-gray-700 mb-3 block">Accessories & Add-ons</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accessories.map((accessory) => (
                <button
                  key={accessory.id}
                  onClick={() => toggleAccessory(accessory.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAccessories.includes(accessory.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{accessory.name}</div>
                      <div className="text-xs text-gray-600 mt-1">+${accessory.price}</div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                        selectedAccessories.includes(accessory.id)
                          ? 'bg-red-600 border-red-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedAccessories.includes(accessory.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Total Price Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base MSRP</span>
                <span className="text-gray-900">${vehiclePrice.toLocaleString()}</span>
              </div>
              {accessoriesCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accessories & Options</span>
                  <span className="text-purple-600">+${accessoriesCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total Vehicle Price</span>
                <span className="text-red-600 text-lg">${totalVehiclePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Insurance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900">Add Insurance Coverage</h3>
              <p className="text-sm text-gray-600 mt-1">Protect your investment with comprehensive insurance</p>
            </div>
            {includeInsurance && (
              <Badge className="bg-blue-600 text-lg px-4 py-2">
                +${monthlyInsurance}/mo
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIncludeInsurance(!includeInsurance)}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                includeInsurance
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        includeInsurance
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {includeInsurance && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <h4 className="text-gray-900">
                      {includeInsurance ? 'Insurance Included' : 'Add Insurance Coverage'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-9">
                    Comprehensive coverage including collision, liability, and comprehensive protection
                  </p>
                  {selectedVehicle && (
                    <div className="mt-3 ml-9">
                      <p className="text-sm text-gray-700">
                        Estimated for: <span className="font-medium">{selectedVehicle.model}</span>
                      </p>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        ${monthlyInsurance}/month
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>

            {includeInsurance && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-50 rounded-lg p-4 border border-blue-200"
              >
                <h4 className="text-gray-900 text-sm mb-2">✓ Coverage Includes:</h4>
                <ul className="text-xs text-gray-700 space-y-1.5 ml-4">
                  <li>• Collision coverage up to vehicle value</li>
                  <li>• Comprehensive coverage (theft, vandalism, natural disasters)</li>
                  <li>• Liability coverage ($300,000 minimum)</li>
                  <li>• Medical payments coverage</li>
                  <li>• Uninsured/underinsured motorist protection</li>
                  <li>• Roadside assistance & towing</li>
                </ul>
                <p className="text-xs text-gray-600 mt-3">
                  * Actual rates may vary based on your driving history, location, and coverage preferences
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Input Controls */}
      <Card className="p-8">
        <h3 className="text-gray-900 mb-6">Adjust Your Parameters</h3>
        
        <div className="space-y-6">
          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-700">Down Payment</Label>
              <span className="text-xl text-red-600">${downPayment.toLocaleString()}</span>
            </div>
            <Slider
              value={[downPayment]}
              onValueChange={([value]) => setDownPayment(value)}
              min={0}
              max={15000}
              step={500}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$7,500</span>
              <span>$15,000</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Applies to both lease and finance options</p>
          </div>

          {/* Credit Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-700">Credit Score</Label>
              <div className="flex items-center gap-2">
                <span className="text-xl text-red-600">{creditScore}</span>
                <span className="text-sm text-gray-500">({interestRate.toFixed(1)}% APR)</span>
              </div>
            </div>
            <Slider
              value={[creditScore]}
              onValueChange={([value]) => setCreditScore(value)}
              min={550}
              max={850}
              step={10}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>550</span>
              <span>700</span>
              <span>850</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Your credit score determines your interest rate for financing</p>
          </div>

          {/* Annual Mileage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-700">Estimated Annual Mileage</Label>
              <span className="text-xl text-red-600">{annualMileage.toLocaleString()} mi</span>
            </div>
            <Slider
              value={[annualMileage]}
              onValueChange={([value]) => setAnnualMileage(value)}
              min={5000}
              max={25000}
              step={1000}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5,000</span>
              <span>15,000</span>
              <span>25,000</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Affects lease pricing and finance resale value</p>
          </div>
        </div>
      </Card>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Lease Option */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex"
        >
          <Card className="p-6 border-2 border-red-600 bg-red-50/50 flex flex-col w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-black">Lease</h3>
              <Badge className="bg-red-600">More savings</Badge>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              {/* Monthly Payment */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-900 mb-1">Monthly Payment</div>
                <div className="text-3xl text-red-600">${calculateLease()}</div>
                <div className="text-xs text-gray-700 mt-1">{leaseTerm}-month term</div>
              </div>

              {/* Term Selector */}
              <div>
                <Label className="text-sm text-gray-900 mb-2 block">Lease Term</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[24, 36, 48].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLeaseTerm(term)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        leaseTerm === term
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-black hover:bg-gray-300'
                      }`}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 pt-4 border-t border-red-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Lease Payments</span>
                  <span className="text-gray-900">${(calculateLease() * leaseTerm).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Down Payment</span>
                  <span className="text-gray-900">${downPayment.toLocaleString()}</span>
                </div>
                {includeInsurance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Insurance ({leaseTerm} months)</span>
                    <span className="text-gray-900">${(monthlyInsurance * leaseTerm).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-blue-100">
                  <span className="text-gray-700">Total Cost</span>
                  <span className="text-red-600 font-bold">${leaseTotalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-800 mb-2">✓ Advantages</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Lower monthly payments</li>
                  <li>• Always drive a newer vehicle</li>
                  <li>• Warranty coverage included</li>
                  <li>• Option to buy at lease end</li>
                </ul>
              </div>

              {/* Mileage Warning */}
              {annualMileage > 12000 && (
                <div className="bg-amber-30 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-900">
                    ⚠️ High mileage may incur additional fees (typically $0.20-$0.30 per excess mile)
                  </p>
                </div>
              )}

              {/* Spacer to push Monthly Savings to bottom */}
              <div className="flex-1"></div>

              {/* Monthly Savings */}
              <div className="bg-white rounded-lg p-4 border-2 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700">Monthly Savings</span>
                </div>
                <div className="text-2xl text-red-600">
                  ${Math.abs(calculateFinance() - calculateLease())}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {calculateLease() < calculateFinance() ? 'vs. financing' : 'vs. leasing'}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Finance Option */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex"
        >
          <Card className="p-6 border-2 border-black bg-gray-100 flex flex-col w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Finance</h3>
              <Badge className="bg-gray-700">Own the Vehicle</Badge>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              {/* Monthly Payment */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                <div className="text-3xl text-green-600">${calculateFinance()}</div>
                <div className="text-xs text-gray-500 mt-1">{financeTerm}-month term</div>
              </div>

              {/* Term Selector */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Finance Term</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[48, 60, 72].map((term) => (
                    <button
                      key={term}
                      onClick={() => setFinanceTerm(term)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        financeTerm === term
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 pt-4 border-t border-green-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Finance Payments</span>
                  <span className="text-gray-900">${(calculateFinance() * financeTerm).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Down Payment</span>
                  <span className="text-gray-900">${downPayment.toLocaleString()}</span>
                </div>
                {includeInsurance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Insurance ({financeTerm} months)</span>
                    <span className="text-gray-900">${(monthlyInsurance * financeTerm).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Predicted Resale Value</span>
                  <span className="text-green-600">-${resaleValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-green-100">
                  <span className="text-gray-700">Net Cost</span>
                  <span className="text-green-600">${netFinanceCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-700 mb-2">✓ Advantages</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• You own the vehicle</li>
                  <li>• No mileage restrictions</li>
                  <li>• Build equity over time</li>
                  <li>• Can sell or trade anytime</li>
                </ul>
              </div>

              {/* Spacer to push Resale Prediction to bottom */}
              <div className="flex-1"></div>

              {/* Resale Prediction */}
              <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Predicted Resale Value</span>
                </div>
                <div className="text-2xl text-green-600">${resaleValue.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">
                  After {financeTerm / 12} years with {(annualMileage * financeTerm / 12).toLocaleString()} miles
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">Our Recommendation</h3>
              {netFinanceCost < leaseTotalCost ? (
                <div>
                  <p className="text-gray-700 mb-3">
                    <strong>Financing is the better value</strong> for your situation. You'll save approximately{' '}
                    <strong className="text-green-600">${(leaseTotalCost - netFinanceCost).toLocaleString()}</strong> over {financeTerm / 12} years,
                    and you'll own the vehicle at the end.
                  </p>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <Badge variant="secondary">✓ Lower total cost</Badge>
                    <Badge variant="secondary">✓ You keep the vehicle</Badge>
                    <Badge variant="secondary">✓ No mileage limits</Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 mb-3">
                    <strong>Leasing may be better</strong> for you. With total lower payments of{' '}
                    <strong className="text-blue-600">${calculateLease() * leaseTerm.toLocaleString() + downPayment}</strong>, you'll have more financial flexibility
                    and can drive a new vehicle every few years.
                  </p>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <Badge variant="secondary">✓ Lower monthly payment</Badge>
                    <Badge variant="secondary">✓ Drive newer vehicles</Badge>
                    <Badge variant="secondary">✓ Warranty coverage</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

    </div>
  );
}
