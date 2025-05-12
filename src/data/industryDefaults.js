export const industryDefaults = {
    AU: {
        Hospitality: {
            default: { trir: 4.5, cost: 18000 },
            QSR: { trir: 5.0, cost: 15000, name: "Quick Service Retail (QSR)" }
        },
        Construction: {
            default: { trir: 9.0, cost: 45000 },
            Residential: { trir: 8.5, cost: 40000, name: "Residential" },
            Commercial: { trir: 9.2, cost: 48000, name: "Commercial" },
            Infrastructure: { trir: 10.5, cost: 55000, name: "Infrastructure" },
            Industrial: { trir: 9.8, cost: 50000, name: "Industrial" }
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
            default: { trir: 3.0, cost: 20000 },
            QSR: { trir: 3.2, cost: 18000, name: "Quick Service Retail (QSR)" }
        },
        Construction: {
            default: { trir: 2.9, cost: 40000 },
            Residential: { trir: 2.7, cost: 38000, name: "Residential" },
            Commercial: { trir: 3.0, cost: 42000, name: "Commercial" },
            Infrastructure: { trir: 3.5, cost: 50000, name: "Infrastructure" },
            Industrial: { trir: 3.2, cost: 45000, name: "Industrial" }
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
    }
}; 