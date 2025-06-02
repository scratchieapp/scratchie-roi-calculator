export const industryDefaults = {
    AU: {
        Hospitality: {
            default: { trir: 15, cost: 86000 },
            QSR: { trir: 15, cost: 86000, name: "Quick Service Restaurants (QSR)" },
            FSR: { trir: 15, cost: 86000, name: "Full Service Restaurants (FSR)" },
            Hotels: { trir: 15, cost: 86000, name: "Hotels & Accommodation" }
        },
        Construction: {
            default: { trir: 9.0, cost: 45000 },
            Residential: { trir: 8.5, cost: 40000, name: "Residential" },
            Commercial: { trir: 9.2, cost: 48000, name: "Commercial" },
            Infrastructure: { trir: 10.5, cost: 55000, name: "Infrastructure" },
            Industrial: { trir: 9.8, cost: 50000, name: "Industrial" },
            Shipbuilding: { trir: 11.0, cost: 60000, name: "Shipbuilding" }
        },
        Manufacturing: { default: { trir: 7.0, cost: 35000 } },
        Logistics: {
            default: { trir: 12.0, cost: 40000 },
            Warehousing: { trir: 13.5, cost: 38000, name: "Warehousing" },
            Trucking: { trir: 11.0, cost: 42000, name: "Trucking/Transport" }
        },
        FacilitiesManagement: { default: { trir: 6.0, cost: 30000, name: "Facilities Management" } },
        Retail: { default: { trir: 5.5, cost: 12000 } },
        Mining: { default: { trir: 3.5, cost: 75000 } },
        Healthcare: { default: { trir: 6.5, cost: 25000, name: "Healthcare & Pharmaceuticals" } },
        Custom: { default: { trir: 5.0, cost: 25000 } }
    },
    US: {
        Hospitality: {
            default: { trir: 15, cost: 86000 },
            QSR: { trir: 15, cost: 86000, name: "Quick Service Restaurants (QSR)" },
            FSR: { trir: 15, cost: 86000, name: "Full Service Restaurants (FSR)" },
            Hotels: { trir: 15, cost: 86000, name: "Hotels & Accommodation" }
        },
        Construction: {
            default: { trir: 2.9, cost: 40000 },
            Residential: { trir: 2.7, cost: 38000, name: "Residential" },
            Commercial: { trir: 3.0, cost: 42000, name: "Commercial" },
            Infrastructure: { trir: 3.5, cost: 50000, name: "Infrastructure" },
            Industrial: { trir: 3.2, cost: 45000, name: "Industrial" },
            Shipbuilding: { trir: 3.8, cost: 55000, name: "Shipbuilding" }
        },
        Manufacturing: { default: { trir: 3.3, cost: 38000 } },
        Logistics: {
            default: { trir: 4.5, cost: 42000 },
            Warehousing: { trir: 4.8, cost: 40000, name: "Warehousing" },
            Trucking: { trir: 4.0, cost: 45000, name: "Trucking/Transport" }
        },
        FacilitiesManagement: { default: { trir: 3.8, cost: 32000, name: "Facilities Management" } },
        Retail: { default: { trir: 3.1, cost: 15000 } },
        Mining: { default: { trir: 1.7, cost: 80000 } },
        Healthcare: { default: { trir: 4.0, cost: 28000, name: "Healthcare & Pharmaceuticals" } },
        Custom: { default: { trir: 3.0, cost: 30000 } }
    },
    SA: {
        Hospitality: {
            default: { trir: 18, cost: 25000 },
            QSR: { trir: 18, cost: 25000, name: "Quick Service Restaurants (QSR)" },
            FSR: { trir: 18, cost: 25000, name: "Full Service Restaurants (FSR)" },
            Hotels: { trir: 18, cost: 25000, name: "Hotels & Accommodation" }
        },
        Construction: {
            default: { trir: 12.0, cost: 35000 },
            Residential: { trir: 11.5, cost: 32000, name: "Residential" },
            Commercial: { trir: 12.2, cost: 36000, name: "Commercial" },
            Infrastructure: { trir: 13.5, cost: 42000, name: "Infrastructure" },
            Industrial: { trir: 12.8, cost: 38000, name: "Industrial" },
            Shipbuilding: { trir: 14.0, cost: 45000, name: "Shipbuilding" }
        },
        Manufacturing: { default: { trir: 9.0, cost: 28000 } },
        Logistics: {
            default: { trir: 15.0, cost: 30000 },
            Warehousing: { trir: 16.5, cost: 28000, name: "Warehousing" },
            Trucking: { trir: 14.0, cost: 32000, name: "Trucking/Transport" }
        },
        FacilitiesManagement: { default: { trir: 8.0, cost: 22000, name: "Facilities Management" } },
        Retail: { default: { trir: 7.5, cost: 15000 } },
        Mining: { default: { trir: 5.5, cost: 55000 } },
        Healthcare: { default: { trir: 8.5, cost: 20000, name: "Healthcare & Pharmaceuticals" } },
        Custom: { default: { trir: 8.0, cost: 20000 } }
    }
}; 