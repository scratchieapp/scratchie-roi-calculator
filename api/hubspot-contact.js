export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, calculationData, inputs } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      console.error('HubSpot API key not configured');
      return res.status(500).json({ message: 'HubSpot integration not configured' });
    }

    // Create or update contact in HubSpot
    const contactData = {
      properties: {
        email: email,
        
        // ROI Calculator specific fields (using your custom properties)
        roi_calculator_completed: true,
        roi_calculator_completion_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format for date picker
        
        // Calculation inputs
        country: inputs?.country || '',
        sector: inputs?.sector || '',
        sub_sector: inputs?.subSector || '',
        peak_workers: inputs?.peakNumWorkers || 0,
        calculation_period_months: inputs?.calculationPeriod || 0,
        
        // Calculation results (storing numeric values for the number fields)
        total_implementation_cost: calculationData?.totalImplementationCost || 0,
        total_benefits: calculationData?.totalBenefits || 0,
        roi_percentage: calculationData?.roi || 0,
        payback_period_months: calculationData?.paybackPeriod === Infinity ? 0 : (calculationData?.paybackPeriod || 0),
        
        // Lead source and lifecycle
        hs_lead_status: 'NEW',
        lead_source: 'ROI Calculator',
        lifecyclestage: 'lead' // Note: HubSpot uses 'lifecyclestage' not 'lifecycle_stage'
      }
    };

    // First, try to find existing contact
    const searchResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: email
                }
              ]
            }
          ]
        })
      }
    );

    let contactId = null;
    let isNewContact = true;

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.results && searchData.results.length > 0) {
        contactId = searchData.results[0].id;
        isNewContact = false;
      }
    }

    let hubspotResponse;

    if (isNewContact) {
      // Create new contact
      hubspotResponse = await fetch(
        'https://api.hubapi.com/crm/v3/objects/contacts',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hubspotApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        }
      );
    } else {
      // Update existing contact
      hubspotResponse = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${hubspotApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        }
      );
    }

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API error:', errorText);
      return res.status(500).json({ 
        message: 'Failed to sync with HubSpot', 
        error: errorText 
      });
    }

    const hubspotData = await hubspotResponse.json();

    // Create a note/activity about the ROI calculation
    const noteData = {
      properties: {
        hs_note_body: `ROI Calculator Completed - Detailed Summary

📊 CALCULATION INPUTS:
• Country: ${inputs?.country || 'N/A'}
• Sector: ${inputs?.sector || 'N/A'}
• Sub-Sector: ${inputs?.subSector || 'N/A'}
• Peak Workers: ${inputs?.peakNumWorkers || 'N/A'}
• Calculation Period: ${inputs?.calculationPeriod || 'N/A'} months
• Worker Hourly Rate: $${inputs?.workerHourlyRate || 'N/A'}
• Current Incident Rate: ${inputs?.incidentRate || 'N/A'}
• Cost per Incident: $${inputs?.costPerIncident || 'N/A'}
• Expected Incident Reduction: ${inputs?.incidentReduction || 'N/A'}%
• Monthly Reward Budget: $${inputs?.rewardBudget || 'N/A'}
• Includes Training: ${inputs?.includeOnSiteTraining ? 'Yes' : 'No'}

💰 CALCULATION RESULTS:
• Total Investment: $${calculationData?.totalImplementationCost?.toLocaleString() || 'N/A'}
• Total Benefits: $${calculationData?.totalBenefits?.toLocaleString() || 'N/A'}
• Net Benefit: $${calculationData?.netBenefit?.toLocaleString() || 'N/A'}
• ROI: ${calculationData?.roi || 'N/A'}%
• Payback Period: ${calculationData?.paybackPeriod === Infinity ? 'Immediate' : `${calculationData?.paybackPeriod || 'N/A'} months`}
• Benefit-Cost Ratio: ${calculationData?.benefitCostRatio === Infinity ? 'Infinite' : `${calculationData?.benefitCostRatio || 'N/A'}:1`}

📧 Contact received PDF business case via email.
🗓️ Generated: ${new Date().toLocaleString()}

Next Steps: Follow up to discuss implementation and answer any questions.`,
        hs_timestamp: new Date().toISOString()
      },
      associations: [
        {
          to: {
            id: hubspotData.id
          },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 202 // Contact to Note association
            }
          ]
        }
      ]
    };

    // Create the note using the correct endpoint
    const noteResponse = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });

    if (!noteResponse.ok) {
      console.warn('Failed to create note in HubSpot, but contact was synced successfully');
    }

    return res.status(200).json({ 
      message: 'Contact synced with HubSpot successfully',
      contactId: hubspotData.id,
      isNewContact
    });

  } catch (error) {
    console.error('HubSpot sync error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
} 