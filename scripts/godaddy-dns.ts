/**
 * GoDaddy DNS Management Script
 * Check and manage DNS records for empathyhealthclinic.com
 */
import axios from 'axios';

const DOMAIN = 'empathyhealthclinic.com';
const API_KEY = process.env.GODADDY_API_KEY;
const API_SECRET = process.env.GODADDY_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('Error: GODADDY_API_KEY and GODADDY_API_SECRET required');
  process.exit(1);
}

const client = axios.create({
  baseURL: 'https://api.godaddy.com/v1',
  headers: {
    'Authorization': `sso-key ${API_KEY}:${API_SECRET}`,
    'Content-Type': 'application/json',
  },
});

async function getDNSRecords() {
  console.log('=== Fetching DNS Records for', DOMAIN, '===\n');
  
  try {
    const response = await client.get(`/domains/${DOMAIN}/records`);
    const records = response.data;
    
    console.log('All Records:');
    records.forEach((r: any) => {
      console.log(`  ${r.type.padEnd(6)} ${r.name.padEnd(20)} → ${r.data}`);
    });
    
    // Check for AAAA records
    const aaaaRecords = records.filter((r: any) => r.type === 'AAAA');
    console.log('\n=== IPv6 (AAAA) Records ===');
    if (aaaaRecords.length === 0) {
      console.log('No AAAA records found (good for avoiding IPv6 issues)');
    } else {
      console.log('Found AAAA records that may need removal:');
      aaaaRecords.forEach((r: any) => {
        console.log(`  ${r.name} → ${r.data}`);
      });
    }
    
    return records;
  } catch (error: any) {
    console.error('Error fetching DNS records:', error.response?.data || error.message);
    throw error;
  }
}

async function removeAAAARecords() {
  console.log('\n=== Removing AAAA Records ===\n');
  
  try {
    const response = await client.get(`/domains/${DOMAIN}/records`);
    const records = response.data;
    
    const aaaaRecords = records.filter((r: any) => r.type === 'AAAA');
    
    if (aaaaRecords.length === 0) {
      console.log('No AAAA records to remove.');
      return;
    }
    
    for (const record of aaaaRecords) {
      console.log(`Removing AAAA record: ${record.name} → ${record.data}`);
      await client.delete(`/domains/${DOMAIN}/records/AAAA/${record.name}`);
      console.log('  Removed successfully');
    }
    
    console.log('\nAll AAAA records removed.');
  } catch (error: any) {
    console.error('Error removing AAAA records:', error.response?.data || error.message);
    throw error;
  }
}

const action = process.argv[2];

if (action === 'remove-ipv6') {
  removeAAAARecords().catch(() => process.exit(1));
} else {
  getDNSRecords().catch(() => process.exit(1));
}
