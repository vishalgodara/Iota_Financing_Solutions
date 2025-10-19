import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { localVehicles } from "../data/vehicleData";
import { ChevronDown } from "lucide-react";
import type { SelectedVehicle } from "../App";

const getEstimatedPayment = (price: number) => {
    const downPayment = price * 0.1;
    const loanAmount = price - downPayment;
    const monthlyRate = 0.059 / 12;
    const term = 60;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    return payment;
};

const Tabs = ({ value, onValueChange, children }: { value: string; onValueChange: (value: string) => void; children: React.ReactNode }) => (
    <div className="tabs-container">
        {React.Children.map(children, child =>
            React.isValidElement(child) ? React.cloneElement(child, { value, onValueChange } as any) : child
        )}
    </div>
);

const TabsList = ({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) => (
    <div className="tabs-list">
        {React.Children.map(children, child =>
            React.isValidElement(child) ? React.cloneElement(child, { currentValue: value, onValueChange } as any) : child
        )}
    </div>
);

const TabsTrigger = ({ currentValue, onValueChange, value, children }: { currentValue?: string; onValueChange?: (value: string) => void; value: string; children: React.ReactNode }) => (
    <button
        className="tab-trigger"
        data-state={currentValue === value ? 'active' : 'inactive'}
        onClick={() => onValueChange?.(value)}
    >
        {children}
    </button>
);

type Props = {
    onCalculatePayments: (vehicle: SelectedVehicle) => void;
};

export default function Vehicles({ onCalculatePayments }: Props) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedVehicles, setExpandedVehicles] = useState<number[]>([]);
    const [selectedTrims, setSelectedTrims] = useState<{ [vehicleId: number]: number }>({});
    const vehicles = localVehicles;

    const formatCategory = (category: string) => {
        if (category === 'suv') return 'SUV';
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const filteredVehicles = useMemo(() => {
        if (selectedCategory === 'all') {
            return vehicles;
        }
        return vehicles.filter(v => v.category === selectedCategory);
    }, [vehicles, selectedCategory]);

    const toggleExpanded = (vehicleId: number) => {
        setExpandedVehicles(prev => 
            prev.includes(vehicleId) 
                ? prev.filter(id => id !== vehicleId)
                : [...prev, vehicleId]
        );
    };

    const selectTrim = (vehicleId: number, trimIndex: number) => {
        setSelectedTrims(prev => ({
            ...prev,
            [vehicleId]: trimIndex
        }));
    };

    return (
        <div className="vehicles-page">
            <div className="vehicles-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="header-section"
                >
                    <h1 className="header-title">Browse Vehicles</h1>
                    <p className="header-subtitle">
                        Explore our lineup and see financing options
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                        <TabsList>
                            <TabsTrigger value="all">All Vehicles</TabsTrigger>
                            <TabsTrigger value="sedan">Sedans</TabsTrigger>
                            <TabsTrigger value="suv">SUVs</TabsTrigger>
                            <TabsTrigger value="truck">Trucks</TabsTrigger>
                            <TabsTrigger value="hybrid">Hybrids</TabsTrigger>
                            <TabsTrigger value="electric">Electric</TabsTrigger>
                            <TabsTrigger value="van">Vans</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </motion.div>

                <div className="vehicles-grid">
                    {filteredVehicles.map((vehicle, index) => {
                        const isExpanded = expandedVehicles.includes(vehicle.id);
                        const selectedTrimIndex = selectedTrims[vehicle.id] ?? 0;
                        const selectedTrim = vehicle.trims[selectedTrimIndex];
                        
                        return (
                            <motion.div
                                key={vehicle.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className="vehicle-card"
                            >
                                {vehicle.image_url && (
                                    <div className="card-image-container">
                                        <div className="w-full h-48 flex items-center justify-center bg-white rounded-t-lg">
                                <img
                                    src={vehicle.image_url}
                                    alt={vehicle.model}
                                    className="h-32 w-auto object-contain"
                                />
                                </div>
                                    </div>
                                )}

                                <div className="card-header">
                                    <div className="card-header-top">
                                        <div>
                                            <h3 className="card-model">{vehicle.model}</h3>
                                            <p className="card-trim">{selectedTrim.name}</p>
                                        </div>
                                        <span className="card-badge category-badge">
                                            {formatCategory(vehicle.category)}
                                        </span>
                                    </div>

                                    <div className="card-details">
                                        {selectedTrim.mpg_city && (
                                            <div className="card-detail-item">
                                                <span>{selectedTrim.mpg_city}/{selectedTrim.mpg_highway} MPG{vehicle.category === 'electric' ? 'e' : ''}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-pricing">
                                        <p className="card-pricing-label">MSRP</p>
                                        <p className="card-msrp">
                                            ${selectedTrim.msrp.toLocaleString()}
                                        </p>
                                        <p className="card-est-payment">
                                            Est. ${getEstimatedPayment(selectedTrim.msrp).toFixed(0)}/mo
                                        </p>
                                    </div>

                                    {vehicle.trims.length > 1 && (
                                        <button 
                                            className="view-trims-button"
                                            onClick={() => toggleExpanded(vehicle.id)}
                                        >
                                            <span>View All Trims</span>
                                            <ChevronDown 
                                                className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}
                                            />
                                        </button>
                                    )}

                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="trims-list"
                                        >
                                            {vehicle.trims.map((trim, trimIndex) => (
                                                <button
                                                    key={trimIndex}
                                                    className={`trim-item ${selectedTrimIndex === trimIndex ? 'selected' : ''}`}
                                                    onClick={() => selectTrim(vehicle.id, trimIndex)}
                                                >
                                                    <div className="trim-info">
                                                        <p className="trim-name">{trim.name}</p>
                                                        <p className="trim-mpg">{trim.mpg_city}/{trim.mpg_highway} MPG{vehicle.category === 'electric' ? 'e' : ''}</p>
                                                    </div>
                                                    <div className="trim-pricing">
                                                        <p className="trim-msrp">${trim.msrp.toLocaleString()}</p>
                                                        <p className="trim-payment">${getEstimatedPayment(trim.msrp).toFixed(0)}/mo</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>

                                <div className="card-content">
                                    <button 
                                        className="calculate-button"
                                        onClick={() => onCalculatePayments({
                                            model: vehicle.model,
                                            trim: selectedTrim.name,
                                            year: vehicle.year,
                                            msrp: selectedTrim.msrp,
                                            mpg_city: selectedTrim.mpg_city,
                                            mpg_highway: selectedTrim.mpg_highway,
                                        })}
                                    >
                                        Calculate Payments
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredVehicles.length === 0 && (
                    <div className="no-vehicles">
                        <p className="no-vehicles-text">No vehicles found in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
}