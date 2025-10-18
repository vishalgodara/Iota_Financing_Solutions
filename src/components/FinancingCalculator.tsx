import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, Calendar, Percent } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import type { UserProfile } from '../App';

type Props = {
  userProfile: UserProfile;
};

export default function FinancingCalculator({ userProfile }: Props) {
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(userProfile.financial.downPayment || 5000);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [financeTerm, setFinanceTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.5);
  const [annualMileage, setAnnualMileage] = useState(12000);

  // Calculate lease payment
  const calculateLease = () => {
    const residualPercent = 0.55; // 55% residual after 3 years
    const moneyFactor = 0.00125; // ~3% APR
    const residualValue = vehiclePrice * residualPercent;
    const depreciation = (vehiclePrice - downPayment - residualValue) / leaseTerm;
    const financing = (vehiclePrice - downPayment + residualValue) * moneyFactor;
    return Math.round(depreciation + financing);
  };

  // Calculate finance payment
  const calculateFinance = () => {
    const principal = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, financeTerm)) /
      (Math.pow(1 + monthlyRate, financeTerm) - 1);
    return Math.round(payment);
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
    return Math.round(vehiclePrice * resalePercent);
  };

  const resaleValue = predictResaleValue();
  const netFinanceCost = financeTotalCost - resaleValue;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">Lease vs Finance Calculator</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare your options side-by-side and see which one fits your budget and lifestyle better
        </p>
      </motion.div>

      {/* Input Controls */}
      <Card className="p-8">
        <h3 className="text-gray-900 mb-6">Adjust Your Parameters</h3>
        
        <div className="space-y-6">
          {/* Vehicle Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-700">Vehicle Price</Label>
              <span className="text-xl text-red-600">${vehiclePrice.toLocaleString()}</span>
            </div>
            <Slider
              value={[vehiclePrice]}
              onValueChange={([value]) => setVehiclePrice(value)}
              min={20000}
              max={60000}
              step={1000}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$20,000</span>
              <span>$40,000</span>
              <span>$60,000</span>
            </div>
          </div>

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
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-700">Interest Rate (APR)</Label>
              <span className="text-xl text-red-600">{interestRate.toFixed(1)}%</span>
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={([value]) => setInterestRate(value)}
              min={2.0}
              max={12.0}
              step={0.5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2.0%</span>
              <span>7.0%</span>
              <span>12.0%</span>
            </div>
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
        >
          <Card className="p-6 border-2 border-blue-200 bg-blue-50/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Lease</h3>
              <Badge className="bg-blue-600">Lower Monthly Payment</Badge>
            </div>

            <div className="space-y-4">
              {/* Monthly Payment */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                <div className="text-3xl text-blue-600">${calculateLease()}</div>
                <div className="text-xs text-gray-500 mt-1">{leaseTerm}-month term</div>
              </div>

              {/* Term Selector */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">Lease Term</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[24, 36, 48].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLeaseTerm(term)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        leaseTerm === term
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 pt-4 border-t border-blue-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Lease Payments</span>
                  <span className="text-gray-900">${(calculateLease() * leaseTerm).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Down Payment</span>
                  <span className="text-gray-900">${downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-blue-100">
                  <span className="text-gray-700">Total Cost</span>
                  <span className="text-blue-600">${leaseTotalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-700 mb-2">✓ Advantages</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Lower monthly payments</li>
                  <li>• Always drive a newer vehicle</li>
                  <li>• Warranty coverage included</li>
                  <li>• Option to buy at lease end</li>
                </ul>
              </div>

              {/* Mileage Warning */}
              {annualMileage > 12000 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-900">
                    ⚠️ High mileage may incur additional fees (typically $0.20-$0.30 per excess mile)
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Finance Option */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-2 border-green-200 bg-green-50/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Finance</h3>
              <Badge className="bg-green-600">Own the Vehicle</Badge>
            </div>

            <div className="space-y-4">
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

              {/* Resale Prediction */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">Predicted Resale Value</span>
                </div>
                <div className="text-2xl text-green-600 mb-1">${resaleValue.toLocaleString()}</div>
                <div className="text-xs text-green-700">
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
                    <strong>Leasing may be better</strong> for you. With lower monthly payments of{' '}
                    <strong className="text-blue-600">${calculateLease()}</strong>, you'll have more financial flexibility
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

      {/* Additional Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Monthly Savings</span>
          </div>
          <div className="text-2xl text-gray-900">
            ${Math.abs(calculateFinance() - calculateLease())}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {calculateLease() < calculateFinance() ? 'Lease is lower' : 'Finance is lower'}
          </div>
        </Card>

        <Card className="p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Total Payments</span>
          </div>
          <div className="text-2xl text-gray-900">
            {Math.max(leaseTerm, financeTerm)}
          </div>
          <div className="text-xs text-gray-600 mt-1">months of payments</div>
        </Card>

        <Card className="p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Est. Resale Rate</span>
          </div>
          <div className="text-2xl text-gray-900">
            {Math.round((resaleValue / vehiclePrice) * 100)}%
          </div>
          <div className="text-xs text-gray-600 mt-1">of original value</div>
        </Card>
      </div>
    </div>
  );
}
