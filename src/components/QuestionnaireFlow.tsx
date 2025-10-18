import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, MapPin, Users, Car, Zap, Wallet, TrendingUp, UserCheck, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import type { UserProfile } from '../App';

type Props = {
  onComplete: (profile: UserProfile) => void;
};

export default function QuestionnaireFlow({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<UserProfile>({
    lifestyle: {
      dailyCommute: 15,
      passengers: 1,
      vehicleType: '',
      powerTrain: '',
      primaryUse: '',
      parkingType: '',
    },
    financial: {
      monthlyIncome: 5000,
      targetPayment: 400,
      downPayment: 3000,
      creditScore: '',
      multipleOwners: false,
    },
    completed: false,
  });

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ ...answers, completed: true });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateLifestyle = (key: keyof UserProfile['lifestyle'], value: any) => {
    setAnswers({
      ...answers,
      lifestyle: { ...answers.lifestyle, [key]: value },
    });
  };

  const updateFinancial = (key: keyof UserProfile['financial'], value: any) => {
    setAnswers({
      ...answers,
      financial: { ...answers.financial, [key]: value },
    });
  };

  const getSuggestion = () => {
    const { dailyCommute } = answers.lifestyle;
    if (dailyCommute > 50) {
      return {
        type: 'Electric',
        reason: 'With your long commute, an electric vehicle will save you significantly on fuel costs. You could save up to $200/month on gas.',
        icon: '⚡',
      };
    } else if (dailyCommute > 25) {
      return {
        type: 'Hybrid',
        reason: 'A hybrid is perfect for your moderate commute, giving you great fuel economy without range anxiety.',
        icon: '🔋',
      };
    } else {
      return {
        type: 'Hybrid or Gas',
        reason: 'With your short commute, both options work well. Consider hybrid for better city fuel economy.',
        icon: '🚗',
      };
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 shadow-lg">
          {/* Step 1: Daily Commute */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">What is your daily commute?</h3>
                  <p className="text-sm text-gray-600">This helps us recommend the right powertrain</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Miles per day (round trip)</span>
                  <span className="text-2xl text-red-600">{answers.lifestyle.dailyCommute} mi</span>
                </div>
                <Slider
                  value={[answers.lifestyle.dailyCommute]}
                  onValueChange={([value]) => updateLifestyle('dailyCommute', value)}
                  min={0}
                  max={150}
                  step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 mi</span>
                  <span>75 mi</span>
                  <span>150 mi</span>
                </div>
              </div>

              {answers.lifestyle.dailyCommute > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"
                >
                  <p className="text-sm text-blue-900">
                    💡 Annual mileage estimate: <strong>{(answers.lifestyle.dailyCommute * 260).toLocaleString()} miles/year</strong>
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Step 2: Passengers */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">How many people do you typically drive?</h3>
                  <p className="text-sm text-gray-600">Including yourself</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Number of passengers</span>
                  <span className="text-2xl text-red-600">{answers.lifestyle.passengers}</span>
                </div>
                <Slider
                  value={[answers.lifestyle.passengers]}
                  onValueChange={([value]) => updateLifestyle('passengers', value)}
                  min={1}
                  max={8}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Just me</span>
                  <span>Small family</span>
                  <span>Large family</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Type */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Do you prefer a Sedan or an SUV?</h3>
                  <p className="text-sm text-gray-600">Based on your space and driving needs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateLifestyle('vehicleType', 'sedan')}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    answers.lifestyle.vehicleType === 'sedan'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">🚗</div>
                  <h4 className="text-gray-900 mb-2">Sedan</h4>
                  <p className="text-sm text-gray-600">Better fuel economy, easier parking, smooth ride</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateLifestyle('vehicleType', 'suv')}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    answers.lifestyle.vehicleType === 'suv'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">🚙</div>
                  <h4 className="text-gray-900 mb-2">SUV</h4>
                  <p className="text-sm text-gray-600">More space, higher seating, versatile cargo</p>
                </motion.div>
              </div>

              {answers.lifestyle.passengers > 5 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                >
                  <p className="text-sm text-amber-900">
                    💡 We recommend an SUV for your group size
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Step 4: Powertrain */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Electric, Hybrid, or Gas?</h3>
                  <p className="text-sm text-gray-600">We'll help you choose the best option</p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getSuggestion().icon}</div>
                  <div>
                    <h4 className="text-green-900 mb-1">Our Recommendation: {getSuggestion().type}</h4>
                    <p className="text-sm text-green-800">{getSuggestion().reason}</p>
                  </div>
                </div>
              </motion.div>

              <RadioGroup
                value={answers.lifestyle.powerTrain}
                onValueChange={(value) => updateLifestyle('powerTrain', value)}
              >
                <div className="space-y-3">
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                    answers.lifestyle.powerTrain === 'electric' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value="electric" id="electric" />
                    <Label htmlFor="electric" className="flex-1 cursor-pointer">
                      <div>
                        <div className="text-gray-900">Electric (BEV)</div>
                        <div className="text-sm text-gray-600">Zero emissions, lowest running costs</div>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                    answers.lifestyle.powerTrain === 'hybrid' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <Label htmlFor="hybrid" className="flex-1 cursor-pointer">
                      <div>
                        <div className="text-gray-900">Hybrid (HEV)</div>
                        <div className="text-sm text-gray-600">Great fuel economy, no range anxiety</div>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                    answers.lifestyle.powerTrain === 'gas' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value="gas" id="gas" />
                    <Label htmlFor="gas" className="flex-1 cursor-pointer">
                      <div>
                        <div className="text-gray-900">Gas</div>
                        <div className="text-sm text-gray-600">Lower upfront cost, familiar technology</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 5: Primary Use */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">What's the primary use for this vehicle?</h3>
                  <p className="text-sm text-gray-600">Help us understand your driving habits</p>
                </div>
              </div>

              <RadioGroup
                value={answers.lifestyle.primaryUse}
                onValueChange={(value) => updateLifestyle('primaryUse', value)}
              >
                <div className="space-y-3">
                  {[
                    { value: 'commute', label: 'Daily Commute', desc: 'Mostly work and back' },
                    { value: 'family', label: 'Family Transportation', desc: 'School runs, errands, activities' },
                    { value: 'recreation', label: 'Weekend Recreation', desc: 'Road trips and adventures' },
                    { value: 'business', label: 'Business Use', desc: 'Client visits, deliveries' },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                        answers.lifestyle.primaryUse === option.value ? 'border-red-600 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div>
                          <div className="text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.desc}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 6: Monthly Income */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">What is your monthly income?</h3>
                  <p className="text-sm text-gray-600">This helps us calculate affordable payments</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Monthly Income</span>
                  <span className="text-2xl text-red-600">${answers.financial.monthlyIncome.toLocaleString()}</span>
                </div>
                <Slider
                  value={[answers.financial.monthlyIncome]}
                  onValueChange={([value]) => updateFinancial('monthlyIncome', value)}
                  min={2000}
                  max={20000}
                  step={500}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$2,000</span>
                  <span>$10,000</span>
                  <span>$20,000+</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 Recommended budget: <strong>${Math.round(answers.financial.monthlyIncome * 0.15)}-${Math.round(answers.financial.monthlyIncome * 0.20)}/month</strong>
                  <br />
                  <span className="text-xs">Based on 15-20% of monthly income</span>
                </p>
              </div>
            </div>
          )}

          {/* Step 7: Target Payment */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">What's your target monthly payment?</h3>
                  <p className="text-sm text-gray-600">We'll show you what fits your budget</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Target Payment</span>
                  <span className="text-2xl text-red-600">${answers.financial.targetPayment}</span>
                </div>
                <Slider
                  value={[answers.financial.targetPayment]}
                  onValueChange={([value]) => updateFinancial('targetPayment', value)}
                  min={200}
                  max={1500}
                  step={25}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$200</span>
                  <span>$750</span>
                  <span>$1,500</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">Down Payment (Optional)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-xl text-gray-900">${answers.financial.downPayment.toLocaleString()}</span>
                </div>
                <Slider
                  value={[answers.financial.downPayment]}
                  onValueChange={([value]) => updateFinancial('downPayment', value)}
                  min={0}
                  max={15000}
                  step={500}
                  className="py-4"
                />
              </div>
            </div>
          )}

          {/* Step 8: Additional Info */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Just a few more details</h3>
                  <p className="text-sm text-gray-600">Help us personalize your experience</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-gray-700 mb-3 block">Credit Score Range</Label>
                  <RadioGroup
                    value={answers.financial.creditScore}
                    onValueChange={(value) => updateFinancial('creditScore', value)}
                  >
                    <div className="space-y-2">
                      {[
                        { value: 'excellent', label: 'Excellent (750+)' },
                        { value: 'good', label: 'Good (700-749)' },
                        { value: 'fair', label: 'Fair (650-699)' },
                        { value: 'building', label: 'Building Credit (<650)' },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                            answers.financial.creditScore === option.value
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer text-gray-900">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="multiple-owners" className="text-gray-900">Multiple Owners</Label>
                    <p className="text-sm text-gray-600">Will multiple people own this vehicle?</p>
                  </div>
                  <Switch
                    id="multiple-owners"
                    checked={answers.financial.multipleOwners}
                    onCheckedChange={(checked) => updateFinancial('multipleOwners', checked)}
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  🎉 You're all set! Click "See My Matches" to view personalized vehicle recommendations.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="gap-2"
              disabled={
                (step === 3 && !answers.lifestyle.vehicleType) ||
                (step === 4 && !answers.lifestyle.powerTrain) ||
                (step === 5 && !answers.lifestyle.primaryUse) ||
                (step === 8 && !answers.financial.creditScore)
              }
            >
              {step === totalSteps ? 'See My Matches' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
