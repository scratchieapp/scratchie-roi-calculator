export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    
    if (!hubspotApiKey) {
      return res.status(500).json({ 
        success: false,
        message: 'HubSpot API key not configured',
        details: 'HUBSPOT_API_KEY environment variable is missing'
      });
    }

    // Test 1: Check API key validity by getting account info
    const accountResponse = await fetch('https://api.hubapi.com/account-info/v3/details', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!accountResponse.ok) {
      const accountError = await accountResponse.text();
      return res.status(500).json({
        success: false,
        message: 'Invalid HubSpot API key or insufficient permissions',
        details: accountError,
        test: 'account-info'
      });
    }

    const accountData = await accountResponse.json();

    // Test 2: Check contacts permissions
    const contactsTestResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!contactsTestResponse.ok) {
      const contactsError = await contactsTestResponse.text();
      return res.status(500).json({
        success: false,
        message: 'No permission to access contacts',
        details: contactsError,
        test: 'contacts-read'
      });
    }

    // Test 3: Check notes permissions
    const notesTestResponse = await fetch('https://api.hubapi.com/crm/v3/objects/notes?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const notesPermission = notesTestResponse.ok;

    return res.status(200).json({
      success: true,
      message: 'HubSpot API connection successful',
      account: {
        portalId: accountData.portalId,
        domain: accountData.domain,
        timeZone: accountData.timeZone
      },
      permissions: {
        contacts: true,
        notes: notesPermission
      },
      apiKeyPrefix: `${hubspotApiKey.substring(0, 8)}...`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('HubSpot test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during HubSpot test',
      error: error.message
    });
  }
} 